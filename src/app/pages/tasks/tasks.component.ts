import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ColumnType, IGridEditDoneEventArgs, IgxGridComponent, IgxPaginatorComponent } from 'igniteui-angular';
import { Employee, employeesData } from './localData';
import { BoardService } from '../../services/board.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, lastValueFrom, takeUntil } from 'rxjs';
import { formatDate } from '@angular/common';
import { IgxGridRowComponent } from 'igniteui-angular/lib/grids/grid/grid-row.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  public items: Array<{ viewMode: string }> = [
    { viewMode: 'Tasks' },
    { viewMode: 'Dashboards' }
];

  boardTitle: string = '';
  isEditingTitle: boolean;
  editedBoardTitle: string = '';

  isFocused: boolean;
  
  isDashboardMode: boolean;

  dataSource: any[] = [];
  @ViewChild('grid', { static: false }) grid!: IgxGridComponent;
  private destroy$: Subject<void> = new Subject<void>();

  inAddingRowMode: boolean = false;

  priority: any[];
  statusDataSource: any[];

  statusData: any[];
  priorityData: any[];
  dueDateData: any[];

  @ViewChild('boardTitleInput', {static: false}) boardTitleInput!: Input;

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.isDashboardMode = false;

    this.isEditingTitle = false;
    this.isFocused = true;

    this.statusData = [];
    this.priorityData = [];
    this.dueDateData = [];

    this.priority = [
      { name: 'High', value: 4 },
      { name: 'Urgent', value: 3 },
      { name: 'Normal', value: 2 },
      { name: 'Low', value: 1 }
    ];

    this.statusDataSource = [
      { value: 1, name: 'Active' },
      { value: 2, name: 'Pending' },
      { value: 3, name: 'Completed' },
      { value: 4, name: 'Delayed' }
    ];
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if(this.grid?.data){
        this.updateGridData();

        const id = this.route.snapshot.params['id'];
        this.boardService.getBoardTitleById(id).subscribe((title) => {
          this.boardTitle = title;
        });
        this.calculateDashboardData();

      }
    });
  }

  private calculateDashboardData(): void{
    this.calculatePriorityData();
    this.calculateDueDateData();
    this.calculateStatusData();
  }

  private async calculatePriorityData() {
    const id = this.route.snapshot.params['id'];
    try {
      const tasks = (await this.boardService.getTasksForBoard(id).toPromise()) ?? [];
      const prioritiesCount: { [key: string]: number } = {
        High: 0,
        Urgent: 0,
        Normal: 0,
        Low: 0
      };

      tasks.forEach(task => {
        switch (task.priority) {
          case 1:
            prioritiesCount['Low']++;
            break;
          case 2:
            prioritiesCount['Normal']++;
            break;
          case 3:
            prioritiesCount['Urgent']++;
            break;
          case 4:
            prioritiesCount['High']++;
            break;
          default:
            break;
        }
      });

      this.priorityData = Object.keys(prioritiesCount).map(key => ({
        name: key,
        value: prioritiesCount[key]
      }));

      // console.log(this.priorityData)
    } catch (error) {
      console.error('Failed to fetch tasks for board', error);
    }
  }

  private async calculateStatusData() {
    const id = this.route.snapshot.params['id'];
    try {
      const tasks = (await this.boardService.getTasksForBoard(id).toPromise()) ?? [];
      const statusCount: { [key: string]: number } = {
        Active: 0,
        Pending: 0,
        Completed: 0,
        Delayed: 0
      };

      tasks.forEach(task => {
        switch (task.status) {
          case 1:
            statusCount['Active']++;
            break;
          case 2:
            statusCount['Pending']++;
            break;
          case 3:
            statusCount['Completed']++;
            break;
          case 4:
            statusCount['Delayed']++;
            break;
          default:
            break;
        }
      });

      this.statusData = Object.keys(statusCount).map(key => ({
        name: key,
        value: statusCount[key]
      }));

      // console.log(this.statusData);
    } catch (error) {
      console.error('Failed to fetch tasks for board', error);
    }
  }

  private async calculateDueDateData() {
    const id = this.route.snapshot.params['id'];
    try {
      const tasks = (await this.boardService.getTasksForBoard(id).toPromise()) ?? [];
      const dueDateCounts: { [key: string]: number } = {};

      tasks.forEach(task => {
        const dueDate = task.dueDate.split('T')[0];
        if (dueDateCounts[dueDate]) {
          dueDateCounts[dueDate]++;
        } else {
          dueDateCounts[dueDate] = 1;
        }
      });

      this.dueDateData = Object.keys(dueDateCounts).map(date => ({
        date,
        count: dueDateCounts[date]
      }));

      console.log(this.dueDateData);
    } catch (error) {
      console.error('Failed to fetch tasks for board', error);
    }
  }

  ngOnInit(): void {
    this.fetchTaskData()
    const id = this.route.snapshot.params['id'];
    this.boardService.getBoardTitleById(id).subscribe((title) => {
      this.boardTitle = title;
    });
    this.calculateDashboardData();
  }

  // public onColumnInit(column: ColumnType): void {
  //   if (column.field === 'RegistererDate') {
  //     column.formatter = (date => date.toLocaleDateString());
  //   }
  // }

  async fetchTaskData() {
    const id = this.route.snapshot.params['id'];
    this.dataSource = await lastValueFrom(this.boardService.getTasksForBoard(id))
  }

  public updateGridData(): void {
    this.fetchTaskData();
    this.grid.data = this.dataSource
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public startEditingTitle(): void {
    this.isEditingTitle = true;
    this.editedBoardTitle = this.boardTitle;
    setTimeout(() => {
      if (this.boardTitleInput) {
        this.boardTitleInput
      }
    }, 0);
  }

  async cellEditDone(event: any): Promise<void> {
    if(!this.inAddingRowMode){
      if(event.newValue instanceof Date){
        // set event.rowdata to new value of date in the format of "2023-05-01"
        event.rowData.dueDate = formatDate(event.newValue, 'yyyy-MM-dd', 'en-US');
      }
      await this.boardService.updateData(event.rowData.id, event.rowData).subscribe(() => {
        this.updateGridData();
      })
    }
  }

  async removeRow(event: any) {
    if(event?.data){
      await this.boardService.removeData(event.data.id).subscribe(() => {
        this.updateGridData();
      })
    }
  }

  async startEditRow(event: any) {
    const firstEditableRow = event.cells.filter((cell: { editable: any; }) => cell.editable)[0]
    event.grid.gridAPI.crudService.enterEditMode(firstEditableRow)
  }

  async addRow(event: IgxGridRowComponent) {
    this.inAddingRowMode = true;
    // const firstEditableRow = event.cells.filter((cell: { editable: any; }) => cell.editable)[0]
    // event.grid.gridAPI.crudService.enterEditMode(firstEditableRow)
    event.grid.gridAPI.crudService.enterAddRowMode()
  }

  async test(event: IGridEditDoneEventArgs) {

    if(this.inAddingRowMode){
      this.inAddingRowMode = false;
      if(event.newValue instanceof Date){
        event.rowData.dueDate = formatDate(event.newValue, 'yyyy-MM-dd', 'en-US');
      }
      const id = this.route.snapshot.params['id'];
      await this.boardService.insertData(id, event.rowData).subscribe(() => {
        this.updateGridData();
      })
    }else{
      if(event.newValue instanceof Date){
        // set event.rowdata to new value of date in the format of "2023-05-01"
        event.rowData.dueDate = formatDate(event.newValue, 'yyyy-MM-dd', 'en-US');
      }
      await this.boardService.updateData(event.rowData.id, event.rowData).subscribe(() => {
        this.updateGridData();
      })
    }
  }

  public onBlurIsAddingBoardSet(): void {
    // this.boardTitleInput.transform?.arguments = '';
    this.isEditingTitle = false;
  }

  public async saveEditedTitle(): Promise<void>{
    const input = this.boardTitleInput as ElementRef
    // console.log(input.nativeElement.value)
    const id = this.route.snapshot.params['id'];
    await this.boardService.updateBoardTitle(id, input.nativeElement.value).subscribe()

    this.boardService.getBoardTitleById(id).subscribe((title) => {
      this.boardTitle = title;
    });

    this.isEditingTitle = false;
  }

  public async deleteBoard(): Promise<void>{
    const id = this.route.snapshot.params['id'];
    await this.boardService.deleteBoard(id).subscribe()
    this.router.navigate([''])
  }

  public onSelectBoxChanged(event: any): void{
    switch(event.newSelection.index){
      case 0: {
        this.isDashboardMode = false;
        break;
      }
      case 1: {
        this.isDashboardMode = true;
        break;
      }
      default: {
        break;
      }
    }
  }

}
