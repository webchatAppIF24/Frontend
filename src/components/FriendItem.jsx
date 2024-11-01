import React from 'react';
import styled from 'styled-components';

const FriendItem = ({ friend }) => {
  return (
    <ItemContainer>
      <ProfileImage src={friend.profileImage} alt={`${friend.name} 프로필`} />
      <FriendName>{friend.name}</FriendName>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const FriendName = styled.div`
  font-size: 16px;
  color: #fff;
`;

export default FriendItem;