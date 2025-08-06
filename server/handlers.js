const createTaskBoard = async (req, res , db) => {
    const {boardId, boardName, boardDesc} = req.body
    const {tasks} = req.body
    try {
        if(boardId.length > 21) return
        await db.query('INSERT INTO `boards` (`boardId`, `boardName`, `boardDesc` ) VALUES(?, ?, ?)', [boardId, boardName, boardDesc])
        await tasks.map((task) => {
          return db.query(`INSERT INTO tasks (boardId, ${[Object.keys(task)]}) VALUES (?,?)`, [boardId, Object.values(task)])
        })
        const [taskBoardId] = await db.execute('SELECT boardId FROM boards WHERE boardId = ?', [boardId])
        return res.status(200).send({
          boardId: taskBoardId[0].boardId,
        })
      } catch (error) { 
        res.status(500).send({error: error})
      }
}

 const getTaskBoard = async (req, res, db) => {
    try {
        const {boardId} = req.params
        console.log(boardId)
        const [taskBoard] = await db.execute('SELECT * FROM boards WHERE boardId = ?', [boardId])
        const [boardTasks] = await db.execute('SELECT * FROM tasks WHERE boardId = ?', [boardId])
        if(taskBoard && boardTasks) return res.status(200).send({...taskBoard[0], tasks: boardTasks})
        return
      } catch (error) {
        res.status(500).send({error: error})
      }
}

const updateTaskBoard = async (req, res, db) => {
      try {
        db.query('UPDATE boards SET ? WHERE boardId = ?', [req.body, req.params.boardId])
        return res.status(200).send({
         success: true
        })
      } catch (error) {
        res.status(500).send({error: error})
      }
}

const addTask = async (req, res, db) => {
    const {addedTask} = req.body
    try {
        db.query(`INSERT INTO tasks (${[Object.keys(addedTask)]}) VALUES (?)`, [Object.values(addedTask)])
        res.status(200).send({success: true})
        } catch (error) {
          res.status(400).send({error: error})
        }
}

const updateTask = (req, res, db) => {
  const {taskId} = req.params;
  const {newTask} = req.body;
  delete newTask.boardId
  try {
    db.query('UPDATE `tasks` SET ? WHERE taskId = ?', [newTask,  taskId]);
    res.status(200).send({message: 'edited successfully!'})
  } catch (error) {

    res.status(500).send({error: error})
  }
}

const deleteTask = (req, res, db) => {
    try {
        const {taskId} = req.params;
        db.execute('DELETE FROM `tasks` WHERE taskId = ?', [taskId])
        res.status(200).send({message: 'deleted'})
      } catch (error) {
        res.status(500).send({error: error })
      }
}

module.exports = {getTaskBoard, createTaskBoard, updateTaskBoard, addTask, updateTask, deleteTask}