import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToDoTask } from '../models/to-do-task.model';
import { TaskStatus } from '../enums/task-status.enum';

@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {

  public toDoList$: BehaviorSubject<ToDoTask[]> = new BehaviorSubject<ToDoTask[]>([]);

  private toDoList: ToDoTask[] = [];

  constructor() { }

  public populateToDoTaskList(): void {
    for (let i = 1; i <= 14; i++) {
      const task: ToDoTask = {
        Name: `Task ${i}`,
        Date: new Date(), // You can set a specific date if needed
        Status: i % 2 === 0 ? TaskStatus.Completed : TaskStatus.Active,
      };

      this.toDoList.push(task);
    }
    console.log(this.toDoList);

    this.toDoList$.next(this.toDoList);
  }

  public addNewTask(toDoTask: ToDoTask): void {
    try {
      //Set status to Active
      toDoTask.Status = TaskStatus.Active;

      // Update the list immutably
      this.toDoList = [...this.toDoList, toDoTask];

      // Update the observable
      this.toDoList$.next(this.toDoList);
    } catch (error) {
      // Handle the error as needed
      console.error('Error adding task:', error);
    }
  }

  public removeTask(toDoTask: ToDoTask){

    // const index = this.toDoList.indexOf(toDoTask);

    // if (index !== -1) {
    //   this.toDoList.splice(index, 1);
    // }

    // Create a new array excluding the task to be removed
    this.toDoList = this.toDoList.filter(task => task != toDoTask);

    console.log(this.toDoList.length);
    this.toDoList$.next(this.toDoList);

  }

  public editTask(toDoTask: ToDoTask): void {
    const index = this.toDoList.findIndex(task => task === toDoTask);

    console.log(index);
    if (index !== -1) {
      // Make a copy of the existing task or directly modify the existing task based on your requirements
      const updatedTask: ToDoTask = { ...this.toDoList[index], ...toDoTask };

      // Update the array with the modified task
      this.toDoList[index] = updatedTask;

      // Log the updated array and task for verification
      console.log("Updated Array:", this.toDoList);
      console.log("Updated Task:", this.toDoList[index]);
    }

    // Notify subscribers about the change
    this.toDoList$.next(this.toDoList);
  }
}
