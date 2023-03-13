import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.css']
})
export class DeleteUserDialogComponent implements OnInit {
  onDeleteUser = new EventEmitter();
  cancelUserDeleteEvent = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  deleteUser($event: MouseEvent) {
    this.onDeleteUser.emit();
  }

  cancelUserDelete($event: MouseEvent) {
    this.cancelUserDeleteEvent.emit();
  }
}
