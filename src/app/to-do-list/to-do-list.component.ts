import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ToDoTask } from '../models/to-do-task.model';
import { TaskManagementService } from '../services/task-management.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { MatSort, Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { TaskStatus } from '../enums/task-status.enum';
import {
  MatDatepicker
} from '@angular/material/datepicker';
import { DialogActions } from '../enums/dialog-actions.enum';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  standalone: false,
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [provideNativeDateAdapter()]
})
export class ToDoListComponent implements OnInit, AfterViewInit, OnDestroy {
  //Enums
  TaskStatus = TaskStatus;
  DialogActions = DialogActions;

  // Injected services
  public taskManagementService: TaskManagementService;

  //Dialog
  public dialog: MatDialog;

  //Decorators
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) public sort!: MatSort;
  @ViewChild('picker') public picker!: MatDatepicker<Date | null> | undefined;

  //Subscriptions
  public taskManagementSubscription: Subscription = new Subscription();

  //Form Controls
  public statusFilter = new FormControl('');

  //Data
  public dataSource = new MatTableDataSource<ToDoTask>([]);

  //Data list settings
  public displayedColumns: string[] = ['Status', 'Name', 'Date', 'Actions'];
  public liveAnnouncer: LiveAnnouncer; //Using LiveAnnouncer to sort columns

  constructor(
    taskManagementService: TaskManagementService,
    dialog: MatDialog,
    liveAnnouncer: LiveAnnouncer
  ) {
    this.taskManagementService = taskManagementService;
    this.dialog = dialog;
    this.liveAnnouncer = liveAnnouncer;
  }

  ngOnInit(): void {
    // Subscribe to the toDoList$ observable from taskManagementService
    this.taskManagementSubscription =
      this.taskManagementService.toDoList$.subscribe(
        (toDoTaskList: ToDoTask[]) => {
          // Update dataSource with the received toDoTaskList
          this.dataSource.data = toDoTaskList;
        }
      );

    // Check if the dataSource is empty
    if (this.dataSource.data.length === 0) {
      // If empty, populate the to-do task list using taskManagementService
      this.taskManagementService.populateToDoTaskList();
    }
  }

  ngAfterViewInit() {
    // Set the paginator of the dataSource to the provided paginator after the view has been initialized
    this.dataSource.paginator = this.paginator;

    // Set the sort of the dataSource to the provided sort after the view has been initialized
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    // Check if taskManagementSubscription is not null before unsubscribing
    if (this.taskManagementSubscription != null) {
      this.taskManagementSubscription.unsubscribe();
    }

    // Check if dialog is not null before calling its ngOnDestroy method
    if (this.dialog != null) {
      this.dialog.ngOnDestroy();
    }
  }

  // Function to open a dialog
  openDialog(
    dialogWidth: string,
    dialogHeight: string,
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    additionalData: DialogActions,
    toDoTask?: ToDoTask
  ): void {
    // Open a dialog using the MatDialog service
    this.dialog.open(TaskDetailsComponent, {
      width: dialogWidth,
      height: dialogHeight,
      enterAnimationDuration,
      exitAnimationDuration,
      data: { toDoTask, additionalData },
    });
  }

  //Sorting list by column
  sortByColummn(sortState: Sort) {
    // Announce sorting information using LiveAnnouncer
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  filterBySearchBar(event: Event) {
    //Set the datepicker input in the filter to null
    this.picker?.select(null);
    //Get the value from the event
    const filterValue = (event.target as HTMLInputElement).value;
    //Call the filterByCol() method
    this.filterByCol(filterValue);
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Method to filter tasks by selected date
  filterByDates(selectedDate: any) {
    //Convert to string and call the filterByCol() method
    this.filterByCol(selectedDate.value?.toString());
  }

  //Method to filter tasks by column
  filterByCol(filterInput: string) {
    //Filter the data source with tasks
    this.dataSource.filter = filterInput?.trim().toLowerCase();
  }

  onButtonClick(event: Event): void {
    // Prevent the click event from reaching the mat-sort-header
    event.stopPropagation();
  }

  onStatusChanged(toDoTask: ToDoTask) {
    // Check the current status of the ToDoTask and change the value
    if (toDoTask.Status == TaskStatus.Active) {
      toDoTask.Status = TaskStatus.Completed;
    } else if (toDoTask.Status == TaskStatus.Completed) {
      toDoTask.Status = TaskStatus.Active;
    }

    // Call the taskManagementService to persist the updated ToDoTask
    this.taskManagementService.editTask(toDoTask);
  }
}
