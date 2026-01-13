import express from 'express';
import bcrypt from 'bcryptjs';
import { openDb, run, get, all } from './db.js';
import { signToken, authRequired } from './auth.js';
import { uid, ok, fail } from './utils.js';

export function createRouter() {
  const router = express.Router();
  const dbPath = process.env.DB_PATH || './db/taskflow.sqlite';
  const db = openDb(dbPath);

  // -------- Auth --------
  router.post('/auth/signup', async (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) return fail(res, 400, 'VALIDATION_ERROR', 'email, password, name are required');

    const exists = await get(db, 'SELECT id FROM users WHERE email = ?', [email]).catch(() => null);
    if (exists) return fail(res, 409, 'CONFLICT', 'Email already exists');

    const userId = uid('u');
    const hash = await bcrypt.hash(password, 10);

    await run(db, 'INSERT INTO users(id,email,password_hash,name) VALUES (?,?,?,?)', [userId, email, hash, name]);

    // Seed: create personal workspace + default project + default columns
    const wsId = uid('w');
    await run(db, 'INSERT INTO workspaces(id,name) VALUES (?,?)', [wsId, `${name}의 워크스페이스`]);
    await run(db, 'INSERT INTO memberships(id,workspace_id,user_id,role) VALUES (?,?,?,?)', [uid('m'), wsId, userId, 'owner']);

    const projId = uid('p');
    await run(db, 'INSERT INTO projects(id,workspace_id,name,description,created_by) VALUES (?,?,?,?,?)',
      [projId, wsId, '첫 프로젝트', '자동 생성된 기본 프로젝트', userId]
    );

    const columns = [
      { name: 'Todo', ord: 1 },
      { name: 'Doing', ord: 2 },
      { name: 'Done', ord: 3 },
    ];
    for (const c of columns) {
      await run(db, 'INSERT INTO columns(id,project_id,name,ord) VALUES (?,?,?,?)', [uid('c'), projId, c.name, c.ord]);
    }

    return res.status(201).json({ ok: true, data: { userId, workspaceId: wsId, projectId: projId } });
  });

  router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return fail(res, 400, 'VALIDATION_ERROR', 'email and password are required');

    const user = await get(db, 'SELECT id,email,password_hash,name FROM users WHERE email = ?', [email]).catch(() => null);
    if (!user) return fail(res, 401, 'UNAUTHORIZED', 'Invalid email or password');

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return fail(res, 401, 'UNAUTHORIZED', 'Invalid email or password');

    const accessToken = signToken({ id: user.id, email: user.email, name: user.name });
    return ok(res, { accessToken, user: { id: user.id, email: user.email, name: user.name } });
  });

  router.get('/auth/me', authRequired, async (req, res) => {
    const u = await get(db, 'SELECT id,email,name,created_at FROM users WHERE id = ?', [req.user.id]).catch(() => null);
    if (!u) return fail(res, 404, 'NOT_FOUND', 'User not found');
    return ok(res, u);
  });

  // -------- Workspaces --------
  router.get('/workspaces', authRequired, async (req, res) => {
    const rows = await all(db, `
      SELECT w.id, w.name, m.role
      FROM memberships m
      JOIN workspaces w ON w.id = m.workspace_id
      WHERE m.user_id = ?
      ORDER BY w.created_at DESC
    `, [req.user.id]);
    return ok(res, { items: rows });
  });

  // -------- Projects --------
  router.get('/workspaces/:workspaceId/projects', authRequired, async (req, res) => {
    const { workspaceId } = req.params;
    // membership check
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [workspaceId, req.user.id]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access to workspace');

    const rows = await all(db, `
      SELECT id, workspace_id as workspaceId, name, description, created_at as createdAt
      FROM projects
      WHERE workspace_id = ?
      ORDER BY created_at DESC
    `, [workspaceId]);
    return ok(res, { items: rows });
  });

  router.post('/workspaces/:workspaceId/projects', authRequired, async (req, res) => {
    const { workspaceId } = req.params;
    const { name, description = '' } = req.body || {};
    if (!name) return fail(res, 400, 'VALIDATION_ERROR', 'name is required');

    const mem = await get(db, 'SELECT role FROM memberships WHERE workspace_id=? AND user_id=?', [workspaceId, req.user.id]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access to workspace');

    const projectId = uid('p');
    await run(db, 'INSERT INTO projects(id,workspace_id,name,description,created_by) VALUES (?,?,?,?,?)',
      [projectId, workspaceId, name, description, req.user.id]
    );

    // default columns
    const cols = [
      { name: 'Todo', ord: 1 },
      { name: 'Doing', ord: 2 },
      { name: 'Done', ord: 3 },
    ];
    for (const c of cols) {
      await run(db, 'INSERT INTO columns(id,project_id,name,ord) VALUES (?,?,?,?)', [uid('c'), projectId, c.name, c.ord]);
    }

    return res.status(201).json({ ok: true, data: { id: projectId, workspaceId, name, description } });
  });

  router.get('/projects/:projectId/board', authRequired, async (req, res) => {
    const { projectId } = req.params;

    // membership via project -> workspace
    const proj = await get(db, 'SELECT id, workspace_id FROM projects WHERE id=?', [projectId]).catch(() => null);
    if (!proj) return fail(res, 404, 'NOT_FOUND', 'Project not found');

    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [proj.workspace_id, req.user.id]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access to project');

    const columns = await all(db, 'SELECT id, name, ord FROM columns WHERE project_id=? ORDER BY ord ASC', [projectId]);
    const tasks = await all(db, `
      SELECT id, column_id as columnId, project_id as projectId, title, description, assignee_id as assigneeId,
             due_date as dueDate, start_date as startDate, end_date as endDate, priority, status, ord, created_at as createdAt
      FROM tasks
      WHERE project_id=?
      ORDER BY column_id, ord
    `, [projectId]);

    // group tasks by column
    const byCol = {};
    for (const c of columns) byCol[c.id] = [];
    for (const t of tasks) {
      if (!byCol[t.columnId]) byCol[t.columnId] = [];
      byCol[t.columnId].push(t);
    }

    return ok(res, { project: proj, columns, tasksByColumn: byCol });
  });

  router.patch('/projects/:projectId', authRequired, async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body || {};

    const proj = await get(db, 'SELECT id, workspace_id FROM projects WHERE id=?', [projectId]).catch(() => null);
    if (!proj) return fail(res, 404, 'NOT_FOUND', 'Project not found');

    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [proj.workspace_id, req.user.id]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access to project');

    const updates = [];
    const values = [];
    if (name !== undefined) { updates.push('name=?'); values.push(name); }
    if (description !== undefined) { updates.push('description=?'); values.push(description); }

    if (updates.length > 0) {
      values.push(projectId);
      await run(db, `UPDATE projects SET ${updates.join(', ')} WHERE id=?`, values);
    }

    return ok(res, { id: projectId, name, description });
  });

  // -------- Tasks --------
  router.post('/columns/:columnId/tasks', authRequired, async (req, res) => {
    const { columnId } = req.params;
    const { title, description = '', dueDate = null, startDate = null, endDate = null, priority = 'medium' } = req.body || {};
    if (!title) return fail(res, 400, 'VALIDATION_ERROR', 'title is required');

    const col = await get(db, 'SELECT id, project_id FROM columns WHERE id=?', [columnId]).catch(() => null);
    if (!col) return fail(res, 404, 'NOT_FOUND', 'Column not found');

    const proj = await get(db, 'SELECT workspace_id FROM projects WHERE id=?', [col.project_id]).catch(() => null);
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [proj.workspace_id, req.user.id]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

    const maxRow = await get(db, 'SELECT COALESCE(MAX(ord), 0) as m FROM tasks WHERE column_id=?', [columnId]);
    const ord = (maxRow?.m || 0) + 1;

    const taskId = uid('t');
    await run(db, `
      INSERT INTO tasks(id, project_id, column_id, title, description, due_date, start_date, end_date, priority, status, ord, created_by)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `, [taskId, col.project_id, columnId, title, description, dueDate, startDate, endDate, priority, 'open', ord, req.user.id]);

    return res.status(201).json({ ok: true, data: { id: taskId, columnId, projectId: col.project_id, title, description, dueDate, startDate, endDate, priority, status: 'open', ord } });
  });

  router.patch('/tasks/:taskId', authRequired, async (req, res) => {
    const { taskId } = req.params;
    const { title, description, dueDate, startDate, endDate, priority } = req.body || {};

    const task = await get(db, 'SELECT id, project_id FROM tasks WHERE id=?', [taskId]).catch(() => null);
    if (!task) return fail(res, 404, 'NOT_FOUND', 'Task not found');

    const proj = await get(db, 'SELECT workspace_id FROM projects WHERE id=?', [task.project_id]).catch(() => null);
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [proj.workspace_id, req.user.id]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

    const updates = [];
    const values = [];
    if (title !== undefined) { updates.push('title=?'); values.push(title); }
    if (description !== undefined) { updates.push('description=?'); values.push(description); }
    if (dueDate !== undefined) { updates.push('due_date=?'); values.push(dueDate); }
    if (startDate !== undefined) { updates.push('start_date=?'); values.push(startDate); }
    if (endDate !== undefined) { updates.push('end_date=?'); values.push(endDate); }
    if (priority !== undefined) { updates.push('priority=?'); values.push(priority); }

    if (updates.length > 0) {
      values.push(taskId);
      await run(db, `UPDATE tasks SET ${updates.join(', ')} WHERE id=?`, values);
    }

    // Return updated task
    const updated = await get(db, `
      SELECT id, column_id as columnId, project_id as projectId, title, description, assignee_id as assigneeId,
             due_date as dueDate, start_date as startDate, end_date as endDate, priority, status, ord, created_at as createdAt
      FROM tasks WHERE id=?
    `, [taskId]);

    return ok(res, updated);
  });

  router.patch('/tasks/:taskId/move', authRequired, async (req, res) => {
    const { taskId } = req.params;
    const { toColumnId, toOrder } = req.body || {};
    if (!toColumnId || !toOrder) return fail(res, 400, 'VALIDATION_ERROR', 'toColumnId and toOrder are required');

    const task = await get(db, 'SELECT id, project_id, column_id, ord FROM tasks WHERE id=?', [taskId]).catch(() => null);
    if (!task) return fail(res, 404, 'NOT_FOUND', 'Task not found');

    const proj = await get(db, 'SELECT workspace_id FROM projects WHERE id=?', [task.project_id]).catch(() => null);
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [proj.workspace_id, req.user.id]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

    // naive reorder in destination column:
    // 1) shift down tasks with ord >= toOrder in destination column
    await run(db, 'UPDATE tasks SET ord = ord + 1 WHERE column_id=? AND ord >= ?', [toColumnId, toOrder]);

    // 2) set task to destination
    await run(db, 'UPDATE tasks SET column_id=?, ord=? WHERE id=?', [toColumnId, toOrder, taskId]);

    // 3) compact source column orders (simple)
    const srcTasks = await all(db, 'SELECT id FROM tasks WHERE column_id=? ORDER BY ord ASC', [task.column_id]);
    let i = 1
    for (const r of srcTasks) {
      await run(db, 'UPDATE tasks SET ord=? WHERE id=?', [i++, r.id]);
    }
    const dstTasks = await all(db, 'SELECT id FROM tasks WHERE column_id=? ORDER BY ord ASC', [toColumnId]);
    i = 1
    for (const r of dstTasks) {
      await run(db, 'UPDATE tasks SET ord=? WHERE id=?', [i++, r.id]);
    }

    return ok(res, { taskId, toColumnId, toOrder });
  });

  router.delete('/tasks/:taskId', authRequired, async (req, res) => {
    const { taskId } = req.params;
    const task = await get(db, 'SELECT id, project_id, column_id FROM tasks WHERE id=?', [taskId]).catch(() => null);
    if (!task) return fail(res, 404, 'NOT_FOUND', 'Task not found');

    const proj = await get(db, 'SELECT workspace_id FROM projects WHERE id=?', [task.project_id]).catch(() => null);
    const mem = await get(db, 'SELECT id FROM memberships WHERE workspace_id=? AND user_id=?', [proj.workspace_id, req.user.id]).catch(() => null);
    if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

    await run(db, 'DELETE FROM tasks WHERE id=?', [taskId]);

    // compact column
    const rows = await all(db, 'SELECT id FROM tasks WHERE column_id=? ORDER BY ord ASC', [task.column_id]);
    let ord = 1;
    for (const r of rows) {
      await run(db, 'UPDATE tasks SET ord=? WHERE id=?', [ord++, r.id]);
    }

    return ok(res, { deleted: true });
  });

  // Health
  router.get('/health', (req, res) => ok(res, { status: 'ok' }));

  return router;
}
