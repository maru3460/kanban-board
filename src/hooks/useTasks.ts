import useLocalStorage from "./useLocalStorage"
import { Task, TaskStatus } from "../types"

const useTasks = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [])

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      status: "todo",
      createdAt: new Date(),
    }
    setTasks([...tasks, newTask])
  }

  const moveTask = (id: string, status: TaskStatus) => {
    setTasks((prev: Task[]) =>
      prev.map((task: Task) => (task.id === id ? { ...task, status } : task)),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== id))
  }

  return {
    tasks,
    addTask,
    moveTask,
    deleteTask,
  }
}

export default useTasks
