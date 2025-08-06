import { nanoid } from "nanoid"
export const defaultTaskBoard = {
    boardId: nanoid(),
    boardName: "My Task Board",
    boardDesc: "Tasks to keep organised",
    tasks: [
        {
            taskId: nanoid(),
            taskName: "Task in Progress",
            taskDesc: "",
            taskIcon: "⏰",
            taskStatus: "in_progress"
        },
        {
            taskId: nanoid(),
            taskName: "Task Completed",
            taskDesc: "",
            taskIcon: "🏋️‍♂️",
            taskStatus: "completed"
        },
        {
            taskId: nanoid(),
            taskName: "Task Won't Do",
            taskDesc: "",
            taskIcon: "☕",
            taskStatus: "will_not_do"
        },
        {
            taskId: nanoid(),
            taskName: "Task To Do",
            taskDesc: "Work on a Challenge on devChallenges.io, learn TypeScript",
            taskIcon: "📚",
            taskStatus: "no_status"
        }

    ]

}