import React, { useState } from 'react';
import styled from 'styled-components';

const ChatInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // 입력된 값을 상태로 저장
  };

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      onSendMessage(inputValue); // 입력된 메시지를 부모 컴포넌트로 전달
      setInputValue(''); // 메시지 전송 후 입력 필드 초기화
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Enter키만 눌렀을 때 메시지 전송
      e.preventDefault(); // Enter 키의 기본 동작(줄바꿈)을 막음
      handleSend(); // 메시지 전송
    }
  };

  return (
    <ChatInputContainer>
      <StyledTextarea
        placeholder="Type a message..."
        value={inputValue}
        onChange={handleInputChange} // 입력값이 변경될 때 상태 업데이트
        onKeyPress={handleKeyPress} // Enter와 Shift+Enter를 구분하여 처리
        rows="3" // 기본적으로 3줄의 입력 영역을 제공
      />
      <SendButton onClick={handleSend}>Send</SendButton>
    </ChatInputContainer>
  );
};

const ChatInputContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #202225;
  background-color: #40444b;
  display: flex;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #2f3136;
  color: white;
  resize: none; /* textarea 크기 조정 불가 */
`;

const SendButton = styled.button`
  margin-left: 10px;
  background-color: #5865f2;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #4752c4;
  }
`;

export default ChatInput;
