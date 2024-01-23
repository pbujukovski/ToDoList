import { TaskStatus } from "../enums/task-status.enum";

export class ToDoTask {
  public Name: string = '';
  public Date!: Date;
  public Status : TaskStatus = TaskStatus.Active;
}
