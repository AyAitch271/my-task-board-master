import { nanoid } from "nanoid"
import { Fragment, useEffect, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"

export const App = () => {

    const defaultTaskBoard = {
        id: nanoid(),
        name: "My Task Board",
        desc: "Tasks to keep organised",
        tasks: [
            {
                id: nanoid(),
                name: "Task in Progress",
                desc: "",
                emoji: "⏰",
                status: "in_progress"
            },
            {
                id: nanoid(),
                name: "Task Completed",
                desc: "",
                emoji: "🏋️‍♂️",
                status: "completed"
            },
            {
                id: nanoid(),
                name: "Task Won't Do",
                desc: "",
                emoji: "☕",
                status: "will_not_do"
            },
            {
                id: nanoid(),
                name: "Task To Do",
                desc: "Work on a Challenge on devChallenges.io, learn TypeScript",
                emoji: "📚",
                status: ""
            }

        ]

    }

    const taskIcons = ['👨🏻‍💻', '💬', '☕', '🏋️‍♂️', '📚', '⏰'];

    const [taskBoard, setTaskBoard] = useState([])
    const navigate = useNavigate()

    const ignore = useRef(false)
    useEffect(() => {
        if (ignore.current) return;
        ignore.current = true;
        const savedId = getValueFromLocalStorage('board-id')
        if (savedId) {
            const cleanSevedId = savedId.replace(/"/g, '')
            fetchTaskBoard(cleanSevedId)

        } else {
            mutation.mutate({
                id: nanoid(),
                name: defaultTaskBoard.name,
                desc: defaultTaskBoard.desc,
                tasks: defaultTaskBoard.tasks
            })
        }
    }, [])

    function createNewTaskBoard() {
        const response = fetch('http://localhost:3000/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: nanoid(),
                name: defaultTaskBoard.name,
                desc: defaultTaskBoard.desc,
                tasks: defaultTaskBoard.tasks
            })
        })
        return response.json()
    }
    function fetchTaskBoard(savedId) {

        fetch(`http://localhost:3000/${savedId}`, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                setTaskBoard(data)
            })
            .catch((error) => console.log('Failed to fetch task board' + error))
    }
    const setValueInLocalStorage = (key, value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error(error)
        }
    }
    const mutation = useMutation({
        mutationFn: createNewTaskBoard,
        onSuccess: (taskBoard) => {
            setValueInLocalStorage('board-id', taskBoard.id)
        },
        onError: (error) => console.error(error)
    })
    const getValueFromLocalStorage = (key) => {
        try {
            const savedId = window.localStorage.getItem(key)
            return JSON.parse(savedId) ? savedId : undefined
        } catch (error) {
            console.error(error)
        }
    }

    const [editedTask, setEditedTask] = useState({})

    const taskStatuses = {
        in_progress: {
            value: 'in progress',
            column_bg: 'warm-yellow',
            status_icon: '../resources/Time_atack_duotone.svg',
            status_icon_bg: 'warm-orange'
        },
        completed: {
            value: 'completed',
            column_bg: 'light-green',
            status_icon: '../resources/Done_round_duotone.svg',
            status_icon_bg: 'warm-green'
        },
        will_not_do: {
            value: "won't do",
            column_bg: 'light-red',
            status_icon: '../resources/close_ring_duotone.svg',
            status_icon_bg: 'warm-red'
        },
        '': {
            value: 'no status',
            column_bg: 'light-grey',
            status_icon: '',
            status_icon_bg: 'inherit'
        }
    }

    const editFormRef = useRef(null)
    const showEditForm = (task) => {
        editFormRef.current.showModal()
        setEditedTask(task)
        console.log(editedTask)
    }

    const onTaskChange = (e) => {
        setEditedTask(prev => {
           return {
            ...prev, 
            [e.target.name]: e.target.value}
        })
        console.log(editedTask)
    }

    return (
        <div className="">
            <h1 className="text-4xl mb-3">{taskBoard.name}</h1>
            <p className="mb-8" >{taskBoard.desc}</p>
            <div className="tasks flex gap-4  flex-col">
                {taskBoard.tasks?.map((task) => {
                    return (<button onClick={() => showEditForm(task)} style={{ backgroundColor: `var(--${taskStatuses[task.taskStatus].column_bg})` }} className={`cursor-pointer flex grow-1 rounded-2xl items-center justify-between p-3`} key={task.taskId}>
                        <div className="task-emoji bg-[#fff] p-2.5 rounded-xl w-8 h-8 flex items-center justify-center mr-3.5">{task.taskEmoji}</div>
                        <div className="task-info m-0 mr-auto">
                            <h2 className=" text-left task-name text-lg font-semibold">{task.taskName}</h2>
                            <p className="task-description font-light">{task.taskDesc}</p>
                        </div>
                        <div style={{ backgroundColor: `var(--${taskStatuses[task.taskStatus].status_icon_bg})` }} className="p-2 rounded-md" >
                            <img src={taskStatuses[task.taskStatus].status_icon} alt="" />
                        </div>
                    </button>)
                })}

                <button className=" flex items-center justify-center px-3 font-bold bg-[var(--light-orange)] rounded-2xl">
                    <div className="p-2.5 bg-[var(--warm-orange)] rounded-md   ">
                        <img src="../resources/Add_round_duotone.svg" alt="" />
                    </div>
                    <p className="p-5 grow-1 text-left"  >Add new task</p>
                </button>

            </div>
            <dialog ref={editFormRef}>
            <form method="dialog" className="p-2 flex flex-col">
                <div className="flex items-center justify-between">
                <legend>Task details</legend>
                <button className=" cursor-pointer p-1 rounded-sm border-1 border-[var(--light-grey)]">
                    <img src="../resources/close_ring_duotone-1.svg" alt="close" />
                </button>
                </div>
                <label htmlFor="taskName">Task name</label>
                <input onChange={(e) => onTaskChange(e)} className="rounded-sm px-2 py-1 border-2 border-[var(--light-grey)]" value={editedTask.taskName} type="text" id="taskName" name="taskName" />
                <label htmlFor="taskDesc">Description</label>
                <textarea onChange={(e) => onTaskChange(e)} className="rounded-sm px-2 py-1 border-2 border-[var(--light-grey)]" value={editedTask.taskDesc} name="taskDesc" id="taskDesc" placeholder="Enter a short description"></textarea>
                <fieldset className="taskIcons">
                    <legend>Icon</legend>
                    <div className="flex gap-2 items-center">
                        {taskIcons.map((icon, index) => {
                            return (
                                <Fragment key={icon}>
                                    <input onChange={(e) => onTaskChange(e)} hidden type="radio" name="taskIcon" id={`icon-${index}`} />
                                    <label className={`icon w-10 h-10 text-2xl bg-${ icon === editedTask.taskEmoji ? '[var(--warm-orange)]': '[var(--light-grey)]'} rounded-md`} htmlFor={`icon-${index}`}>{icon}</label>
                                </Fragment>
                            )
                        })}
                    </div>
                </fieldset>
                <fieldset className="taskStatuses">
                    <legend>Status</legend>
                    <div className="flex flex-wrap">
                        {Object.entries(taskStatuses).map(([keys, values]) => {
                            return (
                                <div className={`flex  items-center p-0.5 border-1 rounded-md border-${keys === editedTask.taskStatus ? 'blue-600': '[var(--{light-grey})]'} basis-1/2`}>
                                <div className="icon mr-3 p-2 rounded-sm" style={{ backgroundColor: `var(--${values.status_icon_bg})` }}>
                                    <img src={values.status_icon} alt="" />
                                </div>
                                <input onClick={(e) => onTaskChange(e)}  hidden type="radio" name="taskStatus" value={values.value} id={keys} />
                                <label aria-label={values.value} value={values.value} htmlFor={keys}>{values.value}</label>
                                </div>
                            )
                        })}
                    </div>
                </fieldset>
                <div className="buttons flex justify-end gap-3 text-white text-right">
                    <button className=" icon gap-1.5 bg-gray-400 rounded-3xl px-6 py-1.5">
                        <p>
                        Delete
                        </p>
                        <img src="../resources/Trash.svg" alt="" srcset="" />
                    </button>
                    <button className="icon gap-1.5 bg-blue-600 rounded-3xl px-6 py-1.5">
                        <p>Save</p>
                        <img src="../resources/Done_round.svg" alt="" srcset="" />
                        </button>
                </div>
            </form>
            </dialog>
        </div>
    )

}
{/* <div className="">
<div className="w-5 h-5" style={{backgroundColor: `var(--${taskStatuses[status].status_icon_bg})`}}>
    <img src={taskStatuses[status].status_icon} alt="" />
</div>
</div> */}