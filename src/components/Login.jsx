import React, { useState } from 'react';
import styled from 'styled-components';

const Login = ({ onLoginSuccess, onRegister }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            const response = await fetch('https://8a2257e5-db34-401e-950e-a59b46d67e57.mock.pstmn.io/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLoginSuccess(data.userId, data.token); // 로그인 성공 시 사용자 ID와 토큰을 전달
            } else {
                setError(data.message || '아이디 또는 비밀번호가 잘못되었습니다.');
            }
        } catch (error) {
            setError('서버에 연결할 수 없습니다.');
            console.error('로그인 오류:', error);
        }
    };

    return (
        <LoginContainer>
            <h2>로그인</h2>
            <Input
                type="text"
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <LoginButton onClick={handleLogin}>로그인</LoginButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <RegisterButton onClick={onRegister}>회원가입</RegisterButton>
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: #2f3136;
    color: white;
    border-radius: 8px;
    max-width: 400px;
    margin: 0 auto;
    margin-top: 100px;
`;

const Input = styled.input`
    padding: 10px;
    margin: 10px 0;
    width: 100%;
    background-color: #40444b;
    border: none;
    border-radius: 4px;
    color: white;
`;

const LoginButton = styled.button`
    background-color: #5865f2;
    color: white;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    margin-top: 10px;
    &:hover {
        background-color: #4752c4;
    }
`;

const RegisterButton = styled.button`
    background-color: transparent;
    color: #5865f2;
    margin-top: 15px;
    cursor: pointer;
    border: none;
    &:hover {
        text-decoration: underline;
    }
`;

const ErrorMessage = styled.div`
    color: #f44336;
    margin-top: 10px;
`;

export default Login;
