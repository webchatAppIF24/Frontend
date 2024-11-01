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
  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      onSendMessage(inputValue);
      setInputValue(''); // 메시지 전송 후 입력창 초기화
    }
  };

  // 키보드 입력 처리: Enter로 전송, Shift+Enter로 줄바꿈
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Enter로 줄바꿈을 막고 메시지 전송
      handleSubmit();
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

  // 타임스탬프를 'HH:MM' 형식으로 포맷팅
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // 'HH:MM' 형식으로 시간 표시
  };

  return (
    <ChatWrapper>
      <h3>{server} - #{channel}</h3>
      <ChatMessages>
        {messages.map((message, index) => (
          <Message key={index}>
            <MessageHeader>
              <strong>{message.user}</strong>{' '}
              <Timestamp>{formatTimestamp(message.timestamp)}</Timestamp>
            </MessageHeader>
            {formatMessage(message.message)}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </ChatMessages>
      <ChatInput>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress} // 키 입력 감지
          placeholder="메시지를 입력하세요"
          rows={3} // 기본으로 3줄 크기의 입력창
        />
        <button onClick={handleSubmit}>전송</button>
      </ChatInput>
    </ChatWrapper>
  );
};

const ChatWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: white;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 10px;
`;

const MessageHeader = styled.div`
  margin-bottom: 5px;
`;

const Timestamp = styled.span`
  font-size: 0.85em;
  color: #b9bbbe;
`;

const ChatInput = styled.div`
  display: flex;
  margin-top: 10px;

  textarea {
    flex-grow: 1;
    padding: 10px;
    margin-right: 10px;
    background-color: #40444b;
    border: none;
    color: white;
    resize: none; /* textarea 크기 조정 방지 */
  }

  button {
    padding: 10px;
    cursor: pointer;
  }
`;

export default ChatContainer;
