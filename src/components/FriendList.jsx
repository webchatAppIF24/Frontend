import React from 'react';
import styled from 'styled-components';
import FriendItem from './FriendItem';

const FriendList = ({ friends }) => {
  return (
    <ListContainer>
      {friends.map((friend) => (
        <FriendItem key={friend.id} friend={friend} />
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  padding: 20px;
  overflow-y: auto;
`;

export default FriendList;
