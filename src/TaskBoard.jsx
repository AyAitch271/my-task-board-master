import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react";
import { nanoid } from "nanoid";
import { useParams } from "react-router"
import { taskStatuses } from "./objects/taskStatuses";

import { EditTaskForm } from "./EdItTaskForm";




export const TaskBoard = () => {

    const queryClient = useQueryClient()
    
    let params = useParams()
    const {boardId} = params

    const editFormRef = useRef(null)
    const [newTask, setnewTask] = useState({})

    const showEditForm = (task) => {
        editFormRef.current.showModal()
        setnewTask(task)
    }

    

    const createTask = (addedTask) => {
       return fetch(`http://localhost:3000/tasks`,{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                addedTask
            })
        })
    }

    const mutateCreateTask = useMutation({
        mutationFn: (addedTask) => createTask(addedTask),
        onSettled: () => {
            queryClient.invalidateQueries('board', boardId)
        },
        onMutate: () => {
            const oldTaskBoard = queryClient.getQueriesData(['board', boardId])
            queryClient.setQueryData(['board', boardId], (old) => {
                return {...old, tasks: [newTask, ...old.tasks]}
            });
            return {oldTaskBoard}
        },
        onError: (error, context) => {
            alert('ERROR' + error)
            queryClient.setQueriesData(['board', boardId], context.oldTaskBoard)
        },
    })


    const onTaskChange = (e) => {
        setnewTask(prev => {
           return {
            ...prev, 
            [e.target.name]: e.target.value}
        })
    }


    function fetchTaskBoard() {
        return fetch(`http://localhost:3000/${boardId}`, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
    }

    const { data: TaskBoard, status } = useQuery({
        queryKey: ['board', boardId],
        queryFn:  fetchTaskBoard,
        staleTime: 1000
    })

    const updateTaskBoard = (newInfo) => {
       return fetch(`http://localhost:3000/${boardId}`, {
            headers: {'Content-Type': 'application/json'},
            method: 'put',
            body: JSON.stringify(newInfo)
        })
    }

    const mutateBoardInfo = useMutation({
        mutationFn: (newInfo) => updateTaskBoard(newInfo),
        onError: (error) => alert('ERROR' + error)
    })
    console.log(TaskBoard)

    return status === 'success' ? (
        <div className="flex p-4 flex-col w-screen h-screen mx-auto my-0 justify-center md:w-lg">
            <h1 contentEditable
            id="boardName"
            className="selection:bg-[var(--light-orange)] focus:outline-0 w-fit text-4xl mb-3"
            suppressContentEditableWarning
            onBlur={(e) => mutateBoardInfo.mutate({[e.target.id]:e.target.textContent})}>
                {TaskBoard.boardName}
            </h1>
            <p
            id="boardDesc"
            className="selection:bg-[var(--light-orange)] focus:outline-0 w-fit mb-8" 
            contentEditable 
            suppressContentEditableWarning 
            onBlur={(e) => mutateBoardInfo.mutate({[e.target.id]:e.target.textContent})}
            >{TaskBoard.boardDesc}</p>
            <div className="tasks mb-4 flex gap-4  flex-col w-full overflow-scroll">
                {TaskBoard.tasks?.map((task) => {
                    if(!task.taskId) return
                    return (<button onClick={() => showEditForm(task)} style={{ backgroundColor: `var(--${taskStatuses[task.taskStatus].column_bg})` }} className={`cursor-pointer flex rounded-2xl items-center justify-between p-3`} key={task.taskId}>
                        <div style={{
                            backgroundColor: `${task.taskIcon ? '#fff' : 'transparent'}`
                        }} className={`task-emoji p-2.5 rounded-xl w-8 h-8 flex items-center justify-center mr-3.5`}>{task.taskIcon}</div>
                        <div className="task-info m-0 mr-auto">
                            <h2 className=" text-left task-name text-lg font-semibold">{task.taskName}</h2>
                            <p className="task-description font-light">{task.taskDesc}</p>
                        </div>
                        <div style={{ backgroundColor: `var(--${taskStatuses[task.taskStatus].status_icon_bg})` }} className="p-2 rounded-md" >
                            {task.taskStatus && <img src={taskStatuses[task.taskStatus].status_icon} alt="" />}
                        </div>
                    </button>)
                })}

            </div>
                {TaskBoard.tasks[0].taskId  && <button onClick={() => mutateCreateTask.mutate(
                    {
                        boardId: boardId,
                        taskId: nanoid(),
                        taskName: 'new task',
                        taskStatus: 'no_status'

                    })} className="w-full flex items-center justify-center px-3 font-bold bg-[var(--light-orange)] rounded-2xl">
                    <div className="p-2.5 bg-[var(--warm-orange)] rounded-md   ">
                        <img src="../resources/Add_round_duotone.svg" alt="" />
                    </div>
                    <p className="p-5 grow-1 text-left">Add new task</p>
                </button>}
            <EditTaskForm ref={editFormRef} newTask={newTask} onTaskChange={onTaskChange} />
        </div>
    ) : (
        <div>Loading</div>
    );
}


