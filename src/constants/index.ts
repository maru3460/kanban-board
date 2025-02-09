export const COLUMN_NAMES = {
  TODO: "todo",
  IN_PROGRESS: "inProgress",
  DONE: "done",
} as const

export const COLUMN_TITLES = {
  [COLUMN_NAMES.TODO]: "Todo",
  [COLUMN_NAMES.IN_PROGRESS]: "In Progress",
  [COLUMN_NAMES.DONE]: "Done",
} as const

export const ItemTypes = {
  TASK: "TASK",
} as const
