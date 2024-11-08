// components/FriendList.jsx
import React from 'react';
import styled from 'styled-components';
import FriendItem from './FriendItem';

const FriendList = ({ friends, onFriendClick }) => (
  <ListContainer>
    <h3>친구 목록</h3>
    {friends.map((friend) => (
      <FriendItemContainer key={friend.id} onClick={() => onFriendClick(friend)}>
        <FriendItem friend={friend} />
      </FriendItemContainer>
    ))}
  </ListContainer>
);

const ListContainer = styled.div`
  padding: 20px;
  overflow-y: auto;
`;

const FriendItemContainer = styled.div`
  cursor: pointer;
`;

export default FriendList;
