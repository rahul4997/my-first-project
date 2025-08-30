// landing.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CodeDialogComponent } from '../../components/code-dialog/code-dialog.component';

@Component({
  standalone: true,
  selector: 'app-landing',
  template: '',
})
export class LandingComponent implements OnInit {
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.dialog.open(CodeDialogComponent, {
      disableClose: true,
      width: '300px',
    });
  }
}
