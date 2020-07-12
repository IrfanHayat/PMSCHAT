import { Component, OnInit, Input, EventEmitter, ViewContainerRef, ViewChild, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { ApiService } from '../api.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { ActivatedRoute } from '@angular/router';
import { VisitorDetailComponent } from '../visitor-detail/visitor-detail.component';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;
  @Input() someEvent = new EventEmitter<string>();
  visitors: any;
  visitorDetail: any;
  p: any;
  filiter;
  username: any;
  Country: string;
  pages: any;
  componentsReferences = [];
  dateModel = [
    { id: 1, name: "First-time visitor" },
    { id: 2, name: "Returning visitor" },

  ];
  newarr = [];
  items = [{ name: "pakistan" }, { name: "africa" }, { name: "richard" }];
  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private ngFlashMessageService: NgFlashMessageService,
    private CFR: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    this.getVisitor(0);
  }

  getVisitorDetail(visitorId: any) {
    this.VCR.remove();
    this.api.getVisitorDetail(visitorId).subscribe((pmsData) => {
      this.visitorDetail = pmsData;
      console.log(this.visitorDetail)
      this.createVisitorDetails(pmsData);

    })
  }

  getVisitor(skip) {
    this.p = skip;
    this.api.getVisitors(skip).subscribe((pmsData) => {
      this.visitors = pmsData.record;
      this.filiter = this.visitors
      console.log(this.visitors)

      this.pages = pmsData.data;

    })
  }
  getValue(d) {

    if (d.name === "First-time visitor") {
      this.visitors = this.filiter
      const filteredArr = this.visitors.reduce((acc, current) => {
        const x = acc.find(item => item.customer_email === current.customer_email);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      this.visitors = filteredArr

    }
    if (d.name === "Returning visitor") {
      this.visitors = this.filiter
      this.visitors = this.visitors.filter(data => this.visitors.filter(email => email.customer_email === data.customer_email).length > 1)
    }





  }

  createVisitorDetails(pmsData) {
    console.log("I am in vistior" + pmsData)
    let componentFactory = this.CFR.resolveComponentFactory(VisitorDetailComponent);
    let componentRef = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
    currentComponent.record = pmsData;
    currentComponent.selfRef = currentComponent;
    this.componentsReferences.push(componentRef);
  }

  assignCopy() {
    this.visitors = this.visitors;
  }

  // filterCountry(countryName){
  //    if(!countryName){
  //       this.assignCopy()
  //    }
  //    console.log(countryName)
  //    this.visitors=this.visitors.filter(data=>data.location.country===countryName)
  // }

  pageChanged(event) {
    this.p = event;

    this.getVisitor(event);
  }

}
