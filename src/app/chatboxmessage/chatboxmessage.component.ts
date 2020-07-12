import { Component, OnInit,DoCheck, AfterViewInit } from '@angular/core';
import { ChatService } from '../chat.service';

import $ = require('jquery');
interface Message {
  sender: string;
  message: string;
  id:number
}


@Component({
  selector: 'app-chatboxmessage',
  templateUrl: './chatboxmessage.component.html',
  styleUrls: ['./chatboxmessage.component.css']
})
export class ChatboxmessageComponent implements OnInit {
  message: any;
  messageClass: any;
  public selfRef: ChatboxmessageComponent;
  messages: string[] = [];
  user: any;
  Id;
  messageColor: string;
  updatemessage: any
  currentId;
  time
  constructor(
    private chatService: ChatService,
  ) { }

  ngOnInit() {
   
   
    if (this.message.sender == 'Agent') {
      
      this.messageClass = "Mymsg"
       this.messageColor = ''
     

       
    } else {
      this.messageClass = "Ymsg"
    
    }
   
     
  }
  ngAfterViewInit(){
    let date= new Date(this.time)
  let getHours=date.getHours();
  let getMinutes=date.getMinutes();
  let seconds=date.getSeconds();
    $("#time_"+getHours+getMinutes+seconds).text(this.updatemessage.time); 
    $("#message_"+getHours+getMinutes+seconds).text(this.updatemessage.message); 
  }
  
 
   

  
 
}
