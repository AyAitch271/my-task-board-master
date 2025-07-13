import { nanoid } from "nanoid"
import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate} from "react-router"

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
    const [ taskBoard, setTaskBoard ] = useState([])
    const navigate = useNavigate()
    
    const ignore = useRef(false)
    useEffect(() => {
        if (ignore.current) return;
        ignore.current = true;
        const savedId = getValueFromLocalStorage('board-id')
        if(savedId){
            const cleanSevedId = savedId.replace(/"/g, '')
            fetchTaskBoard(cleanSevedId)
            
        }else{
            mutation.mutate({
                id: nanoid(),
                name: defaultTaskBoard.name,
                desc: defaultTaskBoard.desc,
                tasks: defaultTaskBoard.tasks
            })
        }
    }, [])
    
     function createNewTaskBoard() {
        const response =  fetch('http://localhost:3000/', {
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
     function fetchTaskBoard(savedId){
        
         fetch(`http://localhost:3000/${savedId}`, {
             method: 'get',
             headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => { 
            setTaskBoard(data)
        })
        .then(console.log(taskBoard))
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

    
    return (
        <div className="">
        {taskBoard.name}

        </div>
    )

}