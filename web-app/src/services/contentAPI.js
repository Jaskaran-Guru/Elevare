import api from './api';

export const contentAPI = {
  getContent: (params = {}) => api.get('/content', { params }),
  getContentById: (id) => api.get(`/content/${id}`),
  updateProgress: (contentId, progressData) => 
    api.put(`/content/${contentId}/progress`, progressData),
};
