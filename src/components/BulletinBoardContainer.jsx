import React, { useState } from 'react';
import styled from 'styled-components';

const BulletinBoardContainer = ({ server, posts, onVotePost, onAddComment, onAddPost, currentUser, onDeletePost }) => {
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [comment, setComment] = useState('');
  const [isWritingPost, setIsWritingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handleVote = (index, type) => {
    if (type === 'upvote') onVotePost(index, type);
  };

  const handleCommentSubmit = (index) => {
    if (comment.trim()) {
      onAddComment(index, comment);
      setComment('');
    }
  };

  const handlePostSubmit = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      const newPost = {
        title: newPostTitle,
        content: newPostContent,
        votes: 0,
        comments: [],
        username: currentUser,
      };
      onAddPost(newPost);
      setNewPostTitle('');
      setNewPostContent('');
      setIsWritingPost(false);
    }
  };

  const handleDeletePost = (index) => {
    onDeletePost(index);
    setSelectedPostIndex(null);
  };

  return (
    <BoardContainer>
      {!selectedPostIndex && !isWritingPost && (
        <>
          <PostHeader>
            <h3>{server} 게시판</h3>
            <AddPostButton onClick={() => setIsWritingPost(true)}>게시글 작성</AddPostButton>
          </PostHeader>
          <PostList>
            {posts.map((post, index) => (
              <PostItem key={index} onClick={() => setSelectedPostIndex(index)}>
                <PostTitle>{post.title}</PostTitle>
                <PostVoteCount>👍 {post.votes}</PostVoteCount>
              </PostItem>
            ))}
          </PostList>
        </>
      )}
      {isWritingPost && (
        <PostForm>
          <h3>새 게시글 작성</h3>
          <PostInput
            type="text"
            placeholder="제목을 입력하세요"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <PostTextarea
            placeholder="내용을 입력하세요"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={5}
          />
          <SubmitButton onClick={handlePostSubmit}>작성 완료</SubmitButton>
          <BackButton onClick={() => setIsWritingPost(false)}>취소</BackButton>
        </PostForm>
      )}
      {selectedPostIndex !== null && !isWritingPost && (
        <PostDetail>
          <BackButton onClick={() => setSelectedPostIndex(null)}>뒤로가기</BackButton>
          <h3>{posts[selectedPostIndex].title}</h3>
          <p>{posts[selectedPostIndex].content}</p>
          {posts[selectedPostIndex].username === currentUser && (
            <DeleteButton onClick={() => handleDeletePost(selectedPostIndex)}>삭제</DeleteButton>
          )}
          <VoteSection>
            <VoteButton onClick={() => handleVote(selectedPostIndex, 'upvote')}>추천 👍</VoteButton>
            <VoteCount>추천 수: {posts[selectedPostIndex].votes}</VoteCount>
          </VoteSection>
          <CommentsSection>
            <h4>댓글</h4>
            {posts[selectedPostIndex].comments.map((comment, index) => (
              <CommentItem key={index}>{comment}</CommentItem>
            ))}
            <CommentInputContainer>
              <CommentInput
                type="text"
                placeholder="댓글을 입력하세요"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <CommentButton onClick={() => handleCommentSubmit(selectedPostIndex)}>댓글 추가</CommentButton>
            </CommentInputContainer>
          </CommentsSection>
        </PostDetail>
      )}
    </BoardContainer>
  );
};

const BoardContainer = styled.div`
  flex: 1;
  padding: 20px;
  color: white;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #2f3136;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #3a3f45;
  }
`;

const PostTitle = styled.div`
  font-size: 1rem;
`;

const PostVoteCount = styled.div`
  font-size: 0.9rem;
  color: #b3b3b3;
`;

const PostForm = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  background-color: #40444b;
  border: none;
  color: white;
`;

const PostTextarea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  background-color: #40444b;
  border: none;
  color: white;
`;

const SubmitButton = styled.button`
  background-color: #5865f2;
  color: white;
  padding: 10px;
  cursor: pointer;
  border: none;
  margin-bottom: 10px;
  &:hover {
    background-color: #4752c4;
  }
`;

const AddPostButton = styled.button`
  background-color: #5865f2;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  &:hover {
    background-color: #4752c4;
  }
`;

const BackButton = styled.button`
  background-color: #5865f2;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  margin-bottom: 10px;
  &:hover {
    background-color: #4752c4;
  }
`;

const PostDetail = styled.div`
  padding: 20px;
`;

const VoteSection = styled.div`
  margin-top: 20px;
`;

const VoteButton = styled.button`
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
`;

const VoteCount = styled.div`
  margin-top: 10px;
`;

const CommentsSection = styled.div`
  margin-top: 20px;
`;

const CommentItem = styled.div`
  background-color: #2f3136;
  padding: 10px;
  margin-bottom: 5px;
`;

const CommentInputContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const CommentInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  background-color: #40444b;
  border: none;
  color: white;
`;

const CommentButton = styled.button`
  padding: 10px;
  margin-left: 10px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  margin-left: 10px;
  &:hover {
    background-color: #d32f2f;
  }
`;

export default BulletinBoardContainer;
