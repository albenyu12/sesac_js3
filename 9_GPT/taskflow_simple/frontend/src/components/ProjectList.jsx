import { useState, useEffect } from 'react';
import { PencilSimple, X } from '@phosphor-icons/react';
import { api } from '../api.js';

export function ProjectList({ workspaces, selectedWs, onWsChange, projects, onProjectSelect, onProjectUpdate }) {
    const [newProjectName, setNewProjectName] = useState('');

    // Project Editing State
    const [editingProject, setEditingProject] = useState(null);
    const [editProjName, setEditProjName] = useState('');
    const [editProjDesc, setEditProjDesc] = useState('');

    async function createProject() {
        const name = newProjectName.trim();
        if (!name) return;
        await api.createProject(selectedWs, { name, description: '' });
        setNewProjectName('');
        onProjectUpdate(); // Refresh list
    }

    function openEditProject(e, project) {
        e.stopPropagation();
        setEditingProject(project);
        setEditProjName(project.name);
        setEditProjDesc(project.description || '');
    }

    async function saveProject() {
        if (!editingProject) return;
        try {
            await api.updateProject(editingProject.id, { name: editProjName, description: editProjDesc });
            setEditingProject(null);
            onProjectUpdate(); // Refresh list
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">워크스페이스</h3>
            <div className="mb-6">
                <select className="input" value={selectedWs} onChange={(e) => onWsChange(e.target.value)}>
                    {workspaces.map(w => <option key={w.id} value={w.id}>{w.name} ({w.role})</option>)}
                </select>
            </div>

            <div className="hr" />

            <h3 className="text-lg font-semibold mb-4">프로젝트</h3>
            <div className="flex gap-2 mb-6">
                <input className="input" placeholder="새 프로젝트 이름" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
                <button className="btn primary whitespace-nowrap" onClick={createProject}>추가</button>
            </div>

            <div className="grid gap-4">
                {projects.map((p) => (
                    <div className="card hover:border-pastel-purple transition-colors cursor-pointer group" key={p.id} onClick={() => onProjectSelect(p.id)}>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-bold text-lg mb-1 flex items-center gap-2">
                                    {p.name}
                                    <button
                                        className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                                        onClick={(e) => openEditProject(e, p)}
                                    >
                                        <PencilSimple size={16} />
                                    </button>
                                </div>
                                <div className="text-gray-500 text-sm">{p.description || '설명 없음'}</div>
                            </div>
                            <button className="btn primary text-sm">보드 열기</button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && <div className="text-gray-400 text-center py-8">프로젝트가 없습니다. 위에서 추가해보세요.</div>}
            </div>

            {/* Project Edit Modal */}
            {editingProject && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditingProject(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4 flex justify-between">
                            프로젝트 수정
                            <button className="text-gray-400 hover:text-gray-600" onClick={() => setEditingProject(null)}>
                                <X size={20} />
                            </button>
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트 이름</label>
                                <input
                                    className="input"
                                    value={editProjName}
                                    onChange={e => setEditProjName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                                <textarea
                                    className="input min-h-[100px] resize-none"
                                    value={editProjDesc}
                                    onChange={e => setEditProjDesc(e.target.value)}
                                    placeholder="프로젝트 설명을 입력하세요"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-6">
                                <button className="btn" onClick={() => setEditingProject(null)}>취소</button>
                                <button className="btn primary" onClick={saveProject}>저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
