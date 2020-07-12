import { Component, OnInit, Input, EventEmitter, ViewContainerRef, ViewChild, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { ApiService } from '../api.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { ActivatedRoute } from '@angular/router';
import { TicketDetailComponent } from '../ticket-detail/ticket-detail.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;
  @Input() someEvent = new EventEmitter<string>();
  ticket: any;
  ticketId: any;
  ticketDetails: any;
  filterlist: any;
  skip: any;
  p: any;
  pages: any;
  componentsReferences = [];
  today = new Date();
  yesterday = new Date(Date.now() - 86400000);
  dateModel = [
    { id: 1, name: "today", date: this.today },
    { id: 2, name: "yesterday", date: this.yesterday },
    { id: 3, name: "last week", date: this.today },

  ];
  

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private ngFlashMessageService: NgFlashMessageService,
    private CFR: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    this.getPMSTicket(0);
  }


  getPMSTicket(skip) {
    this.p = skip;
    this.api.getPmsTickets(skip).subscribe((pmsData) => {
      console.log(pmsData.record)
      this.ticket = pmsData.record;
      this.filterlist = this.ticket
      this.pages = pmsData.data;
    })
  }

  getTicket(ticketId) {
    this.VCR.remove();
    this.api.getTicketDetail(ticketId).subscribe((pmsData) => {
      console.log(pmsData)
      this.ticketDetails = pmsData;
      this.createTicketDetails(pmsData);

    })
  }


  createTicketDetails(pmsData) {

    let componentFactory = this.CFR.resolveComponentFactory(TicketDetailComponent);

    let componentRef = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
    currentComponent.ticket = pmsData;

    currentComponent.selfRef = currentComponent;
    this.componentsReferences.push(componentRef);
  }

  pageChanged(event) {
    this.p = event;

    this.getPMSTicket(event);
  }
  getValue(d) {

    if (d.name === "today") {
      this.ticket = this.filterlist
      this.ticket = this.ticket.filter(data => new Date(data.created_on).getDate() === new Date(d.date).getDate())


    }
    if (d.name === "yesterday") {
      this.ticket = this.filterlist
      this.ticket = this.ticket.filter(data => new Date(data.created_on).getDate() === new Date(d.date).getDate())
    }
    if (d.name === "last week") {
      this.ticket = this.filterlist
      this.ticket = this.ticket.filter(data => new Date(data.created_on).getDate() <= new Date(d.date).getDate() + 7)

    }
  }


}
