import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToDoTask } from '../../models/to-do-task.model';
import { TaskManagementService } from '../../services/task-management.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';


interface TaskDialogData {
  toDoTask: ToDoTask;
  additionalData: string;
}
@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    CommonModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
    providers: [provideNativeDateAdapter()],
  templateUrl: './task-details.component.html',

  encapsulation : ViewEncapsulation.None,
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnInit, OnDestroy{

 // public toDoTask : ToDoTask = {} as ToDoTask;

  public toDoTaskList : ToDoTask[] = [];

  private taskManagementService: TaskManagementService;

  private taskManagementSubscription: Subscription = new Subscription();
  private dialog!: MatDialog;
  constructor(taskManagementService: TaskManagementService,
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public toDoTask: TaskDialogData
  ) {
    this.taskManagementService = taskManagementService;

    if(toDoTask.toDoTask == undefined){
      toDoTask.toDoTask = {} as ToDoTask;
    }
  }


  ngOnDestroy(): void {
    if (this.taskManagementSubscription != null){
      this.taskManagementSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    console.log(this.toDoTask.additionalData);
  }


  onSubmit(event: any) {
    // Handle form submission logic here
    console.log('Form submitted!' + event );
    console.log(event);
    console.log(this.toDoTask);

    if (this.toDoTask.additionalData == 'Add'){

    this.taskManagementService.addNewTask(this.toDoTask.toDoTask);
    }
    else if (this.toDoTask.additionalData == 'Edit'){

    this.taskManagementService.editTask(this.toDoTask.toDoTask);
    }
  }

  onDeleteClicked() {
    console.log("HERE");
   this.taskManagementService.removeTask(this.toDoTask.toDoTask);
  }

  onCancelClicked(): void {
    this.dialog!.closeAll();
  }
}
