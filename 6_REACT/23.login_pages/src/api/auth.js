export function fetchLogin({ id, pw}) {
    // 실제로 fetch 정말 하면 됨.

    // 가상의 로그인 시도
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === 'admin' && pw === '1234') {
                resolve({ ok: true, user: { id }});
            } else {
                reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.'));
            }
        }, 1000); // 적절하게 조정... 500, 300, ...
    });
}