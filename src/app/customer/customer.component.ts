import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { ApiService } from '../api.service';
import { ChatService } from '../chat.service';

export interface myinterface {
  remove(index: number);
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit {
  @ViewChild('viewContainerRef1', { read: ViewContainerRef }) VCR: ViewContainerRef;
  public index: number;
  public selfRef: CustomerComponent;


  //interface for Parent-Child interaction
  public compInter: myinterface;

  showMap: boolean = true  // Used in toggle() function to Chage the background of box when a cross is clicked
  @Output() someEvent = new EventEmitter<any>();
  @Output() removeMessages = new EventEmitter<string>();
  @Input('name') name: String;
  @Input('status') status: String;
  @Input('id') id: String;
  @Input('record') record: any;
  read: boolean = false;

  constructor(
    private api: ApiService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    if (this.record.status != 'taken') {
      this.read = false;
    } else {
      this.read = true;
    }
  }

  callParent(id) {

    var name = localStorage.getItem('agent');
    this.api.agentData(name).subscribe(res => {
      var data = {
        chat_id: id,
        assigned: this.read,
        agent_id: res._id,
        project_id: this.record.project_Id
      }  // Set the data and send to customers component

      this.someEvent.emit(data); // Emit data to parent componet that is customers
      this.read = true;          // Set the agent assigned to true temporarily

    }, err => {
      console.log(err);
    });
  }


  close() {
    this.api.closeChat(this.id)
    this.compInter.remove(this.index)
    this.chatService.leftChat(this.id)
    this.chatService.leaveRoom(this.id)
    this.chatService.removeCustomer({ chat_id: this.id }) // To close the chat
    this.removeMessages.emit()


  }

  toggle() {
    if (this.showMap == true) {
      this.showMap = false
    } else {
      this.showMap = true
    }

  }


}
