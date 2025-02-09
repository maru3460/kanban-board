import React from "react"
import { Task, TaskStatus } from "../types"

interface ITackContextType {
  tasks: Task[]
  addTask: (text: string) => void
  moveTask: (id: string, status: TaskStatus) => void
  deleteTask: (id: string) => void
}

const TaskContext = React.createContext<ITackContextType | undefined>(undefined)

export default TaskContext
