import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToDoTask } from '../models/to-do-task.model';
import { TaskStatus } from '../enums/task-status.enum';

@Injectable({
  providedIn: 'root',
})
export class TaskManagementService {
  //Observables
  public toDoList$: BehaviorSubject<ToDoTask[]> = new BehaviorSubject<
    ToDoTask[]
  >([]);

  //Data
  public toDoList: ToDoTask[] = [];

  constructor() {}

  public populateToDoTaskList(): void {
    for (let i = 1; i <= 14; i++) {
      const task: ToDoTask = {
        Name: `Task ${i}`,
        Date: new Date(new Date().setHours(0, 0, 0, 0)),
        Status: i % 2 === 0 ? TaskStatus.Completed : TaskStatus.Active,
      };

      this.toDoList.push(task);
    }

    this.toDoList$.next(this.toDoList);
  }

  public addNewTask(toDoTask: ToDoTask): void {
    try {
      //Set status to Active
      toDoTask.Status = TaskStatus.Active;

      // Update the list immutably
      this.toDoList = [...this.toDoList, toDoTask];

      // Notify subscribers about the change
      this.toDoList$.next(this.toDoList);
    } catch (error) {
      // Handle the error as needed
      console.error('Error adding task:', error);
    }
  }

  public removeTask(toDoTask: ToDoTask) {
    try {
      // Create a new array excluding the task to be removed
      this.toDoList = this.toDoList.filter((task) => task != toDoTask);
    } catch (error) {
      // Handle the error as needed
      console.error('Error removing task:', error);
    }
    // Notify subscribers about the change
    this.toDoList$.next(this.toDoList);
  }

  public editTask(toDoTask: ToDoTask): void {
    try {
      const index = this.toDoList.findIndex((task) => task === toDoTask);

      if (index !== -1) {
        // Make a copy of the existing task or directly modify the existing task based on your requirements
        const updatedTask: ToDoTask = { ...this.toDoList[index], ...toDoTask };

        // Update the array with the modified task
        this.toDoList[index] = updatedTask;
      }
    } catch (error) {
      // Handle the error as needed
      console.error('Error updating task:', error);
    }
    // Notify subscribers about the change
    this.toDoList$.next(this.toDoList);
  }
}
