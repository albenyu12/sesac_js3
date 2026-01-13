// 인증이 안되서, 접근 불가를 알리기 위한 페이지
import AuthRequiredPage from '../pages/AuthRequiredPage.jsx';

import { useAuth } from './AuthProvider.jsx';

export default function ProtectedRoute({ children }) {
    const { isAuthed } = useAuth();

    if (!isAuthed) {
        return (
            <AuthRequiredPage />
        );
    }

    return children;
}