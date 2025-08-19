import { useEffect, useRef,  } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"
import { defaultTaskBoard } from "./objects/defaultTaskBoard"
import { TaskBoard } from "./TaskBoard"
import { nanoid } from "nanoid"

export const App = () => {
    let params = useParams()
    const {boardId} = params
    
    const navigate = useNavigate()

    const ignore = useRef(false)
    useEffect(() => {
        if (ignore.current) return;
        ignore.current = true;
        if (boardId) {
            navigate(`/${boardId}`)

        } else {
            mutateCreateTaskbBoard.mutate(defaultTaskBoard)
        }
    }, [])

    function createNewTaskBoard() {
       return  fetch('http://localhost:3000/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(defaultTaskBoard)
        }).then(response => response.json())
    }

    const mutateCreateTaskbBoard = useMutation({
        mutationFn:  createNewTaskBoard,
        onSuccess: (data) => {
        navigate(`/${data.boardId}`)
        },
        onError: (error) => console.error('error is', error)
    })
    

    return (
       <TaskBoard/>
    )

}
