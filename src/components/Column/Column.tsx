import React from "react"
import useTasks from "../../hooks/useTasks"
import { TaskStatus } from "../../types"

interface IColumnProps {
  column: TaskStatus
}

const Column: React.FC<IColumnProps> = ({ column }) => {
  const { tasks } = useTasks()
  const columnTasks = tasks.filter((task) => task.status === column)

  return (
    <div className="column">
      <h2>{column}</h2>
      <ul>
        {columnTasks.map((task) => (
          <li key={task.id}>{task.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default Column
