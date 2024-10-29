import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [username, setUsername] = useState('');
  const [password] = useState('12345'); // Contraseña predeterminada
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Configurar el token en el encabezado de cada solicitud si está presente
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchTasks();
    }
  }, [token]);

  // Función para obtener las tareas del usuario autenticado
  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  // Función para registrar un nuevo usuario
  const handleRegister = async () => {
    try {
      await api.post('/register', { username });
      alert('Usuario registrado. Ahora inicia sesión.');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  };

  // Función de inicio de sesión para obtener el token JWT
  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { username, password });
      const token = response.data.token;
      if (token) {
        setToken(token);
        localStorage.setItem('token', token); // Guarda el token en localStorage
        alert('Inicio de sesión exitoso');
      } else {
        alert('No se recibió un token. Verifica el inicio de sesión.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Verifica el nombre de usuario y contraseña.');
    }
  };

  // Función para crear una nueva tarea
  const handleCreateTask = async () => {
    try {
      const response = await api.post('/tasks', { name: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  // Función para actualizar una tarea
  const handleUpdateTask = async (id) => {
    try {
      const updatedName = prompt('Edita el nombre de la tarea');
      const response = await api.put(`/tasks/${id}`, { name: updatedName });
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  // Función para eliminar una tarea
  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  return (
    <div className="App">
      <h1>Gestión de Tareas</h1>

      <div>
        <h2>Registro</h2>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleRegister}>Registrarse</button>
      </div>

      <div>
        <h2>Inicio de Sesión</h2>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Iniciar Sesión</button>
      </div>

      <div>
        <h2>Agregar Tarea</h2>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
        />
        <button onClick={handleCreateTask}>Agregar Tarea</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.name}
            <button onClick={() => handleUpdateTask(task.id)}>Editar</button>
            <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
