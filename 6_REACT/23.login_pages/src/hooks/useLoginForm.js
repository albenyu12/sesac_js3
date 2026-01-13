import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchLogin } from '../api/auth';

const SAVED_ID_KEY = 'saved_login_id'

function getInitialForm() {
    const savedId = localStorage.getItem(SAVED_ID_KEY) || '';
    return {
        id: savedId,
        pw: '',
        rememberId: Boolean(savedId),
    };
}

export function useLoginForm() {
    const [form, setForm] = useState(() => getInitialForm()); // lazy init. 이 페이지가 불릴때 1회만 호출.
    const [message, setMessage] = useState({ type: '', text: ''}); // 성공/실패 메시지를 담았다가 출력할곳

    const idRef = useRef(null);
    const pwRef = useRef(null);

    const updateField = (name, value) => {
        setForm((prev) => {
            const next = { ...prev, [name]: value };

            if (name === 'rememberId') {
                if (!value) {
                    localStorage.removeItem(SAVED_ID_KEY);
                } else if (prev.id.trim()) {
                    localStorage.setItem(SAVED_ID_KEY, prev.id.trim());
                }
            }
            return next;
        });
    };

    // 이런것들은 useMemo() 를 통해서 관리하면 더 좋음.
    const canSubmit = useMemo(() => {
        return form.id.trim() !== '' && form.pw.trim() !== '';
    }, [form.id, form.pw]);

    // 로그인 시 id 또는 pw 입력창에 자동 포커스
    useEffect(() => {
        idRef.current?.focus();
        if (form.id) pwRef.current?.focus();
    }, []);

    // 로그인 성공 후 성공 메시지 2초후에 지우기
    useEffect(() => {
        if (message.type !== 'success') return;

        const timer = setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 2000); // 2초 후에 메시지 상태변수 초기화

        // cleanup 함수
        return () => clearTimeout(timer);
    }, [message.type, message.text]) 


    const submit = async() => {
        const id = form.id.trim();
        const pw = form.pw.trim();

        // 지워도 무방하고...
        if (!id || !pw) { // 둘중에 하나라도 빈 값이면? 오류...
            setMessage({type: 'error', text: '아이디와 비밀번호를 모두 입력해 주세요.'});
            return;
        }

        try {
            const {ok, user} = await fetchLogin({id, pw});
            if (!ok) throw new Error('로그인에 실패했습니다.');

            setMessage({type: 'success', text:'로그인 성공'});
            setForm((prev) => ({...prev, pw: ''}));

            // 로그인 성공 후 사용자 정보 반환
            return user
        } catch (err) {
            setMessage({type: 'error', text: `로그인 실패: ${err.message || '오류가 발생했습니다.'}`});
            setForm((prev) => ({...prev, pw: ''}));
            throw err;
        }
    }

    return {
        form, message, canSubmit,
        updateField, submit, 
        idRef, pwRef,
    }
}