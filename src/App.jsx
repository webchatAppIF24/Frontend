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
  };

  const handleRegisterSuccess = (userId, token) => {
    localStorage.setItem('token', token);
    setCurrentUser(userId);
    setIsRegistering(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
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

  const selectedChannelType =
    channelsByServer[selectedServer]?.find((ch) => ch.name === selectedChannel)?.type;

  const selectedMessages =
    (messagesByServer[selectedServer] && messagesByServer[selectedServer][selectedChannel]) || [];

  const selectedPosts = postsByServer[selectedServer] || [];

  return (
    <AppContainer>
      {currentUser ? (
        <>
          <Sidebar onSelectServer={setSelectedServer} onLogout={handleLogout} />
          <ChannelContainer>
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

export default App;
