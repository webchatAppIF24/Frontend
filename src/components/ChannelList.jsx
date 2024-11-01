import React, { useState } from 'react';
import styled from 'styled-components';

const ChannelList = ({ server, channels, onSelectChannel, onRenameChannel }) => {
  const [editingChannel, setEditingChannel] = useState(null);
  const [newChannelName, setNewChannelName] = useState('');

  const handleRenameClick = (channelName) => {
    setEditingChannel(channelName);
    setNewChannelName(channelName);
  };

  const handleRenameSubmit = (channelName) => {
    if (newChannelName.trim() !== '') {
      onRenameChannel(server, channelName, newChannelName);
    }
    setEditingChannel(null);
  };

  return (
    <ChannelListContainer>
      <h3>{server} Channels</h3>
      {channels &&
        channels.map((channel) => (
          <ChannelItem key={channel.name}>
            {editingChannel === channel.name ? (
              <>
                <ChannelInput
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
                <SaveButton onClick={() => handleRenameSubmit(channel.name)}>
                  Save
                </SaveButton>
              </>
            ) : (
              <>
                <ChannelName onClick={() => onSelectChannel(channel.name)}>
                  #{channel.name}
                </ChannelName>
                <RenameButton onClick={() => handleRenameClick(channel.name)}>
                  Rename
                </RenameButton>
              </>
            )}
          </ChannelItem>
        ))}
    </ChannelListContainer>
  );
};

const ChannelListContainer = styled.div`
  width: 240px;
  background-color: #2f3136;
  padding: 10px;
  color: white;
`;

const ChannelItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  color: #b9bbbe;
  &:hover {
    background-color: #393c43;
    color: white;
  }
`;

const ChannelName = styled.span`
  flex-grow: 1;
`;

const ChannelInput = styled.input`
  flex-grow: 1;
  padding: 5px;
  background-color: #40444b;
  border: none;
  border-radius: 3px;
  color: white;
`;

const SaveButton = styled.button`
  background-color: #5865f2;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    background-color: #4752c4;
  }
`;

const RenameButton = styled.button`
  background: none;
  color: #b9bbbe;
  border: none;
  padding: 5px;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;

export default ChannelList;
