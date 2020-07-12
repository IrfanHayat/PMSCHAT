import { Component, OnInit, Input, ViewContainerRef, ViewChild, ElementRef, Output, EventEmitter, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { ApiService } from '../api.service';
import 'rxjs/add/operator/map';
import { ChatService } from '../chat.service';
import { trigger, state, style, animate, transition } from '@angular/animations'
import { ServicesService } from '../services.service';

interface Message {
  sender: string;
  message: string;
  time: Date
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),
      state('open', style({ opacity: 1 })),
      state('close', style({ opacity: 0 })),

      transition('close => open', [
        style({ opacity: 0 }),
        animate(600)
      ]),

      transition('open => close', animate(600, style({ opacity: 0 }))),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({ opacity: 0 })))
    ])
  ]

})
export class MessagesComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  @Input() someEvent = new EventEmitter<string>();
  public selfRef: MessagesComponent;
  componentsReferences = [];
  messages: any;
  messageText: any;
  ClientId: any;
 id;
  message_Id;
  disableTextArea: boolean;
  customerTyping: boolean;
  animate: boolean = false;
  animationState: string = 'open';
  customerName: string;
  history: boolean = false
  child;
  updateMessage: any;
  boolean: boolean = false;
  update_message
  Id:number=0;
  count:number=0;
  constructor(
    private api: ApiService,
    private CFR: ComponentFactoryResolver,
    private chatService: ChatService,
    private servicesData: ServicesService

  ) {
    this.servicesData.currentMessage.subscribe((data) => {
    this.updateMessage = data;
      this.boolean = this.updateMessage.status,
        this.messageText = this.updateMessage.message;
      console.log("I am in Messagses"+this.updateMessage.time)
    })
  }

  ngOnInit() {
  
    if (this.ClientId != null && typeof this.ClientId != 'undefined' && !this.history) {
      this.chatService.joinRoom(this.ClientId)
    }

    this.chatService.getMessages().subscribe((message) => {
      this.customerTyping = false;
      console.log(message)
      this.createMessage(message)


      if (message.sender != 'Agent') {
        this.playAudio()
      }
    });

    this.chatService.recievedTyping().subscribe((data) => {

      if (data.user == 'customer' && this.ClientId == data.roomno) {

        this.customerTyping = true;
        if (!this.animate) {
          this.animate = true; // break condition for the fadeinout animation
          this.fadeInOut()
        }
      }

    })
   

  }

  playAudio() {
    let audio = new Audio();
    audio.src = "/assets/sounds/longexpected.mp3";
    audio.load();
    audio.play();
  }

  getMessage(data: any) {

    this.VCR.remove();

    if (!data.assigned) {
      this.api.assignAgent(data)
      this.chatService.assignAgent(data)
    }
    this.disableTextArea = false;
    this.api.get_message(data.chat_id).subscribe(res => {
      
      res.messages.forEach(message => {
       
       

        this.id=message._id
        this.createMessage(message)
        this.servicesData.getRatingMessage(message,data.chat_id)  
      });

    }, err => {
      console.log(err);
    });

  }


  sendMessage(text: string) {
    console.log("I am save here"+text)
    if (text != '' && typeof text != 'undefined') {


      const message: Message = {
        sender: "Agent",
        message: text,
      
        time: new Date(),
        
      }
      console.log("Send Message"+message)
      this.messageText = ''
      this.chatService.setNotification(message.message)
      this.chatService.sendMessage(message, this.ClientId)
      this.api.saveMessage(message, this.ClientId)
    }
  }


  editMessage(text: string) {
   
    let messages = [];
    if (text != '' && typeof text != 'undefined') {

      const message: Message = {
        sender: "Agent",
        message: text,
        time: new Date(),
        
      }
      this.messageText = ' '
      let arr=[];
      
      this.chatService.setNotification(message.message)
      this.chatService.updateMessage(message,this.ClientId,this.updateMessage.time)
      this.api.editMessage(message, this.ClientId, this.updateMessage.time)
      this.updateTheMessage(message,this.ClientId,this.updateMessage.time)

      
     
      
    }
    this.boolean = false;
  }


  createMessage(message) {
    console.log(message)
    let componentFactory = this.CFR.resolveComponentFactory(MessageComponent);
    let componentRef: ComponentRef<MessageComponent> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
    currentComponent.message = message;
    currentComponent.customerName = this.customerName
    currentComponent.selfRef = currentComponent;
    this.componentsReferences.push(componentRef);


  }
  updateTheMessage(message, id,time) {
   console.log("hi update me"+time)
    let componentFactory = this.CFR.resolveComponentFactory(MessageComponent);
    let componentRef: ComponentRef<MessageComponent> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
  
    currentComponent.updatemessage = message;
    currentComponent.time=time;
    currentComponent.id = id
    currentComponent.selfRef = currentComponent;
    this.componentsReferences.push(componentRef);


  }

  close(chat_Id) {
    this.api.closeChat(chat_Id);
  }

  fadeInOut = () => {

    if (this.animate) {

      if (this.animationState == 'close') {
        this.animationState = 'open'
      } else {
        this.animationState = 'close'
      }

      setTimeout(() => {
        this.fadeInOut()
      }, 800);

    }

  }


  typing() {
    this.chatService.typing({ roomno: this.ClientId, user: 'agent' })
  }

  getChildValue(data) {
    if (data) {
      this.child = data;
      console.log("I am in Parent", this.child)
    }

  }


}



