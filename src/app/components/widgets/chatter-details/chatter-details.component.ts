import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-chatter-details',
  templateUrl: './chatter-details.component.html',
  styleUrls: ['./chatter-details.component.scss']
})
export class ChatterDetailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChatterDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
