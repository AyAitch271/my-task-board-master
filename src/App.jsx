import { nanoid } from "nanoid"
import { useEffect, useRef, useState } from "react"
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

    const taskStyles = {
        in_progress: {
            column_bg: 'yellow',
            status_icon: '../resources/Time_atack_duotone.svg',
            status_icon_bg: 'orange'
        },
        completed: {
            column_bg: 'light-green',
            status_icon: '../resources/Done_round_duotone.svg',
            status_icon_bg: 'green'
        },
        will_not_do: {
             column_bg: 'light-red',
             status_icon: '../resources/close_ring_duotone.svg',
             status_icon_bg: 'red'
        },
        '': {
            column_bg: 'grey',
            status_icon: '',
            status_icon_bg: 'inherit'
        }
    }

    
    return (
        <div className="">
            <h1 className="text-4xl mb-3">{taskBoard.name}</h1>
            <p className="mb-8" >{taskBoard.desc}</p>
            <div className="tasks flex gap-4  flex-col">
                {taskBoard.tasks?.map(({ taskId, taskName, taskDesc, taskEmoji, taskStatus }) => {
                    return (<button style={{ backgroundColor: `var(--${taskStyles[taskStatus].column_bg})` }}  className={`cursor-pointer flex grow-1 rounded-2xl items-center justify-between p-3` }key={taskId}>
                        <div  className="task-emoji bg-[#fff] p-2.5 rounded-xl w-8 h-8 flex items-center justify-center mr-3.5">{taskEmoji}</div>
                        <div className="task-info m-0 mr-auto">
                            <h2 className=" text-left task-name text-lg font-semibold">{taskName}</h2>
                            <p className="task-description font-light">{taskDesc}</p>
                        </div>
                        <div style={{backgroundColor: taskStyles[taskStatus].status_icon_bg}} className="p-2 rounded-md" >
                            <img src={taskStyles[taskStatus].status_icon} alt="" />
                        </div>
                    </button>)
                })}

            <button className=" flex items-center justify-center px-3 font-bold bg-[var(--light-orange)] rounded-2xl">
            <div className="p-2.5 bg-[var(--orange)] rounded-md   ">
                <img src="../resources/Add_round_duotone.svg" alt="" />
            </div>
            <p className="p-5 grow-1 text-left"  >Add new task</p>
            </button>

            </div>
        </div>
    )

}