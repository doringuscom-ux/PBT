import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true // Crucial for sessions/cookies
});

export const getMe = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (credentials) => api.post('/auth/register', credentials);
export const verifyRegistration = (data) => api.post('/auth/verify-registration', data);

export const getMovies = () => api.get('/movies');
export const addMovie = (data) => api.post('/movies', data);
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);
export const addMovieComment = (id, data) => api.post(`/movies/${id}/comments`, data);
export const deleteMovieComment = (id, commentId) => api.delete(`/movies/${id}/comments/${commentId}`);
export const likeMovieComment = (id, commentId) => api.post(`/movies/${id}/comments/${commentId}/like`);
export const updateMovieComment = (id, commentId, data) => api.put(`/movies/${id}/comments/${commentId}`, data);
export const rateMovie = (id, rating, review) => api.post(`/movies/${id}/rate`, { rating, review });

export const getNews = () => api.get('/news');
export const getTodayNews = () => api.get('/news/today');
export const addNews = (data) => api.post('/news', data);
export const updateNews = (id, data) => api.put(`/news/${id}`, data);
export const deleteNews = (id) => api.delete(`/news/${id}`);
export const addComment = (newsId, data) => api.post(`/news/${newsId}/comments`, data);
export const deleteComment = (newsId, commentId) => api.delete(`/news/${newsId}/comments/${commentId}`);
export const likeComment = (newsId, commentId) => api.post(`/news/${newsId}/comments/${commentId}/like`);
export const reportComment = (newsId, commentId) => api.post(`/news/${newsId}/comments/${commentId}/report`);
export const updateComment = (newsId, commentId, data) => api.put(`/news/${newsId}/comments/${commentId}`, data);

export const getCelebrities = () => api.get('/celebrities');
export const addCelebrity = (data) => api.post('/celebrities', data);
export const updateCelebrity = (id, data) => api.put(`/celebrities/${id}`, data);
export const deleteCelebrity = (id) => api.delete(`/celebrities/${id}`);
export const addCelebComment = (id, data) => api.post(`/celebrities/${id}/comments`, data);
export const deleteCelebComment = (id, commentId) => api.delete(`/celebrities/${id}/comments/${commentId}`);
export const likeCelebComment = (id, commentId) => api.post(`/celebrities/${id}/comments/${commentId}/like`);
export const updateCelebComment = (id, commentId, data) => api.put(`/celebrities/${id}/comments/${commentId}`, data);
export const followCelebrity = (id) => api.post(`/celebrities/${id}/follow`);

// Video API
export const getVideos = () => api.get('/videos');
export const addVideo = (data) => api.post('/videos', data);
export const updateVideo = (id, data) => api.put(`/videos/${id}`, data);
export const deleteVideo = (id) => api.delete(`/videos/${id}`);
export const addVideoComment = (id, data) => api.post(`/videos/${id}/comments`, data);
export const deleteVideoComment = (id, commentId) => api.delete(`/videos/${id}/comments/${commentId}`);
export const likeVideoComment = (id, commentId) => api.post(`/videos/${id}/comments/${commentId}/like`);
export const updateVideoComment = (id, commentId, data) => api.put(`/videos/${id}/comments/${commentId}`, data);

export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const blockUser = (id) => api.put(`/users/${id}/block`);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const updateUserPassword = (id, newPassword) => api.put(`/users/${id}/password`, { newPassword });
export const deleteVideoOld = (id) => api.delete(`/users/${id}`); // Corrected in next call if needed, this was users
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getWidgets = (params) => api.get('/widgets', { params });

export default api;
