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
import { Subscription, of } from 'rxjs';
import { DialogAction } from '../../enums/dialog-action.enum';


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

  it('should call taskManagementService.addNewTask on form submission for Add', () => {
    component.toDoTask.additionalData =  DialogAction.Add;
    const event = {};
    component.onSubmit(event);
    expect(mockTaskManagementService.addNewTask).toHaveBeenCalledWith(component.toDoTask.toDoTask);
  });

  it('should call taskManagementService.editTask on form submission for Edit', () => {
    component.toDoTask.additionalData =  DialogAction.Edit;
    const event = {};
    component.onSubmit(event);
    expect(mockTaskManagementService.editTask).toHaveBeenCalledWith(component.toDoTask.toDoTask);
  });

  it('should call taskManagementService.removeTask on delete button click', () => {
    component.toDoTask.additionalData =  DialogAction.Delete;
    component.onDeleteClicked();
    expect(mockTaskManagementService.removeTask).toHaveBeenCalledWith(component.toDoTask.toDoTask);
  });

  it('should unsubscribe from taskManagementSubscription on ngOnDestroy', () => {
    // Set up a mock subscription
    const subscriptionSpy = jasmine.createSpyObj<Subscription>('Subscription', ['unsubscribe']);
    component.taskManagementSubscription = subscriptionSpy;

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Check that unsubscribe was called on the subscription
    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });

});
