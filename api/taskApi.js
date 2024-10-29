import axios from 'axios';

// Configuración de Axios para la API
const api = axios.create({
  baseURL: 'http://localhost:4000/tasks',
});

// Interceptor para agregar token de autorización si es necesario
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Guarda el token después de iniciar sesión
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones CRUD
export const getTasks = async () => {
  const response = await api.get('/');
  return response.data;
};

export const createTask = async (task) => {
  const response = await api.post('/', task);
  return response.data;
};

export const updateTask = async (id, updatedTask) => {
  const response = await api.put(`/${id}`, updatedTask);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export default api;
