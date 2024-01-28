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
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { TaskStatus } from '../enums/task-status.enum';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { MatMenuModule } from '@angular/material/menu';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { DialogActions } from '../enums/dialog-actions.enum';
@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ToDoListComponent implements OnInit, AfterViewInit, OnDestroy {
  //Enums
  TaskStatus = TaskStatus;
  DialogActions = DialogActions;

  // Injected services
  private taskManagementService: TaskManagementService;

  //Dialog
  private dialog: MatDialog;

  //Decorators
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) public sort!: MatSort;
  @ViewChild('picker') public picker!: MatDatepicker<Date | null> | undefined;

  //Subscriptions
  private taskManagementSubscription: Subscription = new Subscription();

  //Form Controls
  public statusFilter = new FormControl('');

  //Data
  public dataSource = new MatTableDataSource<ToDoTask>([]);

  //Data list settings
  public displayedColumns: string[] = ['Status', 'Name', 'Date', 'Actions'];
  private liveAnnouncer: LiveAnnouncer; //Using LiveAnnouncer to sort columns

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
          // Log the updated data to the console
          console.log(this.dataSource.data);
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
    console.log(event);
    event.stopPropagation();
  }

  onStatusChange(event: MatSelectChange): void {
    // Check if "Completed" is selected
    if (event.value === 'Completed') {
      // Clear the state or perform any other action
      this.statusFilter.reset(); // Reset the form control
    }
  }
}
