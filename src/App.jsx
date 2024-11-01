import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import ChannelList from './components/ChannelList';
import ChatContainer from './components/ChatContainer';
import BulletinBoardContainer from './components/BulletinBoardContainer';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isHome, setIsHome] = useState(false); // 홈 화면 상태 추가
  const [channelsByServer, setChannelsByServer] = useState({
    Server1: [
      { name: 'general', type: 'message' },
      { name: 'bulletin', type: 'board' }
    ],
    Server2: [
      { name: 'off-topic', type: 'message' },
      { name: 'announcements', type: 'board' }
    ]
  });
  const [messagesByServer, setMessagesByServer] = useState({});
  const [postsByServer, setPostsByServer] = useState({});
  const [friends, setFriends] = useState([
    { name: 'Alice', profileImage: '' }, // 프로필 이미지 없는 경우
    { name: 'Bob', profileImage: '' },
    { name: 'Charlie', profileImage: '' },
    // 친구 목록 샘플 데이터 추가
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUserProfile(token);
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setCurrentUser(data.userId);
      else localStorage.removeItem('token');
    } catch (error) {
      console.error('Profile fetch error', error);
    }
  };

  const handleLoginSuccess = (userId, token) => {
    localStorage.setItem('token', token);
    setCurrentUser(userId);
    setIsRegistering(false);
    setIsHome(true); // 로그인 시 홈 화면으로 이동
  };

  const handleRegisterSuccess = (userId, token) => {
    localStorage.setItem('token', token);
    setCurrentUser(userId);
    setIsRegistering(false);
    setIsHome(true); // 회원가입 후 로그인 시 홈 화면으로 이동
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsHome(false); // 로그아웃 시 홈 화면 해제
  };

  const handleAddPost = async (newPost) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });
      const createdPost = await response.json();
      if (response.ok) {
        setPostsByServer((prevPosts) => ({
          ...prevPosts,
          [selectedServer]: [...(prevPosts[selectedServer] || []), createdPost]
        }));
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleDeletePost = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const postId = postsByServer[selectedServer][index].id;
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setPostsByServer((prevPosts) => {
          const serverPosts = [...prevPosts[selectedServer]];
          serverPosts.splice(index, 1);
          return { ...prevPosts, [selectedServer]: serverPosts };
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleAddComment = async (index, comment) => {
    try {
      const token = localStorage.getItem('token');
      const postId = postsByServer[selectedServer][index].id;
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ comment })
      });
      const updatedPost = await response.json();
      if (response.ok) {
        setPostsByServer((prevPosts) => {
          const serverPosts = [...prevPosts[selectedServer]];
          serverPosts[index] = updatedPost;
          return { ...prevPosts, [selectedServer]: serverPosts };
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleVotePost = async (index, voteType) => {
    try {
      const token = localStorage.getItem('token');
      const postId = postsByServer[selectedServer][index].id;
      const response = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ voteType })
      });
      const updatedPost = await response.json();
      if (response.ok) {
        setPostsByServer((prevPosts) => {
          const serverPosts = [...prevPosts[selectedServer]];
          serverPosts[index] = updatedPost;
          return { ...prevPosts, [selectedServer]: serverPosts };
        });
      }
    } catch (error) {
      console.error('Error voting post:', error);
    }
  };

  const handleHomeSelect = () => {
    setIsHome(true);
    setSelectedServer(null);
  };

  const handleServerSelect = (server) => {
    setIsHome(false);
    setSelectedServer(server);
  };

  const selectedChannelType =
    channelsByServer[selectedServer]?.find((ch) => ch.name === selectedChannel)?.type;

  const selectedMessages =
    (messagesByServer[selectedServer] && messagesByServer[selectedServer][selectedChannel]) || [];

  const selectedPosts = postsByServer[selectedServer] || [];

  const sortedFriends = friends.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <AppContainer>
      {currentUser ? (
        <>
          <Sidebar onSelectServer={handleServerSelect} onHomeSelect={handleHomeSelect} onLogout={handleLogout} />
          <ChannelContainer>
            {isHome ? (
              <FriendList>
                <h3>친구 목록</h3>
                {sortedFriends.map((friend, index) => (
                  <FriendItem key={index}>
                    {friend.profileImage ? (
                      <ProfileImage src={friend.profileImage} alt={`${friend.name} 프로필`} />
                    ) : (
                      <PlaceholderProfile>IF</PlaceholderProfile>
                    )}
                    {friend.name}
                  </FriendItem>
                ))}
              </FriendList>
            ) : (
              <>
                <ChannelList
                  server={selectedServer}
                  channels={channelsByServer[selectedServer]}
                  onSelectChannel={setSelectedChannel}
                />
                {selectedChannelType === 'message' && selectedChannel && (
                  <ChatContainer
                    server={selectedServer}
                    channel={selectedChannel}
                    messages={selectedMessages}
                    onSendMessage={(message) => {
                      if (!selectedServer || !selectedChannel) return;
                      const messageObj = { user: currentUser, message, timestamp: new Date() };
                      const serverMessages = messagesByServer[selectedServer] || {};
                      const channelMessages = serverMessages[selectedChannel] || [];
                      const updatedChannelMessages = [...channelMessages, messageObj];

                      const updatedServerMessages = {
                        ...serverMessages,
                        [selectedChannel]: updatedChannelMessages
                      };

                      setMessagesByServer({
                        ...messagesByServer,
                        [selectedServer]: updatedServerMessages
                      });
                    }}
                  />
                )}
                {selectedChannelType === 'board' && selectedChannel && (
                  <BulletinBoardContainer
                    server={selectedServer}
                    posts={selectedPosts}
                    currentUser={currentUser}
                    onVotePost={handleVotePost}
                    onAddPost={handleAddPost}
                    onAddComment={handleAddComment}
                    onDeletePost={handleDeletePost}
                  />
                )}
              </>
            )}
          </ChannelContainer>
        </>
      ) : isRegistering ? (
        <Register onRegisterSuccess={handleRegisterSuccess} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} onRegister={() => setIsRegistering(true)} />
      )}
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #2f3136;
`;

const ChannelContainer = styled.div`
  display: flex;
  flex: 1;
  background-color: #36393f;
`;

const FriendList = styled.div`
  padding: 20px;
  color: white;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;
  font-size: 16px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const PlaceholderProfile = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #5865f2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 10px;
`;

export default App;
