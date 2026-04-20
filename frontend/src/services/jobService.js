import api from './api';

export const authService = {
  register: (data) =>
    api.post('/auth/register', data),
  
  login: (data) =>
    api.post('/auth/login', data),
  
  getMe: () =>
    api.get('/auth/me'),
};

export const jobService = {
  getJobs: () =>
    api.get('/jobs'),
  
  getJobStats: () =>
    api.get('/jobs/stats'),
  
  getJobById: (id) =>
    api.get(`/jobs/${id}`),
  
  createJob: (data) => {
  console.log("Creating job with data:", data);
  return api.post('/jobs', data);
},
  
  updateJob: (id, data) =>
    api.put(`/jobs/${id}`, data),
  
  updateJobStatus: (id, status) =>
    api.patch(`/jobs/${id}/status`, { status }),
  
  deleteJob: (id) =>
    api.delete(`/jobs/${id}`),
};
