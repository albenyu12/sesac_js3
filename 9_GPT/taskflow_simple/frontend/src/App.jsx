import { useEffect, useMemo, useState } from 'react';
import { api, setToken, getToken } from './api.js';
import { Board } from './pages/Board';
import { GanttChart } from './pages/GanttChart';
import { AuthCard } from './components/AuthCard';
import { ProjectList } from './components/ProjectList';
import './styles.css';

function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(!!getToken());
  const [user, setUser] = useState(null);

  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedWs, setSelectedWs] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'gantt'
  const [msg, setMsg] = useState('');

  async function bootstrap() {
    setMsg('');
    setReady(false);
    try {
      const me = await api.me();
      setUser(me);

      const ws = await api.workspaces();
      setWorkspaces(ws.items);
      const firstWs = ws.items[0]?.id || '';
      setSelectedWs(firstWs);

      if (firstWs) {
        const ps = await api.projects(firstWs);
        setProjects(ps.items);
      } else {
        setProjects([]);
      }
    } catch (e) {
      setMsg(e.message);
      setAuthed(false);
      setToken('');
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    if (authed) bootstrap();
    else setReady(true);
  }, [authed]);

  function loadProjects() {
    if (!selectedWs) return;
    api.projects(selectedWs)
      .then((d) => setProjects(d.items))
      .catch(() => setProjects([]));
  }

  useEffect(() => {
    if (!authed || !selectedWs) return;
    loadProjects();
  }, [selectedWs, authed]);


  function logout() {
    setToken('');
    setAuthed(false);
    setUser(null);
    setSelectedProject('');
    setViewMode('board');
  }

  const canShow = useMemo(() => authed && ready, [authed, ready]);

  if (!authed) return <AuthCard onAuthed={() => setAuthed(true)} />;

  if (!ready) return <div className="container mt-20 text-center text-gray-500">초기화 중...</div>;

  if (selectedProject) {
    if (viewMode === 'gantt') {
      return <GanttChart projectId={selectedProject} onBack={() => setViewMode('board')} />;
    }
    return (
      <Board
        projectId={selectedProject}
        onBack={() => { setSelectedProject(''); setViewMode('board'); }}
        onViewGantt={() => setViewMode('gantt')}
      />
    );
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">TaskFlow</h2>
          <div className="text-gray-500 mt-1">안녕하세요, {user?.name} 님</div>
        </div>
        <button className="btn text-sm" onClick={logout}>로그아웃</button>
      </div>

      {msg && <div className="card bg-red-50 text-red-600 mb-6 font-medium">오류: {msg}</div>}

      <div className="hr" />

      <ProjectList
        workspaces={workspaces}
        selectedWs={selectedWs}
        onWsChange={setSelectedWs}
        projects={projects}
        onProjectSelect={setSelectedProject}
        onProjectUpdate={loadProjects}
      />
    </div>
  );
}

export default App;
