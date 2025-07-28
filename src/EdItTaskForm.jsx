export const EditTaskForm = () => {

    
    const taskIcons = ['👨🏻‍💻', '💬', '☕', '🏋️‍♂️', '📚', '⏰'];

    const updateTask = (editedTask) => {
        fetch(`http://localhost:3000/tasks/${editedTask.taskId}`,{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                editedTask: editedTask
            })
            
        })
        window.location.reload()
    }

    const MutateUpdateTask = useMutation({
        mutationFn: (editedTask) => updateTask(editedTask),
        onSuccess: (data) => console.log(data),
        onError: (error) => console.log(error)

    })

    return (
        <dialog ref={editFormRef}>
            <form method="dialog" className="p-2 flex flex-col">
                <div className="flex items-center justify-between">
                <legend>Task details</legend>
                <button className=" cursor-pointer p-1 rounded-sm border-1 border-[var(--light-grey)]">
                    <img src="../resources/close_ring_duotone-1.svg" alt="close" />
                </button>
                </div>
                <label htmlFor="taskName">Task name</label>
                <input maxLength={45} onChange={(e) => onTaskChange(e)} className="rounded-sm px-2 py-1 border-2 border-[var(--light-grey)]" value={editedTask.taskName} type="text" id="taskName" name="taskName" />
                <label htmlFor="taskDesc">Description</label>
                <textarea maxLength={255} onChange={(e) => onTaskChange(e)} className="rounded-sm px-2 py-1 border-2 border-[var(--light-grey)]" value={editedTask.taskDesc} name="taskDesc" id="taskDesc" placeholder="Enter a short description"></textarea>
                <fieldset className="taskIcons">
                    <legend>Icon</legend>
                    <div className="flex gap-2 items-center">
                        {taskIcons.map((icon, index) => {
                            return (
                                <Fragment key={icon}>
                                    <input onClick={(e) => onTaskChange(e)} hidden type="radio" value={icon} name="taskEmoji" id={`icon-${index}`} />
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
                        mutateDelete.mutate(editedTask)
                    }} className=" icon gap-1.5 bg-gray-400 rounded-3xl px-6 py-1.5">
                        <p>
                        Delete
                        </p>
                        <img src="../resources/Trash.svg" alt="" srcset="" />
                    </button>
                    <button onClick={(e) => {
                        e.preventDefault()
                        editTask.mutate(editedTask)
                        editFormRef.current.close()
                    }} className="icon gap-1.5 bg-blue-600 rounded-3xl px-6 py-1.5">

                        <p>Save</p>
                        <img src="../resources/Done_round.svg" alt="" srcset="" />
                        </button>
                </div>
            </form>
            </dialog>
    )
} 