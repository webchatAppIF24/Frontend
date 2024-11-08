// components/PrivateChatContainer.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const PrivateChatContainer = ({ friend, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // 스크롤을 제어하기 위한 ref
  const socketRef = useRef(null); // WebSocket 연결을 관리하는 ref

  // 1. 페이지 로드 시 기존 메시지 불러오기
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('token'); // 인증 토큰이 필요한 경우 가져오기
        const response = await fetch(`https://7f8ce0d1-2f4f-4ae6-8939-087b6bfa82bc.mock.pstmn.io`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // 필요 시 토큰 추가
          },
          body: JSON.stringify({ friendId: friend.id }), // 요청에 friend.id 포함
        });
        const data = await response.json();
        if (response.ok) {
          setMessages(data.messages); // 서버에서 받은 기존 메시지 내역을 상태에 저장
        } else {
          console.error('Failed to load message history');
        }
      } catch (error) {
        console.error('Error loading message history:', error);
      }
    };
  
    loadMessages();
  }, [friend]);
  

  // 2. WebSocket 연결 설정
  useEffect(() => {
    // WebSocket을 설정하고 연결하는 부분
    socketRef.current = new WebSocket(`ws://localhost:4001`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newMessage = {
        sender: friend.name,  // 예시로 설정한 sender
        content: data.message,
        timestamp: data.timestamp,  // 서버에서 받은 timestamp 사용
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      // 컴포넌트가 unmount될 때 WebSocket 연결을 닫음
      socketRef.current.close();
    };
  }, [friend]);

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      sender: 'currentUser', // 현재 사용자의 정보로 설정
      content: message,
      timestamp: new Date(),
    };

    // WebSocket을 통해 메시지를 서버로 전송
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(newMessage));
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    } else if (event.key === 'Enter' && event.shiftKey) {
      setMessage((prev) => prev + '\n');
    }
  };

  return (
    <Container>
      <Header>{friend.name}와의 채팅</Header>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageContainer key={index} isCurrentUser={msg.sender === 'currentUser'}>
            <Sender isCurrentUser={msg.sender === 'currentUser'}>
              {msg.sender === 'currentUser' ? '나' : friend.name}
            </Sender>
            <MessageBox isCurrentUser={msg.sender === 'currentUser'}>
              <MessageContent>{msg.content}</MessageContent>
              <Time>{new Date(msg.timestamp).toLocaleTimeString()}</Time>
            </MessageBox>
          </MessageContainer>
        ))}
        <div ref={messagesEndRef} /> {/* 메시지 끝 위치를 위한 ref */}
      </MessagesContainer>
      <InputContainer>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메시지를 입력하세요"
        />
        <SendButton onClick={handleSendMessage}>전송</SendButton>
      </InputContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #2f3136;
  color: white;
  padding: 10px;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #36393f;
  border-radius: 8px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isCurrentUser }) => (isCurrentUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
`;

const Sender = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
  text-align: ${({ isCurrentUser }) => (isCurrentUser ? 'right' : 'left')};
`;

const MessageBox = styled.div`
  background-color: ${({ isCurrentUser }) => (isCurrentUser ? '#515EB3' : '#AFB3CD')};
  color: white;
  padding: 8px;
  border-radius: 8px;
  max-width: 70%;
  white-space: pre-wrap;
  text-align: left;
  align-self: ${({ isCurrentUser }) => (isCurrentUser ? 'flex-end' : 'flex-start')};
`;

const MessageContent = styled.div`
  white-space: pre-wrap;
`;

const Time = styled.div`
  font-size: 12px;
  color: #000000; /* 진한 검정색으로 설정 */
  text-align: right;
  margin-top: 4px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #40444b;
  padding: 5px;
  border-radius: 8px;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 10px;
  background-color: #40444b;
  border: none;
  border-radius: 4px;
  color: white;
  outline: none;
  resize: none;
  &::placeholder {
    color: #72767d;
  }
`;

const SendButton = styled.button`
  background-color: #5865f2;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background-color: #4752c4;
  }
`;

export default PrivateChatContainer;
