export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
  createdAt: Date;
}

export interface DragItem {
  type: "TASK";
  id: string;
  status: TaskStatus;
}
