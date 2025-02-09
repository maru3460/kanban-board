import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import TaskProvier from "./providers/TaskProvider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskProvier>
      <App />
    </TaskProvier>
  </StrictMode>,
)
