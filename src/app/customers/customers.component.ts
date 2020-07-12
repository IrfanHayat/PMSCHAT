import { Component, ComponentRef, OnInit, ViewChild, Output, EventEmitter, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ApiService } from '../api.service';
import 'rxjs/add/operator/map';
import { CustomerComponent } from '../customer/customer.component';
import { CustomerEmptyComponent } from '../customer-empty/customer-empty.component';
import { ChatService } from '../chat.service';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;
  @Output() someEvent = new EventEmitter<any>();
  componentsReferences = [];
  index: number = 0;
  emptyChats = [];
  customer: any
  test: any;
  chat_Id: any;
  socket: any;
  selected_chat: any;
  Index: number = 0;
  customers;
  @Output() removeMessages = new EventEmitter<string>();

  constructor(
    private api: ApiService,
    private CFR: ComponentFactoryResolver,
    private chatService: ChatService,
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  getMessage(data) {
    this.selected_chat = data.chat_id
    this.someEvent.emit(data) // Emit data to parent componet that is chats
  }

  ngOnInit() {
    var name = localStorage.getItem('agent');
    this.api.findChat(name).subscribe(customers => {
      console.log(customers)
      customers.map(customer => {
        console.log(customer.username)
        this.customers=customer
        this.createCustomerBox(this.customers)
       
      });
      

      if (customers.length < 6) {
        for (var i = 0; i < 6 - customers.length; i++) {
          this.createEmptyCustomerBox();

        }
      }

    }, err => {
      console.log(err);
    });



    this.chatService.getRemovingCustomer().subscribe((data) => {
      //customer chat leave
      let componentRef = this.componentsReferences.filter(x => x.instance.id == data.chat_id)[0];

      if (typeof data.change_status != 'undefined' && data.change_status == true) {
        this.api.closeChat(data.chat_id)
      }

      if (typeof componentRef != 'undefined') {
        this.remove(componentRef.instance.index)
      }

    })


    this.api.agentData(name).subscribe(res => {
      var user = {
        _id: res._id,
        name: res.name,
        company_id: res.company_Id,
        status: 'joined'
      }

      this.chatService.joinRoom(res.company_Id)                                                             // Join chat room for all agents of company to listen on common events
      if (res != null && typeof res != 'undefined') {
        res.assigned_projects.forEach(projectId => {                                                        // Bind all projects events
          this.chatService.joinRoom(projectId)
          this.api.getProjectDetail(projectId).subscribe((project) => {
            this.chatService.checkOnlineAgents({ roomno: projectId, listeningroom: project.name, user: user })   // Check online agents in this room in order to fire agents online green circle on customer's chat box windows
          })

        });
      }

      //**************************************************************************************************
      // Remove the customer box if another agent took the chat
      //**************************************************************************************************//
      this.chatService.agentAssigned().subscribe((data) => {
        if (data.agent_id != res._id) {                                        //Check if chat assigned to the agent is not this agent(me) then remove the box
          let componentRef = this.componentsReferences.filter(x => x.instance.id == data.chat_id)[0];
          this.remove(componentRef.instance.index)
        }

      })

    })

    //**************************************************************************************************
    // Check if new customer sent message from any site then create a customer box on top of dashboard
    //**************************************************************************************************

    this.chatService.getCustomer().subscribe((customer) => {



      if (typeof this.componentsReferences.filter(x => x.instance.id == customer.chat_id)[0] == 'undefined') {

        let componentRe = this.componentsReferences.filter(x => x.instance.empty == true)[0]; // Gets the refernece of first empty box if any

        if (typeof componentRe !== 'undefined') {
          // If empty box is present
          let vcrIndex: number = this.VCR.indexOf(componentRe)
          console.log(vcrIndex)
          if (vcrIndex < 6) {

            // Get the index of first found empty customer box with white doted lines
            this.VCR.remove(vcrIndex);
            // Remove the empty box
            let componentFactory = this.CFR.resolveComponentFactory(CustomerComponent);   // Call factory resolver and create <app-customer> component
            let componentRef: ComponentRef<CustomerComponent> = this.VCR.createComponent(componentFactory, vcrIndex); // Create Component
            let currentComponent = componentRef.instance;                                 // Set the self values 
            currentComponent.record = customer;
            currentComponent.read = false;
            currentComponent.name = customer.user_name;
            currentComponent.id = customer.chat_id;
            currentComponent.status = customer.status;
            componentRef.instance.someEvent.subscribe((element2) =>                       // Callback function will get the id back here in element from callParent() METHOD of customer.component.ts
              this.getMessage(element2));                                                 // Call the function of this component and send the value got from child

            componentRef.instance.removeMessages.subscribe(() => this.removeChatMessages())

            currentComponent.selfRef = currentComponent;
            currentComponent.index = vcrIndex + 1;                                        // Set the index of currently creaed customer component to the index of removed empty box
            currentComponent.compInter = this;
            this.componentsReferences[vcrIndex] = componentRef;                           // Instead of pushing the reference at the end of references array overwrite the reference with the reference of the empty box
          }

        } else {
          console.log("Nothing happen")
        }

        //****************************************************************************************
        // Check if customer obj also contain agent name then this chat is transfered chat 
        //****************************************************************************************//

        if (customer.agent_name) {
          var messages = [customer.agent_name + " transfered you a chat of " + customer.user_name]
          this.ngFlashMessageService.showFlashMessage({     //Show the message on the front end
            messages: messages,
            dismissible: true,
            timeout: 3000,
            type: 'success'
          });
        }

        this.playAudio();
      }
    });

    //****************************************************************************************
    //* Logic to change the background color of the customer box to green if new message sent
    //****************************************************************************************//

    this.chatService.getChatUpdate().subscribe((chat_id) => {         //Get update on any new message of not joined chat
      if (this.selected_chat != chat_id) {                            //Check the current open chat is this if yes then dont change the background color
        let componentRef = this.componentsReferences.filter(x => x.instance.id == chat_id)[0];
        componentRef.instance.read = false                            //Change assigned to false
      }
      this.playAudio();

    })

  }

  playAudio() {
    let audio = new Audio();
    audio.src = "/assets/sounds/longexpected.mp3";
    audio.load();
    audio.play();
  }

  remove(index: number) {

    if (this.VCR.length < 1)
      return;

    let componentRef = this.componentsReferences.filter(x => x.instance.index == index)[0];
    let vcrIndex: number = this.VCR.indexOf(componentRef)
    this.VCR.remove(vcrIndex);
    this.componentsReferences = this.componentsReferences.filter(x => x.instance.index !== index);

    //Code to add the empty box
    if (this.componentsReferences.length < 6) {
      this.createEmptyCustomerBox();
    }
    this.removeChatMessages()
  }


  removeChatMessages() {
    this.removeMessages.emit()
  }

  createEmptyCustomerBox() {
    let componentFactory = this.CFR.resolveComponentFactory(CustomerEmptyComponent);
    let componentRef: ComponentRef<CustomerEmptyComponent> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
    currentComponent.index = ++this.index;
    this.componentsReferences.push(componentRef);
  }

  createCustomerBox(customer) {
    
    let componentFactory = this.CFR.resolveComponentFactory(CustomerComponent);
    let componentRef: ComponentRef<CustomerComponent> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;

    currentComponent.record = customer;
    currentComponent.read = false;
    currentComponent.name = customer.user_name;
    currentComponent.id = customer.chat_id;
    currentComponent.status = customer.status;
    componentRef.instance.someEvent.subscribe((element) =>  // Callback function will get the id back here in element from callParent() METHOD of customer.component.ts
      this.getMessage(element));                               // Call the function of this component and send the value got from child
    componentRef.instance.removeMessages.subscribe(() => this.removeChatMessages())
    currentComponent.selfRef = currentComponent;
    currentComponent.index = ++this.index;
    currentComponent.compInter = this;
    this.componentsReferences.push(componentRef);
  }

}
