import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ToDoTask } from '../../models/to-do-task.model';
import { TaskManagementService } from '../../services/task-management.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

interface TaskDialogData {
  toDoTask: ToDoTask;
  additionalData: string;
}
@Component({
  standalone: false,
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [provideNativeDateAdapter()],
})
export class TaskDetailsComponent implements OnDestroy {
  //Services
  private taskManagementService: TaskManagementService;

  //Subscriptions
  private taskManagementSubscription: Subscription = new Subscription();

  //Dialog
  private dialog!: MatDialog;

  constructor(
    taskManagementService: TaskManagementService,
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public toDoTask: TaskDialogData
  ) {
    this.taskManagementService = taskManagementService;

    if (toDoTask.toDoTask == undefined) {
      toDoTask.toDoTask = {} as ToDoTask;
    }
  }

  ngOnDestroy(): void {
    // Check if taskManagementSubscription is not null before unsubscribing
    if (this.taskManagementSubscription != null) {
      this.taskManagementSubscription.unsubscribe();
    }
  }

// Handles the form submission event.
onSubmit(event: any) {
  // Check the additionalData to determine the action
  if (this.toDoTask.additionalData == 'Add') {
    // If additionalData is 'Add', add a new task
    this.taskManagementService.addNewTask(this.toDoTask.toDoTask);
  } else if (this.toDoTask.additionalData == 'Edit') {
    // If additionalData is 'Edit', edit an existing task
    this.taskManagementService.editTask(this.toDoTask.toDoTask);
  }
}

//Handles the click event when the delete button is clicked.
onDeleteClicked() {
  // Remove the task using the taskManagementService
  this.taskManagementService.removeTask(this.toDoTask.toDoTask);
}

// Handles the click event when the cancel button is clicked.
onCancelClicked(): void {
  // Close all open dialogs
  this.dialog!.closeAll();
}

}
