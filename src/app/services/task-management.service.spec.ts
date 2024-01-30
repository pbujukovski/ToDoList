import { TestBed } from '@angular/core/testing';
import { TaskManagementService } from './task-management.service';
import { ToDoTask } from '../models/to-do-task.model';
import { TaskStatus } from '../enums/task-status.enum';

describe('TaskManagementService', () => {
  let service: TaskManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify subscribers about the change', () => {
    // Arrange
    const toDoTask: ToDoTask =
      { Name: 'Task 1', Date: new Date(), Status: TaskStatus.Active };

    let notifiedList: ToDoTask[];
    service.toDoList$.subscribe((list) => {
      notifiedList = list;
    });

    // Act
    service.addNewTask(toDoTask);

    // Assert
    expect(notifiedList!).toEqual([{
      ...toDoTask,
      Status: TaskStatus.Active,
    }]);
  });

  it('should handle errors and log them', () => {
    // Arrange
    spyOn(console, 'error');

    const toDoTask: ToDoTask =     { Name: 'Task 1', Date: new Date(), Status: TaskStatus.Active }

    // Force an error by making toDoList property undefined
    service.toDoList$ = undefined as any;

    // Act
    service.addNewTask(toDoTask);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Error adding task:', jasmine.any(Error));
  });

  it('should remove a task from the to-do list', () => {
    // Arrange
    const taskToRemove: ToDoTask =  { Name: 'Task 1', Date: new Date(), Status: TaskStatus.Active };
    // Add a task to the list before removing it
    service.addNewTask(taskToRemove);

    // Act
    service.removeTask(taskToRemove);

    // Assert
    expect(service.toDoList.length).toBe(0);
  });

  it('should notify subscribers about the change', () => {
    // Arrange
    const taskToRemove: ToDoTask =  { Name: 'Task 1', Date: new Date(), Status: TaskStatus.Active };

    // Add a task to the list before removing it
    service.addNewTask(taskToRemove);

    let notifiedList: ToDoTask[] | null = null;
    service.toDoList$.subscribe((list) => {
      notifiedList = list;
    });

    // Act
    service.removeTask(taskToRemove);

    const tasks: ToDoTask[] = [];
    // Assert
    expect(notifiedList).toBeTruthy(tasks);
  });

  it('should handle errors and log them', () => {
    // Arrange
    spyOn(console, 'error');

    const taskToRemove: ToDoTask =  { Name: 'Task 1', Date: new Date(), Status: TaskStatus.Active };

    // Force an error by making toDoList property undefined
    service.toDoList = undefined as any;

    // Act
    service.removeTask(taskToRemove);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Error removing task:', jasmine.any(Error));
  });
});
