require('dotenv').config();
const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const { 
  getTaskBoard, 
  createTaskBoard, 
  updateTaskBoard, 
  addTask,
  updateTask,
  deleteTask } = require('./handlers');

const PORT = 3000;

const app = express()

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173'
}))

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post('/', (req, res) => {createTaskBoard(req, res, db)})
app.get('/:boardId', (req, res) => {getTaskBoard(req, res, db)})
app.put('/:boardId', (req, res) => {updateTaskBoard(req, res, db)})

app.post('/tasks', (req, res) => {addTask(req, res, db)})
app.put('/tasks/:taskId', (req, res) => {updateTask(req, res, db)})
app.delete('/tasks/:taskId',  (req, res) => {deleteTask(req, res, db)})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})