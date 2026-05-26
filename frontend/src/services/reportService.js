import api from './api';

export const getReports = async () => {
  const response = await api.get('/reports');
  return response.data.data;
};

export const getMyReports = async () => {
  const response = await api.get('/reports/me');
  return response.data.data;
};

export const createReport = async (formData) => {
  // BIARKAN AXIOS YANG MENGATUR HEADER DAN BOUNDARY SECARA OTOMATIS
  const response = await api.post('/reports', formData);
  return response.data;
};