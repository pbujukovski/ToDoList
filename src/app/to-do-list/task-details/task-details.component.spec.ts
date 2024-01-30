import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from './task-details.component';
import { TaskManagementService } from '../../services/task-management.service';
import { of } from 'rxjs';

// describe('TaskDetailsComponent', () => {
//   let component: TaskDetailsComponent;
//   let fixture: ComponentFixture<TaskDetailsComponent>;
//   let mockTaskManagementService: jasmine.SpyObj<TaskManagementService>;
//   let mockMatDialog: jasmine.SpyObj<MatDialog>;

//   beforeEach(() => {
//     mockTaskManagementService = jasmine.createSpyObj('TaskManagementService', [
//       'addNewTask',
//       'editTask',
//       'removeTask',
//     ]);
//     mockMatDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);

//     TestBed.configureTestingModule({
//       declarations: [TaskDetailsComponent],
//       imports: [
//         FormsModule,
//         MatInputModule,
//         MatFormFieldModule,
//         MatNativeDateModule,
//         MatDatepickerModule,
//         CommonModule,
//         MatButtonModule,
//         MatDialogModule,
//       ],
//       providers: [
//         { provide: TaskManagementService, useValue: mockTaskManagementService },
//         { provide: MatDialog, useValue: mockMatDialog },
//         { provide: MatDialogRef, useValue: {} },
//         { provide: MAT_DIALOG_DATA, useValue: {} },
//       ],
//     });

//     fixture = TestBed.createComponent(TaskDetailsComponent);
//     component = fixture.componentInstance;
//   });


describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let mockTaskManagementService: jasmine.SpyObj<TaskManagementService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    mockTaskManagementService = jasmine.createSpyObj('TaskManagementService', [
      'addNewTask',
      'editTask',
      'removeTask',
    ]);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);

    TestBed.configureTestingModule({
      declarations: [TaskDetailsComponent], // Remove TaskDetailsComponent from declarations
      imports: [
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatDatepickerModule,
        CommonModule,
        MatButtonModule,
        MatDialogModule,
      ],
      providers: [
        { provide: TaskManagementService, useValue: mockTaskManagementService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call taskManagementService.addNewTask on form submission for Add', () => {
  //   component.toDoTask.additionalData = 'Add';
  //   const event = {};
  //   component.onSubmit(event);
  //   expect(mockTaskManagementService.addNewTask).toHaveBeenCalledWith(component.toDoTask.toDoTask);
  // });

  // it('should call taskManagementService.editTask on form submission for Edit', () => {
  //   component.toDoTask.additionalData = 'Edit';
  //   const event = {};
  //   component.onSubmit(event);
  //   expect(mockTaskManagementService.editTask).toHaveBeenCalledWith(component.toDoTask.toDoTask);
  // });

  // it('should call taskManagementService.removeTask on delete button click', () => {
  //   component.toDoTask.additionalData = 'Delete';
  //   component.onDeleteClicked();
  //   expect(mockTaskManagementService.removeTask).toHaveBeenCalledWith(component.toDoTask.toDoTask);
  // });

  // it('should close the dialog on cancel button click', () => {
  //   component.onCancelClicked();
  //   expect(mockMatDialog.closeAll).toHaveBeenCalled();
  // });

  // it('should set toDoTask.additionalData to "Create" if it is "Add"', () => {
  //   component.toDoTask.additionalData = 'Add';
  //   component.ngOnInit();
  //   expect(component.toDoTask.additionalData).toBe('Create');
  // });

  // it('should set toDoTask.additionalData to "Edit" if it is "Edit"', () => {
  //   component.toDoTask.additionalData = 'Edit';
  //   component.ngOnInit();
  //   expect(component.toDoTask.additionalData).toBe('Edit');
  // });

  // it('should not change toDoTask.additionalData if it is not "Add" or "Edit"', () => {
  //   component.toDoTask.additionalData = 'Delete';
  //   component.ngOnInit();
  //   expect(component.toDoTask.additionalData).toBe('Delete');
  // });
});
