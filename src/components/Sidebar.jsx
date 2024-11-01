import React from 'react';
import styled from 'styled-components';

const Sidebar = ({ onSelectServer }) => {
  return (
    <SidebarContainer>
      <ServerCircle onClick={() => onSelectServer('Server1')}>S1</ServerCircle>
      <ServerCircle onClick={() => onSelectServer('Server2')}>S2</ServerCircle>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 80px;
  background-color: #202225;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`;

const ServerCircle = styled.div`
  width: 50px;
  height: 50px;
  background-color: #36393f;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  color: white;
  &:hover {
    background-color: #5865f2;
  }
`;

export default Sidebar;
