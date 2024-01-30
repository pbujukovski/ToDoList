import { DialogAction } from "../enums/dialog-action.enum";
import { ToDoTask } from "./to-do-task.model";

export interface TaskDialogData {
  toDoTask: ToDoTask;
  additionalData: DialogAction;
}
