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
    console.log(taskBoard[0], 'board')
    console.log(boardTasks[0], 'tasks')
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
    return res.status(200).send({
      id: taskBoard[0].boardId,
    })
  } catch (error) {
    res.status(500).send({message: error})
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})