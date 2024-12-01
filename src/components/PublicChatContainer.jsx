import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const PublicChatContainer = ({ server, channel, onSendMessage }) => {
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null); // WebSocket 연결을 관리하는 ref
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState(''); // inputValue로 변경

  // 스크롤을 메시지 끝으로 내리기
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 채팅 기록 불러오기 추가
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('token'); // 토큰 가져오기
        const response = await fetch(`/api/public-chat/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ server, channel }), // 서버와 채널 정보 전달
        });
        const data = await response.json();
        if (response.ok) {
          setMessages(data.messages); // 이전 메시지 상태에 저장
          console.log('Chat history loaded:', data.messages); // 디버깅용
        } else {
          console.error('Failed to fetch chat history:', data);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    if (server && channel) {
      fetchChatHistory(); // 서버와 채널이 선택되었을 때만 호출
    }
  }, [server, channel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket 연결 설정
  useEffect(() => {
    // WebSocket 연결 생성
    socketRef.current = new WebSocket(`ws://localhost:4002`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data(PublicChatContainer.jsx):", data); // 데이터 확인용 로그
        const newMessage = {
          sender: data.sender === 'currentUser' ? '나' : data.sender,
          content: data.content,
          timestamp: data.timestamp,
        };
        console.log("newMessage(PublicChatContainer.jsx):", newMessage); // 추가하여 데이터 확인
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
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
  }, [server, channel]); // 서버나 채널이 변경될 때마다 새 WebSocket 연결을 설정

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (!inputValue.trim()) return; // inputValue로 변경

    const newMessage = {
      sender: 'currentUser', // 현재 사용자의 정보로 설정
      content: inputValue, // inputValue로 변경
      timestamp: new Date().toISOString(),
    };

    // WebSocket을 통해 메시지를 서버로 전송
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(newMessage));
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue(''); // 메시지 전송 후 입력창 초기화
  };

  // 키보드 입력 처리: Enter로 전송, Shift+Enter로 줄바꿈
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Enter로 줄바꿈을 막고 메시지 전송
      handleSendMessage();
    }
  };

  // 줄바꿈(\n)을 <br />로 변환하여 출력
  // 메시지를 줄바꿈 처리해주는 함수
  const formatMessage = (message) => {
    if (typeof message !== 'string') return ''; // message가 문자열이 아닐 경우 빈 문자열 반환
    return message.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };


  return (
    <Container>
      <Header>
        {server} - #{channel}
      </Header>
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageContainer key={index} isCurrentUser={message.sender === 'currentUser'}>
            <Sender isCurrentUser={message.sender === 'currentUser'}>
              {message.sender === 'currentUser' ? '나' : message.sender}
            </Sender>
            <MessageBox isCurrentUser={message.sender === 'currentUser'}>
              <MessageContent>{formatMessage(message.content)}</MessageContent>
              <Time>{new Date(message.timestamp).toLocaleTimeString()}</Time>
            </MessageBox>
          </MessageContainer>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <StyledTextarea
          placeholder="메시지를 입력하세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="3"
        />
        <SendButton onClick={handleSendMessage}>전송</SendButton>
      </InputContainer>
    </Container>
  );
};

// 스타일 컴포넌트 코드
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
  color: white;
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
  color: ${({ isCurrentUser }) => (isCurrentUser ? '#9CDCFE' : '#AFB3CD')};
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
  color: #000000;
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

const StyledTextarea = styled.textarea`
  flex: 1;
  padding: 10px;
  background-color: #2f3136;
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
  margin-left: 10px;
  background-color: #5865f2;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #4752c4;
  }
`;

export default PublicChatContainer;
