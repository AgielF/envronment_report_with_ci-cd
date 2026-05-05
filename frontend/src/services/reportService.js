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
  const response = await api.post('/reports', formData, {
    headers: {
      // Penting untuk upload file/foto bukti laporan ke Cloud Storage
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};