import { openDb, run } from './db.js';
import { uid } from './utils.js';
import bcrypt from 'bcryptjs';

async function seed() {
    const dbPath = process.env.DB_PATH || './db/taskflow.sqlite';
    const db = openDb(dbPath);

    console.log('🌱 Seeding for Jan 2026...');

    // specialized cleanup
    // Just wipe everything to be clean
    await run(db, 'DELETE FROM tasks');
    await run(db, 'DELETE FROM columns');
    await run(db, 'DELETE FROM projects');
    await run(db, 'DELETE FROM memberships');
    await run(db, 'DELETE FROM workspaces');
    await run(db, 'DELETE FROM users');

    // 1. Create User
    const userId = uid('u');
    const email = 'user@example.com';
    const passHash = await bcrypt.hash('password', 10);
    await run(db, 'INSERT INTO users(id,email,password_hash,name) VALUES (?,?,?,?)', [userId, email, passHash, 'Test User']);

    // 2. Create Workspace
    const wsId = uid('w');
    await run(db, 'INSERT INTO workspaces(id,name) VALUES (?,?)', [wsId, '2026 Planning']);
    await run(db, 'INSERT INTO memberships(id,workspace_id,user_id,role) VALUES (?,?,?,?)', [uid('m'), wsId, userId, 'owner']);

    // 3. Create Project
    const projId = uid('p');
    await run(db, 'INSERT INTO projects(id,workspace_id,name,description,created_by) VALUES (?,?,?,?,?)',
        [projId, wsId, 'Jan 2026 Launch', 'Strategic plan for the new year', userId]
    );

    // 4. Create Columns
    const cols = [
        { name: 'Todo', id: uid('c'), ord: 1 },
        { name: 'Doing', id: uid('c'), ord: 2 },
        { name: 'Done', id: uid('c'), ord: 3 },
    ];
    for (const c of cols) {
        await run(db, 'INSERT INTO columns(id,project_id,name,ord) VALUES (?,?,?,?)', [c.id, projId, c.name, c.ord]);
    }

    // 5. Create Tasks for Jan 2026 (4 weeks)
    const tasks = [
        // Week 1: Planning
        { title: 'Kickoff Meeting', start: '2026-01-02', end: '2026-01-02', col: cols[2], priority: 'high' },
        { title: 'Requirement Analysis', start: '2026-01-05', end: '2026-01-07', col: cols[2], priority: 'high' },
        { title: 'Resource Allocation', start: '2026-01-06', end: '2026-01-08', col: cols[2], priority: 'medium' },

        // Week 2: Design
        { title: 'UI Design Draft', start: '2026-01-09', end: '2026-01-13', col: cols[1], priority: 'high' },
        { title: 'Database Schema', start: '2026-01-12', end: '2026-01-14', col: cols[1], priority: 'high' },
        { title: 'API Specification', start: '2026-01-13', end: '2026-01-16', col: cols[1], priority: 'medium' },

        // Week 3: Implementation
        { title: 'Frontend Setup', start: '2026-01-16', end: '2026-01-19', col: cols[0], priority: 'medium' },
        { title: 'Authentication Service', start: '2026-01-19', end: '2026-01-22', col: cols[0], priority: 'high' },
        { title: 'Core Features', start: '2026-01-21', end: '2026-01-27', col: cols[0], priority: 'medium' },

        // Week 4: Testing & Review
        { title: 'Unit Testing', start: '2026-01-26', end: '2026-01-29', col: cols[0], priority: 'low' },
        { title: 'Integration Testing', start: '2026-01-28', end: '2026-01-30', col: cols[0], priority: 'medium' },
        { title: 'Final Review', start: '2026-01-30', end: '2026-01-31', col: cols[0], priority: 'high' },

        // Feb 2026
        { title: 'Feb Marketing Campaign', start: '2026-02-02', end: '2026-02-14', col: cols[0], priority: 'high' },
        { title: 'Beta Release', start: '2026-02-16', end: '2026-02-20', col: cols[2], priority: 'medium' },
        { title: 'User Feedback Analysis', start: '2026-02-23', end: '2026-02-27', col: cols[1], priority: 'low' },

        // Mar 2026
        { title: 'v1.1 Planning', start: '2026-03-02', end: '2026-03-06', col: cols[0], priority: 'medium' },
        { title: 'Performance Optimization', start: '2026-03-09', end: '2026-03-20', col: cols[1], priority: 'high' },
    ];

    let ord = 1;
    for (const t of tasks) {
        const taskId = uid('t');
        await run(db, `
      INSERT INTO tasks(id, project_id, column_id, title, description, start_date, due_date, end_date, priority, status, ord, created_by)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `, [
            taskId, projId, t.col.id, t.title, 'Generated task',
            t.start, t.end, t.end, // using due_date=end_date for simplicity
            t.priority, 'open', ord++, userId
        ]);
    }

    console.log(`✅ Seeded ${tasks.length} tasks for Jan 2026.`);
    console.log(`User: email=${email}, password=password`);
}

seed().catch(console.error);
