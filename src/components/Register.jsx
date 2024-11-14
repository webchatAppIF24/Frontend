// Register.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const Register = ({ onRegisterSuccess }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async () => {
        if (!email || !username || !userId || !password || !birthday) {
            setError('모든 필드를 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch('https://dbaa09b2-5003-4c22-96e0-2f75681c514b.mock.pstmn.io/', {       // postman에서 사용한 mock서버주소, 추후에 백엔드서버주소로 바꿔야함
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, userId, password, birthday }),
            });

            const data = await response.json();

            if (response.ok) {
                onRegisterSuccess();        //회원 가입 후 로그인 화면으로 이동 (직접 아이디와 패스워드를 입력하여 로그인하도록)
            } else {
                setError(data.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            setError('서버에 연결할 수 없습니다.');
            console.error('회원가입 오류:', error);
        }
    };

    return (
        <RegisterContainer>
            <h2>회원가입</h2>
            <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="text"
                placeholder="사용자명"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="text"
                placeholder="사용자 ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Input
                type="date"
                placeholder="생년월일"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
            />
            <RegisterButton onClick={handleRegister}>가입하기</RegisterButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </RegisterContainer>
    );
};

const RegisterContainer = styled.div`
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

const RegisterButton = styled.button`
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

const ErrorMessage = styled.div`
    color: #f44336;
    margin-top: 10px;
`;

export default Register;
