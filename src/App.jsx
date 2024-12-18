import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import ChannelList from './components/ChannelList';
import ChatContainer from './components/PublicChatContainer';
import BulletinBoardContainer from './components/BulletinBoardContainer';
import Login from './components/Login';
import Register from './components/Register';
//import FriendList from './components/FriendList';
import PrivateChatContainer from './components/PrivateChatContainer';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isHome, setIsHome] = useState(false);
  const [channelsByServer, setChannelsByServer] = useState({
    Server1: [
      { name: '단체 채팅방', type: 'message' },
      { name: '게시판', type: 'board' }
    ],
    Server2: [
      { name: 'off-topic', type: 'message' },
      { name: 'announcements', type: 'board' }
    ]
  });
  const [messagesByServer, setMessagesByServer] = useState({});
  const [postsByServer, setPostsByServer] = useState({});
  const [friends, setFriends] = useState([]);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [newFriendId, setNewFriendId] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [ws, setWs] = useState(null); // WebSocket instance

  useEffect(() => {
    //localStorage.removeItem('token');
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
      fetchFriends(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {       // https://d7308622-e15d-4024-be26-2145b0525cf1.mock.pstmn.io -> postman url
      const response = await fetch('', {
        headers: { Authorization: token }
      });
      const data = await response.json();
      if (response.ok) setCurrentUser(data.userId);
      else;//localStorage.removeItem('token');
    } catch (error) {
      console.error('Profile fetch error', error);
    }
  };

  const fetchFriends = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/friends/list', { // 서버의 친구 목록 API URL
        headers: { Authorization: token }
      });
      const data = await response.json();

      console.log('fetchFriends data : ', data);

      if (response.ok) {
        setFriends(data.friends); // 서버에서 받아온 친구 목록을 상태에 저장
      } else {
        console.error('Failed to fetch friends');
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleLoginSuccess = (userId, token) => {
    localStorage.setItem('token', token);
    console.log('login success token : ', token);
    setCurrentUser(userId);
    setIsRegistering(false);
    setIsHome(true);
    fetchFriends(token);    //로그인 성공 후 친구목록 최신화
  };

  const handleRegisterSuccess = (userId, token) => {
    localStorage.setItem('token', token);
    setCurrentUser(userId);
    setIsRegistering(false);
    setIsHome(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsHome(false);
  };

  const handleChannelSelect = async (channelName) => {
    setSelectedChannel(channelName);

    if (channelName === '게시판') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/posts`, {
          headers: { Authorization: token },
        });
        const data = await response.json();

        console.log('handleChannelSelect response data : ', data);

        if (response.ok) {
          setPostsByServer((prevPosts) => ({
            ...prevPosts,
            [selectedServer]: data,
          }));
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
  };

  const handleAddPost = async (newPost) => {
    try {
      console.log("JSON.stringify(newPost):", JSON.stringify(newPost));

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(newPost)
      });

      console.log('handleAddPost body : ', JSON.stringify(newPost));

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // 응답이 비어 있지 않으면 JSON 파싱 시도

      const createdPost = await response.json();

      console.log('handleAddPost respose createdPost : ', createdPost);

      setPostsByServer((prevPosts) => ({
        ...prevPosts,
        [selectedServer]: [...(prevPosts[selectedServer] || []), createdPost]
      }));
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/board/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setPostsByServer((prevPosts) => {
          const serverPosts = prevPosts[selectedServer].filter((post) => post.id !== postId);
          return { ...prevPosts, [selectedServer]: serverPosts };
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const token = localStorage.getItem('token');

      console.log('handleAddComment token : ', token);

      const response = await fetch(`http://localhost:8080/api/board/posts/${postId + 1}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ comment })
      });
      // 응답 본문을 텍스트로 출력
      const responseBody = await response.text();
      console.log('handleAddComment response : ', response);

      const updatedPost = await response.json();

      console.log('handleAddComment updatedPost : ', updatedPost);

      if (response.ok) {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment] // 기존 댓글 목록에 새 댓글 추가
          };
        }
        return post;
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleVotePost = async (postId, voteType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/posts/${postId}/vote`, {
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
          const serverPosts = prevPosts[selectedServer].map((post) =>
            post.id === postId ? updatedPost : post
          );
          return { ...prevPosts, [selectedServer]: serverPosts };
        });
      }
    } catch (error) {
      console.error('Error voting post:', error);
    }
  };

  const handleHomeSelect = async () => {
    setIsHome(true);
    setSelectedServer(null);

    const token = localStorage.getItem('token');
    if (token) {
      await fetchFriends(token); // 홈 화면 진입 시 최신 친구 리스트 불러오기
    }
  };

  const handleServerSelect = (server) => {
    setIsHome(false);
    setSelectedServer(server);
    setSelectedChannel(null);
  };

  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem('token')?.trim(); // 인증 토큰 가져오기
      // https://7994c571-3331-45c7-8ac1-bc2ceff00d99.mock.pstmn.io
      console.log("handleAddFriend token : ", token);

      const response = await fetch('http://localhost:8080/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token // 토큰을 Authorization 헤더에 추가
        },
        body: JSON.stringify({ friendLoginId: newFriendId }) // 입력한 친구 ID를 서버로 전송
      });

      if (response.ok) {
        console.log('add friend respose : ', response);
        console.log('add friend respose.text : ', response.text);
        const addedFriend = await response.json(); // 추가된 친구 정보를 받아옴
        console.log("addfriend addedFriend : ", addedFriend);
        setFriends([...friends, addedFriend]); // 받아온 친구 정보를 상태에 추가
        setNewFriendId(''); // 입력 필드 초기화
        setIsAddingFriend(false); // 모달 닫기
      } else {
        console.error('Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    const socket = setupWebSocket(friend.id);

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log('Received message:', receivedMessage);
      // 필요한 경우 PrivateChatContainer에 메시지를 업데이트하는 코드 추가
    };
  };

  const handleSendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ sender: currentUser, content: message }));
    }
  };

  // WebSocket 연결을 설정하는 함수
  const setupWebSocket = (friendId) => {
    const socket = new WebSocket(`ws://localhost:4001`); // 서버의 WebSocket URL에 맞춰 조정
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    setWs(socket);

    return socket;
  };

  const selectedChannelType =
    channelsByServer[selectedServer]?.find((ch) => ch.name === selectedChannel)?.type;

  const selectedMessages =
    (messagesByServer[selectedServer] && messagesByServer[selectedServer][selectedChannel]) || [];

  const selectedPosts = postsByServer[selectedServer] || [];

  const sortedFriends = (friends || []).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <AppContainer>
      {currentUser ? (
        <>
          <Sidebar onSelectServer={handleServerSelect} onHomeSelect={handleHomeSelect} onLogout={handleLogout} />
          <ChannelContainer>
            {isHome ? (
              <FriendListContainer>
                <AddFriendButton onClick={() => setIsAddingFriend(true)}>친구추가</AddFriendButton>
                <h3>친구 목록</h3>
                {sortedFriends.map((friend, index) => (
                  <FriendItem key={index} onClick={() => handleFriendClick(friend)}>
                    {friend.profileImage ? (
                      <ProfileImage src={friend.profileImage} alt={`${friend.name} 프로필`} />
                    ) : (
                      <PlaceholderProfile>IF</PlaceholderProfile>
                    )}
                    {friend.name}
                  </FriendItem>
                ))}
                {isAddingFriend && (
                  <ModalBackground onClick={() => setIsAddingFriend(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                      <h3>친구 추가</h3>
                      <FriendInput
                        type="text"
                        value={newFriendId}
                        onChange={(e) => setNewFriendId(e.target.value)}
                        placeholder="친구 ID 입력"
                      />
                      <ConfirmButton onClick={handleAddFriend}>추가</ConfirmButton>
                    </ModalContent>
                  </ModalBackground>
                )}
              </FriendListContainer>
            ) : (
              <>
                <ChannelList
                  server={selectedServer}
                  channels={channelsByServer[selectedServer]}
                  onSelectChannel={handleChannelSelect}
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
            {selectedFriend && (
              <PrivateChatContainer
                friend={selectedFriend}
                onSendMessage={handleSendMessage}
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

const FriendListContainer = styled.div`
  padding: 20px;
  color: white;
  width: 250px;
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

const AddFriendButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  color: white;
  background-color: #7289da;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #2f3136;
  padding: 20px;
  border-radius: 8px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FriendInput = styled.input`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #7289da;
  margin-right: 5px;
`;

const ConfirmButton = styled.button`
  padding: 5px 10px;
  color: white;
  background-color: #7289da;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default App;
