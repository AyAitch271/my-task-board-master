require('dotenv').config();
const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors')

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

app.get('/:boardId', async (req, res) => {
  try {
    const [taskBoard] = await db.execute('SELECT * FROM boards WHERE boardId = ?', [req.params.boardId])
    const [boardTasks] = await db.execute('SELECT * FROM tasks WHERE boardId = ?', [req.params.boardId])
    return res.status(200).send({
      id: taskBoard[0].boardId,
      name: taskBoard[0].boardName,
      desc: taskBoard[0].boardDesc,
      tasks: boardTasks
    })
  } catch (error) {
    res.status(500).send({message: 'error'})
  }
})

app.post('/', async (req, res) => {
  try {
    await db.query('INSERT INTO `boards` (`boardId`, `boardName`, `boardDesc` ) VALUES(?, ?, ?)', [req.body.id, req.body.name, req.body.desc])
    await req.body.tasks.map((task) => {
      return db.query('INSERT INTO `tasks` (`boardId`, `taskId`, `taskName`, `taskDesc`, `taskEmoji`, `taskStatus`) VALUES (?,?,?,?,?,?)', [req.body.id, task.id, task.name, task.desc, task.emoji, task.status])
    })
    const [taskBoard] = await db.execute('SELECT * FROM boards WHERE boardId = ?', [req.body.id])
    console.log(taskBoard)
    return res.status(200).send({
      id: taskBoard[0].boardId,
    })
  } catch (error) {
    res.status(500).send({message: error})
  }
})

app.put('/tasks/:taskId', async (req, res) => {
  console.log(req.body)
  const taskId = req.params.taskId;
  const {taskName, taskDesc, taskEmoji, taskStatus, boardId} = req.body.editedTask
  const values = []
  try {
    db.query('UPDATE `tasks` SET taskName = ? , taskDesc = ? , taskEmoji = ?, taskStatus = ? WHERE taskId = ? AND boardId = ?', [req.body.editedTask.taskName, req.body.editedTask.taskDesc, req.body.editedTask.taskEmoji, req.body.editedTask.taskStatus, req.body.editedTask.taskId, req.body.editedTask.boardId]);
    res.status(200).send({message: 'edited successfully!'})
  } catch (error) {
    res.status(500).send({message: error})
  }
})

app.post('/tasks', async (req, res) => {
  console.log(req.body.newTask)
  try {
  db.query(`INSERT INTO tasks (${[Object.keys(req.body.newTask)]}) VALUES (?)`, [Object.values(req.body.newTask)])
  const [task] = await db.execute('SELECT * FROM tasks WHERE taskId = (?)', [req.body.newTask.taskId]);
  console.log(task)
  res.status(200).send({task: task[0]})
  } catch (error) {
    console.error(error)
  }
})

app.delete('/tasks/:taskId', async (req, res) => {
  try {
    const {taskId} = req.params;
    console.log(req.params.taskId)
    const {boardId} = req.body
    db.execute('DELETE FROM `tasks` WHERE taskId = ?', [req.params.taskId])
    res.status(200).send({message: 'deleted'})
  } catch (error) {
    res.status(500).send({error: 'server error' + error })
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})