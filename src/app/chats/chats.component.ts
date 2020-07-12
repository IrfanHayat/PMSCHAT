import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef, ViewChild, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { ApiService } from '../api.service';
import 'rxjs/add/operator/map';
import { MessagesComponent } from '../messages/messages.component'
import { ChatService } from '../chat.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from '../services.service';
export interface ILocData {
  loc: any;
  latSearch: any;
  lngSearch: any;
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})


export class ChatsComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;
  @Input() someEvent = new EventEmitter<string>();
  customer: any
  username: any;
  status: any;
  agents: any[] = []
  agent: any // Set the agent to get, set the value in front end
  public selfRef: ChatsComponent;
  componentRef: ComponentRef<MessagesComponent>;
  time: any;
  showAssignedProjects: boolean = false;
  fields: number[];
  ipAddress: any;
  lat: any;
  lng: any;
  latSearch: number;
  lngSearch: number;
  test: any;

  latTest: any = 14.55027;
  lngTest: any = 121.03269;

  invalidIP: true;

  notSupported: any;
  value
  constructor(
    private CFR: ComponentFactoryResolver,
    private api: ApiService,
    private chatService: ChatService,
    private ngFlashMessageService: NgFlashMessageService,
    private router: Router,
    private http: HttpClient,
    private servicesData: ServicesService
  ) { }

  ngOnInit() {
    this.servicesData.boolean.subscribe(value=>{
      this.value=value
    })
    this.createEmptyChatArea()
    this.updateTime();
    this.chatService.joinRoom(localStorage.getItem("agentid"))

    this.api.getAllAgents().subscribe(data => {
      this.agents = data
    })
    this.chatService.onlineAgents().subscribe((data) => {

      if (data.user.status == 'joined') {
        if (data.user._id != localStorage.getItem('agentid') && this.agents.length < 1) {
          this.agents.push(data.user)
        }
        var founduser = this.agents.find(x => x._id == data.user._id)
        if (data.user._id != localStorage.getItem('agentid') && founduser === undefined) {
          this.agents.push(data.user)
        }
      } else {
        this.agents = this.agents.filter(x => x._id != data.user._id)
      }

    })
    var name = localStorage.getItem('agent');
    this.username = name
  }

  getMessage(data: any) {

    if (this.componentRef.instance.ClientId != null) {
      this.chatService.leaveRoom(this.componentRef.instance.ClientId)
    }

    this.api.get_customer_data(data.chat_id).subscribe(res => {
      this.customer = res;
      console.log(this.customer.user_name)
      this.VCR.remove();
      let componentFactory = this.CFR.resolveComponentFactory(MessagesComponent);
      this.componentRef = this.VCR.createComponent(componentFactory);
      let currentComponent = this.componentRef.instance;
      currentComponent.ClientId = data.chat_id;
      currentComponent.customerName = this.customer.user_name

      currentComponent.getMessage(data); // Send the full data document in order to assign chat to specific agent
      currentComponent.selfRef = currentComponent;

    })



  }
  SetIpAddress() {
    this.latSearch = null;
    this.lngSearch = null;

    this.http.get<ILocData>('https://ipinfo.io/58.65.164.72/json').subscribe(data => {
      console.log(data);
      this.fields = data.loc.split(',');
      console.log(data.loc);
      data.latSearch = this.fields[0];
      data.lngSearch = this.fields[1];
      this.latSearch = parseFloat(data.latSearch);
      this.lngSearch = parseFloat(data.lngSearch);

      // this.latSearch = this.latTest;
      // this.lngSearch = this.lngTest;

      //console.log("lng"+data.lngSearch,"lat"+data.latSearch);
    });
  }

  removeMessages() {
    this.customer = null
    this.VCR.remove();
    this.createEmptyChatArea()
  }

  createEmptyChatArea() {

    let componentFactory = this.CFR.resolveComponentFactory(MessagesComponent);
    this.componentRef = this.VCR.createComponent(componentFactory);
    let currentComponent = this.componentRef.instance;
    currentComponent.disableTextArea = true;
    currentComponent.selfRef = currentComponent;
  }

  updateTime() {
    setTimeout(() => {
      this.time = Date.now();
      this.updateTime();
    }, 1000);
  };

  transferChat() {
    if (typeof this.agent != 'undefined' && this.agent != null && this.agent != '') {

      var customer = {
        chat_id: this.componentRef.instance.ClientId,
        agent_id: this.agent,
        user_name: this.customer.user_name,
        status: this.customer.status,
        project_Id: this.customer.project_Id,
        agent_name: localStorage.getItem("agent")
      }

      this.api.transferChat(customer).subscribe(res => {

        var data = {
          project_id: this.customer.project_Id, // Sending the agent id instead of the project id so that the only current agent listens to this event and remove the customer from customers
          chat_id: this.componentRef.instance.ClientId,
          change_status: false
        }
        this.chatService.leaveRoom(customer.chat_id)
        this.chatService.removeCustomer(data)
        this.chatService.transferChat(customer);
      })

    } else {
      var messages = ["Please select any agent to transfer the chat"]
      this.ngFlashMessageService.showFlashMessage({     //Show the message on the front end
        messages: messages,
        dismissible: true,
        timeout: 4000,
        type: 'success'
      });
    }
  }

  getAssignedProjects() {
    this.showAssignedProjects = true;
  }


  showCustomerDetails() {

    if (this.customer) {
      this.router.navigate(['/vizzlive/history'], {
        queryParams: {
          email: this.customer.customer_email
        }
      });
    } else {
      var messages = ["Please select any agent to see details"]
      this.ngFlashMessageService.showFlashMessage({     //Show the message on the front end
        messages: messages,
        dismissible: true,
        timeout: 4000,
        type: 'success'
      });
    }
  }

}