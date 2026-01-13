import TextInput from './TextInput';

export default function LoginForm({ 
    form, 
    message,
    canSubmit, // 부모로부터 입력 완료 상태를 받아옴
    onChange, 
    onSubmit,
    idRef,
    pwRef,
}) {
    const boxStyle = {
        padding: 10, 
        borderRadius: 8,
        border: '1px solid #ddd', 
    }

    const messageStyle = 
        message.type === 'success' 
            ? { ...boxStyle, borderColor: '#16a34a', background: '#dcfce7' }
            : message.type === 'error'
            ? { ...boxStyle, borderColor: '#dc2626', background: '#fee2e2' }
            : boxStyle

    return (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
            <TextInput label="아이디" name="id" value={form.id} onChange={onChange} inputRef={idRef} />

            <TextInput 
                label="비밀번호" 
                name="pw" 
                type="password" 
                value={form.pw} 
                onChange={onChange} 
                inputRef={pwRef}
            />

            {/* 아이디 저장 체크박스 */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8}}>
                <input 
                    type="checkbox" 
                    checked={form.rememberId} 
                    onChange={(e) => onChange('rememberId', e.target.checked)}
                />
                아이디 저장
            </label>

            {/* 입력이 덜됐으면 버튼 비활성화 */}
            <button type="submit" disabled={!canSubmit}>로그인</button>

            {message.text && <div style={messageStyle}>{message.text}</div>}
        </form>
    )
}