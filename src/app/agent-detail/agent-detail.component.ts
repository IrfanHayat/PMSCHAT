import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent implements OnInit {
  public selfRef: AgentDetailComponent;
  constructor() { }
  detail: any;
  agent;
  ngOnInit() {
    console.log(this.detail)
  }

}
