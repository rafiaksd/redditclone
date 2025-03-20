import axios from 'axios';

const oldBaseURL = 'http://localhost:5000/api'

export const onlineBaseURL = 'https://redditclone-mongodb-api.onrender.com/api'

const api = axios.create({
  baseURL: onlineBaseURL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.patch(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const upvotePost = (id) => api.post(`/posts/${id}/upvote`);
export const downvotePost = (id) => api.post(`/posts/${id}/downvote`);

export const getComments = (postId) => api.get(`/comments/post/${postId}`);
export const createComment = (data) => api.post('/comments', data);
export const updateComment = (commentId, data) => api.patch(`/comments/${commentId}`, data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);
export const upvoteComment = (id) => api.post(`/comments/${id}/upvote`);
export const downvoteComment = (id) => api.post(`/comments/${id}/downvote`);

export default api; 