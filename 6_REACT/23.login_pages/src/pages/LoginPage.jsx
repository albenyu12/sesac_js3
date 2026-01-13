// useRef 는 DOM 및 랜더링과 무관한 DOM 요소를 제어하기 위해 사용한다.

import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import { useAuth } from '../auth/AuthProvider';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        form, message, canSubmit,
        updateField, submit,
        idRef, pwRef
    } = useLoginForm();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await submit();
            console.log('로그인 결과: ', user);
            login(user);

            // 로그인 성공 후 이동...
            navigate('/profile');
        } catch {
            // 일단은 이건 스킵
        }
    };

    return (
        <div style={{ maxWidth: 360, margin: '40px auto'}}>
            <h2>로그인</h2>

            <LoginForm 
                form={form} 
                message={message}
                canSubmit={canSubmit} 
                onChange={updateField} 
                onSubmit={handleSubmit}
                idRef={idRef}
                pwRef={pwRef}
            />
        </div>
    );
}