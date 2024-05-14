import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {

  @ViewChild('boardInput', {static: false}) boardInput!: Input;

  private _items: any[] = [
    { name: 'home', text: 'Home', url: '/home' }
  ];
  
  get items() {
    return this._items;
  }

  isAddingBoard: boolean = false;

  constructor(private elementRef: ElementRef, private boardService: BoardService, private router: Router) {
  }

  ngOnInit(): void {
    this.boardService.boards$.subscribe(boards => {
      this._items = [
      ...this._items.slice(0, 1),
      ...boards.map(board => ({
        text: board.name,
        url: `/boards/${board.id}`,
      }))];
    });
  }

  public selected = 'Avatar';

  public navigate(item: any) {
    if (item.url) {
      this.router.navigate([item.url]);
    }
  }

  public startAddingBoard(): void {
    this.isAddingBoard = true;
    console.log("startAddingBoard")
  }

  public onBlurIsAddingBoardSet(): void {
    this.isAddingBoard = false;
  }

  public async saveNewBoard(): Promise<void> {
    const input = this.boardInput as ElementRef
    await this.boardService.createBoard({name: input.nativeElement.value}).subscribe()
    this.isAddingBoard = false;
  }

}
