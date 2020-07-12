import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-empty',
  templateUrl: './customer-empty.component.html',
  styleUrls: ['./customer-empty.component.css']
})
export class CustomerEmptyComponent implements OnInit {
  public index: number;
  public empty: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
