import React from "react"
import "./App.css"
import Column from "./components/Column/Column"
import useTasks from "./hooks/useTasks"

const App: React.FC = () => {
  const { addTask } = useTasks()
  const [count, setCount] = React.useState(0)

  const handleClick = () => {
    addTask(`Task ${count + 1}`)
    setCount(count + 1)
  }

  return (
    <div className="app">
      <h1>Kanban Board</h1>
      <div className="board">
        <Column column="todo" />
        <Column column="in-progress" />
        <Column column="done" />
      </div>
      <button onClick={handleClick}>Add Task</button>
    </div>
  )
}

export default App
