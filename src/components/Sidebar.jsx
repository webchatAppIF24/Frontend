import React, { useState } from 'react';
import styled from 'styled-components';
import { FaHome } from 'react-icons/fa';

const Sidebar = ({ onSelectServer, onHomeSelect }) => {
  const [selected, setSelected] = useState(null);

  const handleHomeClick = () => {
    setSelected('home');
    onHomeSelect();
  };

  const handleServerClick = (server) => {
    setSelected(server);
    onSelectServer(server);
  };

  return (
    <SidebarContainer>
      <HomeCircle onClick={handleHomeClick} selected={selected === 'home'}>
        <FaHome size={24} />
      </HomeCircle>
      <ServerCircle
        onClick={() => handleServerClick('Server1')}
        selected={selected === 'Server1'}
      >
        S1
      </ServerCircle>
      <ServerCircle
        onClick={() => handleServerClick('Server2')}
        selected={selected === 'Server2'}
      >
        S2
      </ServerCircle>
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

const HomeCircle = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${({ selected }) => (selected ? '#5865f2' : '#36393f')};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
  color: white;
  &:hover {
    background-color: #4752c4;
  }
`;

const ServerCircle = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${({ selected }) => (selected ? '#5865f2' : '#36393f')};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  color: white;
  &:hover {
    background-color: #4752c4;
  }
`;

export default Sidebar;
