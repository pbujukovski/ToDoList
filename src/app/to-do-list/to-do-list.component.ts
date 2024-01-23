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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDetailsComponent } from './task-details/task-details.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { TaskStatus } from '../enums/task-status.enum';
@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatGridListModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ToDoListComponent implements OnInit, AfterViewInit, OnDestroy {

  public toDoTaskList: ToDoTask[] = [];

  TaskStatus = TaskStatus;

  private taskManagementService: TaskManagementService;

  private taskManagementSubscription: Subscription = new Subscription();

  private dialog: MatDialog;
  private _liveAnnouncer: LiveAnnouncer;

  dataSource = new MatTableDataSource<ToDoTask>(this.toDoTaskList);

  //Decorators
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = ['Status', 'Name', 'Date', 'Actions'];

  constructor(
    taskManagementService: TaskManagementService,
    dialog: MatDialog,
    _liveAnnouncer: LiveAnnouncer
  ) {
    this.taskManagementService = taskManagementService;
    this.dialog = dialog;
    this._liveAnnouncer = _liveAnnouncer;
  }

  ngOnDestroy(): void {
    if (this.taskManagementSubscription != null) {
      this.taskManagementSubscription.unsubscribe();
    }

    this.dialog.ngOnDestroy();
  }

  ngOnInit(): void {
    this.taskManagementSubscription =
      this.taskManagementService.toDoList$.subscribe(
        (toDoTaskList: ToDoTask[]) => {
          this.dataSource.data = toDoTaskList;
          console.log(this.dataSource.data);
        }
      );

    if (this.dataSource.data.length == 0) {
      this.taskManagementService.populateToDoTaskList();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(
    dialogWidth: string,
    dialogHeight: string,
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    additionalData: string,
    toDoTask?: ToDoTask
  ): void {
    this.dialog.open(TaskDetailsComponent, {
      width: dialogWidth,
      height: dialogHeight,
      enterAnimationDuration,
      exitAnimationDuration,
      // typeAction,
      data: { toDoTask, additionalData },
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
