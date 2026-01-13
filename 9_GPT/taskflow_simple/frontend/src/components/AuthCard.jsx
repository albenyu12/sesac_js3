import { useState } from 'react';
import { api, setToken } from '../api.js';

function Field({ label, value, onChange, type = 'text' }) {
    return (
        <label style={{ display: 'grid', gap: 6, width: '100%' }}>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
        </label>
    );
}

export function AuthCard({ onAuthed }) {
    const [mode, setMode] = useState('login'); // login | signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    async function submit() {
        setMsg('');
        setLoading(true);
        try {
            if (mode === 'signup') {
                await api.signup({ email, password, name });
                setMsg('✅ 가입 완료! 이제 로그인 해주세요.');
                setMode('login');
            } else {
                const data = await api.login({ email, password });
                setToken(data.accessToken);
                onAuthed();
            }
        } catch (e) {
            setMsg(`❌ ${e.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card w-full max-w-md mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-2">TaskFlow</h2>
            <p className="text-gray-500 mb-6">
                {mode === 'login' ? '로그인 후 워크스페이스/보드를 확인합니다.' : '간단 가입 후 바로 사용 가능합니다.'}
            </p>

            <div className="flex gap-2 mb-6">
                <button className={`flex-1 btn ${mode === 'login' ? 'primary' : ''}`} onClick={() => setMode('login')}>로그인</button>
                <button className={`flex-1 btn ${mode === 'signup' ? 'primary' : ''}`} onClick={() => setMode('signup')}>회원가입</button>
            </div>

            <div className="grid gap-4">
                {mode === 'signup' && <Field label="이름" value={name} onChange={setName} />}
                <Field label="이메일" value={email} onChange={setEmail} />
                <Field label="비밀번호" value={password} onChange={setPassword} type="password" />
                <button className="btn primary w-full mt-2" onClick={submit} disabled={loading}>
                    {loading ? '처리중...' : (mode === 'login' ? '로그인' : '가입하기')}
                </button>
                {msg && <div className="text-sm text-center text-red-500 font-medium" role="alert">{msg}</div>}
            </div>
        </div>
    );
}
