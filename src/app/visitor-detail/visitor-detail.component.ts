import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visitor-detail',
  templateUrl: './visitor-detail.component.html',
  styleUrls: ['./visitor-detail.component.css']
})
export class VisitorDetailComponent implements OnInit {
  public selfRef: VisitorDetailComponent;
  record: any;
  constructor() { }

  ngOnInit() {
  }

}
