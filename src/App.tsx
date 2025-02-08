import './App.css'

function App() {
  return (
    <div className="app">
      <h1>Kanban Board</h1>
      <div className="board">
        <div className="column">
          <h2>Todo</h2>
        </div>
        <div className="column">
          <h2>In Progress</h2>
        </div>
        <div className="column">
          <h2>Done</h2>
        </div>
      </div>
    </div>
  )
}

export default App
