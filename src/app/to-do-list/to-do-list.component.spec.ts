import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToDoListComponent } from './to-do-list.component';
import { TaskManagementService } from '../services/task-management.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { DialogAction } from '../enums/dialog-action.enum';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { Subscription, of } from 'rxjs';
import { ToDoTask } from '../models/to-do-task.model';
import { TaskStatus } from '../enums/task-status.enum';

describe('ToDoListComponent', () => {
  let component: ToDoListComponent;
  let fixture: ComponentFixture<ToDoListComponent>;
  let liveAnnouncerSpy: jasmine.SpyObj<LiveAnnouncer>; // Corrected declaration
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    liveAnnouncerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);
   // const spy = jasmine.createSpyObj('MatDialog', ['ngOnDestroy']);
   dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['ngOnDestroy']);

    await TestBed.configureTestingModule({
      declarations: [ToDoListComponent],
      imports: [
        MatDialogModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule,
        MatTableModule,
      ],
      providers: [
        TaskManagementService,
        MatDialog,
        LiveAnnouncer,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDoListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  const mockToDoTaskList: ToDoTask[] = [
    { Name: 'Task 1', Date: new Date(), Status: TaskStatus.Active },
    { Name: 'Task 2', Date: new Date(), Status: TaskStatus.Completed }
  ];

  it('should set the paginator and sort after the view has been initialized', () => {
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toBeDefined();
    expect(component.dataSource.sort).toBeDefined();
  });

  it('should open a dialog when the create button is clicked', () => {
    spyOn(component.dialog, 'open');
    component.openDialog('480px', '480px', '600ms', '600ms', DialogAction.Add);
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should open a dialog when the edit button is clicked', () => {
    spyOn(component.dialog, 'open');
    component.openDialog('480px', '480px', '600ms', '600ms', DialogAction.Edit);
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should open a dialog when the delete button is clicked', () => {
    spyOn(component.dialog, 'open');
    component.openDialog('480px', '340px', '600ms', '600m', DialogAction.Delete);
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should announce "Sorting cleared" when sortState has no direction', () => {
    const sortState: Sort = { active: 'columnName', direction: '' };
    spyOn(component.liveAnnouncer, 'announce');

    component.sortByColummn(sortState);

    expect(component.liveAnnouncer.announce).toHaveBeenCalledWith('Sorting cleared');
  });

  it('should announce "Sorting asc" when sortState has no direction', () => {
    const sortState: Sort = { active: 'columnName', direction: 'asc' };
    spyOn(component.liveAnnouncer, 'announce');

    component.sortByColummn(sortState);

    expect(component.liveAnnouncer.announce).toHaveBeenCalledWith('Sorted ascending');
  });

  it('should announce "Sorted descending" when sortState has direction "desc"', () => {
    const sortState: Sort = { active: 'columnName', direction: 'desc' };
    spyOn(component.liveAnnouncer, 'announce');

    component.sortByColummn(sortState);

    expect(component.liveAnnouncer.announce).toHaveBeenCalledWith('Sorted descending');
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

  it('should call ngOnDestroy on dialog if it is not null', () => {
    // Set dialog to a mock object
    component.dialog = dialogSpy;

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Check that ngOnDestroy was called on the dialog if it is not null
    expect(dialogSpy.ngOnDestroy).toHaveBeenCalled();
  });

  it('should filter the dataSource based on the provided input', () => {
    // Initial setup
    const initialData = [
      { Name: 'Task 1', Date: new Date(), Status: TaskStatus.Active },
      { Name: 'Task 2', Date: new Date(), Status: TaskStatus.Completed },
      { Name: 'Task 3', Date: new Date(), Status: TaskStatus.Active },
    ];
    component.dataSource.data = initialData;

    // Call the filterByCol method with a specific filter input
    const filterInput = 'Task 2';
    component.filterByCol(filterInput);

    // Expect the dataSource to be filtered
    expect(component.dataSource.filteredData).toEqual([
      { Name: 'Task 2', Date: jasmine.any(Date), Status: TaskStatus.Completed },
    ]);
  });

  it('should trim and convert the filter input to lowercase', () => {
    // Initial setup
    const initialData = [
      { Name: 'Task 1', Date: new Date(), Status:  TaskStatus.Active },
      { Name: 'Task 2', Date: new Date(), Status:  TaskStatus.Completed },
    ];
    component.dataSource.data = initialData;

    // Call the filterByCol method with a filter input that needs trimming and case conversion
    const filterInput = '  Task 2  ';
    component.filterByCol(filterInput);

    // Expect the dataSource to be filtered based on the trimmed and lowercase input
    expect(component.dataSource.filteredData).toEqual([
      { Name: 'Task 2', Date: jasmine.any(Date), Status: TaskStatus.Completed },
    ]);
  });

  it('should clear the filter when provided with an empty input', () => {
    // Initial setup
    const initialData = [
      { Name: 'Task 1', Date: new Date(), Status:  TaskStatus.Active},
      { Name: 'Task 2', Date: new Date(), Status:  TaskStatus.Completed },
    ];
    component.dataSource.data = initialData;

    // Call the filterByCol method with an empty filter input
    const filterInput = '';
    component.filterByCol(filterInput);

    // Expect the dataSource to be unfiltered (showing all data)
    expect(component.dataSource.filteredData).toEqual(initialData);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
