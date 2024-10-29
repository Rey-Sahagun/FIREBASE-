require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

let users = []; // Simulación de base de datos en memoria para usuarios
let tasks = []; // Simulación de base de datos en memoria para tareas

const JWT_SECRET = 'mi_clave_secreta'; // Cambia esta clave en producción

// Middleware para verificar JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
  const { username } = req.body;
  const existingUser = users.find(user => user.username === username);
  if (existingUser) return res.status(400).json({ error: 'El usuario ya existe' });

  const hashedPassword = await bcrypt.hash('12345', 10); // Contraseña predeterminada
  const newUser = { id: uuidv4(), username, password: hashedPassword };
  users.push(newUser);
  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Ruta para iniciar sesión y obtener un token
// Ruta para iniciar sesión y obtener un token
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).json({ error: 'Usuario no encontrado' });
  }

  // Verifica que `password` y `user.password` existan
  if (!password || !user.password) {
    return res.status(400).json({ error: 'Credenciales inválidas' });
  }

  try {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error en la comparación de contraseña:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para obtener las tareas del usuario autenticado
app.get('/tasks', authenticateToken, (req, res) => {
  const userTasks = tasks.filter(task => task.userId === req.user.id);
  res.json(userTasks);
});

// Ruta para crear una nueva tarea
app.post('/tasks', authenticateToken, (req, res) => {
  const newTask = { id: uuidv4(), userId: req.user.id, name: req.body.name };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Ruta para actualizar una tarea del usuario autenticado
app.put('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === id && task.userId === req.user.id);
  if (taskIndex === -1) return res.status(404).json({ error: 'Tarea no encontrada' });

  tasks[taskIndex] = { ...tasks[taskIndex], name: req.body.name };
  res.json(tasks[taskIndex]);
});

// Ruta para eliminar una tarea del usuario autenticado
app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => !(task.id === id && task.userId === req.user.id));
  res.status(204).send();
});

// Ruta de prueba en la raíz
app.get('/', (req, res) => {
  res.send('API de tareas con autenticación funcionando');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
