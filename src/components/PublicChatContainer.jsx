import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ChatContainer = ({ server, channel, messages, onSendMessage }) => {
  const messagesEndRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  // 스크롤을 메시지 끝으로 내리기
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      onSendMessage(inputValue);
      setInputValue(''); // 메시지 전송 후 입력창 초기화
    }
  };

  // 키보드 입력 처리: Enter로 전송, Shift+Enter로 줄바꿈
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Enter로 줄바꿈을 막고 메시지 전송
      handleSendMessage();
    }
  };

  // 줄바꿈(\n)을 <br />로 변환하여 출력
  const formatMessage = (message) => {
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
          <MessageContainer key={index} isCurrentUser={message.user === 'currentUser'}>
            <Sender isCurrentUser={message.user === 'currentUser'}>
              {message.user === 'currentUser' ? '나' : message.user}
            </Sender>
            <MessageBox isCurrentUser={message.user === 'currentUser'}>
              <MessageContent>{formatMessage(message.message)}</MessageContent>
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

export default ChatContainer;
