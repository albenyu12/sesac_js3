import { Link } from 'react-router-dom';

export default function AuthRequiredPage() {
    return (
        <div>
            <h2>로그인이 필요합니다.</h2>
            <p>이 페이지는 로그인한 사용자만 접근할 수 있습니다. <br />
                로그인 후 다시 시도해 주세요.
            </p>
            <div>
                <Link to='/login'>
                    로그인 하러 가기
                </Link>
            </div>
        </div>
    )
}