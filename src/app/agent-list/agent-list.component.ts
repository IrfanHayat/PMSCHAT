import { Component, OnInit, Input, EventEmitter, ViewContainerRef, ViewChild, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { ApiService } from '../api.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { ActivatedRoute } from '@angular/router';
import { AgentDetailComponent } from '../agent-detail/agent-detail.component';
@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})

export class AgentListComponent implements OnInit {
  today = new Date();
  yesterday = new Date(Date.now() - 86400000);
  filterlist;
  agents;
  componentsReferences = [];
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;
  dateModel = [
    { id: 1, name: "today", date: this.today },
    { id: 2, name: "yesterday", date: this.yesterday },
    { id: 3, name: "last week", date: this.today },

  ];
  agent: any;
  agent_name: string;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private ngFlashMessageService: NgFlashMessageService,
    private CFR: ComponentFactoryResolver, ) { }

  ngOnInit() {
    this.api.getAgentData().subscribe(data => {
      this.agent = data
      this.filterlist = this.agent


    })
  }
  getValue(d) {

    if (d.name === "today") {
      this.agent = this.filterlist
      this.agent = this.agent.filter(data => new Date(data.date).getDate() === new Date(d.date).getDate())


    }
    if (d.name === "yesterday") {
      this.agent = this.filterlist
      this.agent = this.agent.filter(data => new Date(data.date).getDate() === new Date(d.date).getDate())

    }
    if (d.name === "last week") {
      this.agent = this.filterlist
      this.agent = this.agent.filter(data => new Date(data.date).getDate() <= new Date(d.date).getDate() + 7)

    }
  }
  getAgentDetail(agentId: any) {
    this.VCR.remove();
    this.api.getAgentData_ID(agentId).subscribe((agentData) => {
      this.createAgentDetails(agentData);

    })
  }


  createAgentDetails(pmsData) {

    pmsData.filter(data => this.agents = data)
    let componentFactory = this.CFR.resolveComponentFactory(AgentDetailComponent);
    let componentRef = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;

    currentComponent.detail = this.agents;
    currentComponent.selfRef = currentComponent;
    this.componentsReferences.push(componentRef);
  }

}
