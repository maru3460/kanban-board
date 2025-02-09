import React from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import { Task, TaskStatus } from "../types"
import TaskContext from "../contexts/TaskContext"

const TaskProvier: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [])

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      status: "todo",
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const moveTask = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task)),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, moveTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export default TaskProvier
