import { Component,OnInit,ViewContainerRef,ViewChild, Output,EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../chat.service';
import {ServicesService} from '../services.service';
import { CustomersComponent } from '../customers/customers.component';
import $ = require('jquery');
import { ApiService } from '../api.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;
  public selfRef: MessageComponent;
  @Output() editmessage=new EventEmitter<string>();
  message:any;
  sender:any;
  time;
  updatemessage:any;
  newUpdateMessage:any;
  messageClass:any;
  customerName:string;
  currentID;
  id:string;
  rerender;
  
  constructor(
    private chatService: ChatService,
    private servicesData: ServicesService,
    private cdRef:ChangeDetectorRef,
    private api: ApiService
  ) {}

  ngOnInit() {
   
    if(this.message.sender == 'Agent'){
      this.messageClass = "Ymsg"
      this.customerName = "Me"
    }else{
      this.messageClass = "Mymsg_ag"
    }
    
  }
  ngAfterViewInit(){
  let date= new Date(this.time)
  let getHours=date.getHours();
  let getMinutes=date.getMinutes();
  let seconds=date.getSeconds();
  
  
    console.log("Hi I am message block"+getHours+getMinutes+seconds)
    console.log("Hi I am message block"+this.updatemessage.message)
    $("#time_"+getHours+getMinutes+seconds).text(this.updatemessage.time); 
    $("#message_"+getHours+getMinutes+seconds).text(this.updatemessage.message); 
  }
  doRerender() {
    this.rerender = true;
    this.cdRef.detectChanges();
    this.rerender = false;
  }
  click(data){
    console.log("I am in message"+data.time)
   data.status="true"
   this.servicesData.changeMessage(data)
   
   
  
  
    
  }

  
}
