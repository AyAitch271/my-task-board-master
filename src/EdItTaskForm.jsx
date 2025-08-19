import { useMutation, useQueryClient } from "@tanstack/react-query";
import { forwardRef } from "react";
import { Fragment } from "react";
import { taskStatuses } from "./objects/taskStatuses";
import { useParams } from "react-router";

export const EditTaskForm = forwardRef(({newTask, onTaskChange}, editFormRef ) => {
    const {boardId} = useParams()
    const queryClient = useQueryClient()
    const taskIcons = ['👨🏻‍💻', '💬', '☕', '🏋️‍♂️', '📚', '⏰'];

    const mutateDelete = useMutation({
        mutationFn: (taskToDelete) => deleteTask(taskToDelete),
        onSettled: () => {
            queryClient.invalidateQueries('board', boardId)
            console.log('deleted')
            editFormRef.current.close()
        },
        onError: (error) => alert('ERROR' + error)
    })

    const updateTask = (newTask) => {
        if(newTask.taskName === '') return
       return fetch(`http://localhost:3000/tasks/${newTask.taskId}`,{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                newTask
            })

        })
    }
    const deleteTask= (taskToDelete) => {
        return fetch(`http://localhost:3000/tasks/${taskToDelete.taskId}`, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    boardId: boardId
                })
            })
    }


    const mutateUpdateTask = useMutation({
        mutationFn: (newTask) => updateTask(newTask),
        onSettled: () => {
            queryClient.invalidateQueries('board', boardId)
        },
        onMutate:  (newTask) => {
            const oldTaskBoard = queryClient.getQueryData('board', boardId) 
            queryClient.setQueryData(['board', boardId], (old) => {
                const updatedTasks = old.tasks.map(task => task.taskId === newTask.taskId ? newTask : task)
                return {...old, tasks: updatedTasks}
                })
                return {oldTaskBoard}
            }, 
            onError: (error, context) => {
                alert('ERROR' + error)
                queryClient.setQueriesData(['board', boardId], context.oldTaskBoard)
            },
    })


    return (
        <dialog className='self-center justify-self-end mr-5 rounded-2xl'ref={editFormRef}>
            <div className="md:w-lg w-full h-full flex flex-col p-4">
                <form method="dialog" className="justify-around gap-3 flex flex-col grow-1">
                <div className="flex items-center justify-between">
                <legend className="text-2xl">Task details</legend>
                <button className=" cursor-pointer p-1 rounded-sm border-1 border-[var(--light-grey)]">
                    <img src="../resources/close_ring_duotone-1.svg" alt="close" />
                </button>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="taskName">Task name</label>
                    <input maxLength={45} onChange={(e) => onTaskChange(e)} className="rounded-sm px-2 py-1 border-2 border-[var(--light-grey)]" value={newTask.taskName} type="text" id="taskName" name="taskName" />
                </div>
                <div className="flex flex-col gap-1">
                <label htmlFor="taskDesc">Description</label>
                <textarea maxLength={255} onChange={(e) => onTaskChange(e)} className="rounded-sm px-2 py-1 border-2 border-[var(--light-grey)]" value={newTask.taskDesc} name="taskDesc" id="taskDesc" placeholder="Enter a short description"></textarea>
                </div>
                <fieldset className="taskIcons">
                    <legend>Icon</legend>
                    <div className="flex gap-2 items-center">
                        {taskIcons.map((icon, index) => {
                            return (
                                <Fragment key={icon}>
                                    <input onClick={(e) => onTaskChange(e)} hidden type="radio" value={icon} name="taskIcon" id={`icon-${index}`} />
                                    <label style={{backgroundColor: `${ icon === newTask.taskIcon ? 'var(--warm-yellow)': 'var(--light-grey)'}`}} className={`mr-3 icon w-10 h-10 text-2xl rounded-md`} htmlFor={`icon-${index}`}>{icon}</label>
                                </Fragment>
                            )
                        })}
                    </div>
                </fieldset>
                <fieldset className="taskStatuses">
                    <legend>Status</legend>
                    <div className="flex flex-wrap gap-1">
                        {Object.entries(taskStatuses).map(([keys, values]) => {
                            return (
                                <div key={keys} style={{borderColor: `${keys === newTask.taskStatus ? 'blue': 'var(--light-grey)'}`}} className={`h-11 flex rounded-md items-center p-0.5 border-2 grow-1`}>
                                <div className="icon mr-3 p-2 rounded-sm" style={{ backgroundColor: `var(--${values.status_icon_bg})` }}>
                                   { keys !== 'no_status' && <img src={`${values.status_icon}`} alt="" />}
                                </div>
                                <input onClick={(e) => onTaskChange(e)}  hidden type="radio" name="taskStatus" value={keys} id={keys} />
                                <label aria-label={values.value} value={keys} htmlFor={keys}>{values.value}</label>
                                </div>
                            )
                        })}
                    </div>
                </fieldset>
                <div className="buttons flex justify-end gap-3 text-white text-right">
                    <button onClick={(e) => {
                        e.preventDefault()
                        mutateDelete.mutate(newTask)
                    }} className=" icon gap-1.5 bg-gray-400 rounded-3xl px-6 py-1.5">
                        <p>
                        Delete
                        </p>
                        <img src="../resources/Trash.svg" alt="delete" />
                    </button>
                    <button onClick={(e) => {
                        e.preventDefault()
                        mutateUpdateTask.mutate(newTask)
                        editFormRef.current.close()
                    }} className="icon gap-1.5 bg-blue-600 rounded-3xl px-6 py-1.5">
                        <p>Save</p>
                        <img src="../resources/Done_round.svg" alt="save" />
                        </button>
                </div>
                </form>
            </div>
            </dialog>
    )
})