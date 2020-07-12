import { Component, OnInit, AfterViewChecked, ComponentRef, ElementRef, ComponentFactoryResolver, ViewChild, ViewContainerRef, Inject, Injectable, ɵConsole } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { ChatboxmessageComponent } from '../chatboxmessage/chatboxmessage.component';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/map';
import { ChatService } from '../chat.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import * as EmailValidator from 'email-validator';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/Rx';
import { trigger, state, style, animate, transition } from '@angular/animations'
import { Router } from '@angular/router'; 

interface Message {
  sender: string;
  message: string;
  time: Date;
  rating: string,
  comment:string

}


@Component({
  selector: 'app-proj-page',
  templateUrl: './proj-page.component.html',
  styleUrls: ['./proj-page.component.css'],
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
export class ProjPageComponent implements OnInit {
  @ViewChild('messagesContainer', { read: ViewContainerRef }) VCR: ViewContainerRef;
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

  messagesReferences = [];
  messageText: string = null
  firstTimeUser: boolean;
  chats: any;
  data: any;
  project_Id: any;
  project_name: any;
  projectTitle: any;
  name: string;
  email: string;
  message: string;
  socket: any;
  vizz_id: any;
  primaryColor: string;
  secondaryColor: string;
  agentStatus: string;
  topic: string;
  headMessage: string;
  displayOptions: boolean = false;
  displayEmail: boolean = false;
  displayLeave: boolean = false;
  displayRating: boolean = false;
  outSide: boolean = false;
  transcriptEmail: string;
  fileUrl;
  typing: boolean
  chatTaken: boolean = true;
  animationState: string = 'open';
  assignedAgent: any;
  animate: boolean = false;
  rating: any;
  htmlStr;
  imgSrc="/assets/img/thumbs-up-light.png";
  clicked:number=0;
  comment;
  newComment;
  imgSrcDown="/assets/img/thumbs-down-light.png";
  boolean:boolean=false;
  boolean1:boolean=false;
  constructor(
    private elementRef:ElementRef,
    private api: ApiService,
    private route: ActivatedRoute,
    private CFR: ComponentFactoryResolver,
    private cookieService: CookieService,
    private chatService: ChatService,
    private ngFlashMessageService: NgFlashMessageService,
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.project_name = this.route.snapshot.paramMap.get('project_name');
    this.project_Id = this.route.snapshot.paramMap.get('project_Id')


  }
  ngAfterViewInit() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://forexformoney.com/vizz/cdn_vizz_livechat.js";
    let script=this.elementRef.nativeElement.appendChild(s);
    console.log(script)
  } 
  ngOnInit() {
    this.api.getDigieUser().subscribe(res=>{
      console.log("Hello I am Project Table"+res)
    })
    
    // window.addEventListener("beforeunload", (e)=>
    // { 
    //   this.leftChat()
    // });
    console.log(this.router.url)
    this.chatService.joinRoom(this.project_name)
    this.document.body.classList.add('loadchatbox');
    this.chatService.recievedTyping().subscribe((data) => {

      if (data.user == 'agent' && this.assignedAgent) {

        this.typing = true;
        if (!this.animate) {
          this.animate = true; // break condition for the fadeinout animation
          this.fadeInOut()
        }
      }

    })

    this.api.getProjectDetail(this.project_Id).subscribe(data => {
      this.primaryColor = data.primarycolor || '#00BCD4'
      this.secondaryColor = data.secondarycolor || '#56c2d0'
    })

    this.chatService.checkOnlineAgents({ roomno: this.project_Id, listeningroom: this.project_name })
    this.chatService.onlineAgents().subscribe((data) => {
      if (data.project_id == this.project_Id && typeof data.data != 'undefined' && data.data != null) {

        this.agentStatus = 'online'
        this.topic = "How to buy the product ?"
        this.headMessage = "Enter the details and hop in."

      } else {

        this.agentStatus = "offline"
        this.topic = "Support is offline right now"
        this.headMessage = 'Leave your topic we will get back to you soon...'
        this.typing = false;
      }

    })

    this.chatService.agentLeft().subscribe((chat_id) => {
      if (chat_id == this.vizz_id) {
        this.agentStatus = 'online'
        this.topic = "Agent left the chat"
        this.typing = false
      }
    })

    this.vizz_id = this.cookieService.get('vizz_id').replace('j:', '')
    this.vizz_id = this.vizz_id.replace(/"/g, "");

    this.projectTitle = this.project_name.split('_').join(' ')
    this.chatService.getMessages().subscribe((message) => {
      this.typing = false;
      this.chatTaken = true;
      this.animate = false;

      if (!this.assignedAgent) {
        this.api.getAssignedAgent(this.vizz_id).subscribe((assignedagent) => {
          this.assignedAgent = assignedagent
          this.pushMessage(message)
         
        })
      } else {
        this.pushMessage(message)
        if (message.sender == 'Agent') {
          this.playAudio()
          console.log("I am sound2")
        }
      }

    });
    this.chatService.getUpdateMessages().subscribe((message) => {
       
     this.updatePushMessage(message,message.updatetime)
     

    });

    if (this.vizz_id) {

      this.chatService.joinRoom(this.vizz_id)
      this.api.get_message(this.vizz_id).subscribe(res => {

        if (res == null) {
          this.cookieService.delete('vizz_id', '/')
          this.firstTimeUser = true;
        } else {
          this.topic = res.messages[0].message
          this.name = res.user_name

          this.api.getAssignedAgent(this.vizz_id).subscribe((assignedagent) => {
            this.assignedAgent = assignedagent

            res.messages.forEach(message => {                                                // Set the listener to listen for the evet and on message enter create new <chat-box-message> on frontend
              this.pushMessage(message)
             
            });
          })
        }

      })
    } else {
      this.firstTimeUser = true;
    }
    
    
    this.chatService.getRemovingCustomer().subscribe((data) => {
      if (data.chat_id == this.vizz_id) {
        this.firstTimeUser = true;
        this.VCR.remove()
      }
    })
    
  }

  
    
  thumbs(value) {
    this.rating = value
    
    this.imgSrc="/assets/img/thumbs-up.png ";
    this.imgSrcDown="/assets/img/thumbs-down.png";
    if(this.rating==="good"){
      
      this.boolean1=true;
     this.htmlStr = '<p color="blue">Thanks for Rated Good</p>'
     

    }
    else if(this.rating==="bad"){
     
       this.boolean=true;
         this.htmlStr = '<p color="blue">Thanks for Rated Bad</p>'
      
        
      }
  }
  
  sendComment(value){
     this.newComment=value;
     if(this.newComment){
        alert("success")
     }
     this.comment=" "
  }
  sendMessage(text: any) {

    if (text != '') { //deny empty message

      if (!this.firstTimeUser) {
        let message: Message = {
          sender: "customer",
          message: text,
          time: new Date(),
          rating: this.rating,
          comment:this.newComment 
        }
        
        this.messageText = ''

        var data = {
          project_id: this.project_Id, // It will emit the event to all agents joined the project in future can change it to only assigned agent so only he can listen
          chat_id: this.vizz_id
        }

        this.chatService.chatUpdate(data)
        this.chatService.sendMessage(message, this.vizz_id)
        this.api.saveMessage(message, this.vizz_id)

      } else {
        console.log(this.rating)
        if (EmailValidator.validate(this.email)) {
          this.data = {
            name: this.name,
            email: this.email,
            message: this.message,
            agents: this.agentStatus,
            rating: this.rating


          }
          this.transcriptEmail = this.email

          console.log(data)

          this.api.chat(this.data, this.project_Id, this.project_name).subscribe(res => {

            if (this.agentStatus == "online") {

              this.chatTaken = false;
              this.animate = true;
              this.topic = this.message
              this.firstTimeUser = false
              this.vizz_id = res._id
              this.chatService.joinRoom(res._id)
              setTimeout(() => {
                res.messages.forEach(message => {
                  this.pushMessage(message)
                });
              }, 1000);

              this.fadeInOut()
            } else {

              this.headMessage = 'Thanks we recieved your message will get back to you soon..'

            }

          }, err => {

          });


        } else {
          this.headMessage = 'Enter valid email address'
        }

      }
    }
  }


  leftChat() {
    this.name = null
    this.email = null
    this.message = null

    var data = {
      project_id: this.project_Id,
      chat_id: this.vizz_id,
      change_status: true
    }

    this.cookieService.delete('vizz_id', '/')
    this.firstTimeUser = true
    this.chatService.removeCustomer(data)
    this.VCR.remove()
    this.messageText = null
    this.displayLeave = false
  }

  pushMessage(message) {
    console.log("I am start"+message.id)
    
    let componentFactory = this.CFR.resolveComponentFactory(ChatboxmessageComponent);// Create a <chat-box-message> through component factory dynamically
    let componentRef: ComponentRef<ChatboxmessageComponent> = this.VCR.createComponent(componentFactory); // Store the reference fo the component
    let currentComponent = componentRef.instance;                         //Get the inner atributes of the newly created component through instance of the reference
    currentComponent.message = message;                                   // Set the inner variable message of <chat-box-message> component
    
    if (message.sender == 'Agent') {
      currentComponent.user = this.assignedAgent.name
    } else {
      currentComponent.user = this.name
    }

    currentComponent.messageColor = this.primaryColor
    currentComponent.selfRef = currentComponent;                          // Get the variable selfRef inside of newly created <chat-box-message> to store it's own reference
    this.messagesReferences.push(componentRef);                           // Push the reference of newly created <chat-box-message> in the array of reference in this module
  }

  updatePushMessage(message,time) {
    console.log("update",message.message,time)
    
    let componentFactory = this.CFR.resolveComponentFactory(ChatboxmessageComponent);// Create a <chat-box-message> through component factory dynamically
    let componentRef: ComponentRef<ChatboxmessageComponent> = this.VCR.createComponent(componentFactory); // Store the reference fo the component
    let currentComponent = componentRef.instance;                         //Get the inner atributes of the newly created component through instance of the reference
    currentComponent.updatemessage = message.message;
    currentComponent.time=time;                                   // Set the inner variable message of <chat-box-message> component
    
    if (message.sender == 'Agent') {
      currentComponent.user = this.assignedAgent.name
    } else {
      currentComponent.user = this.name
    }

    currentComponent.messageColor = this.primaryColor
    currentComponent.selfRef = currentComponent;                          // Get the variable selfRef inside of newly created <chat-box-message> to store it's own reference
    this.messagesReferences.push(componentRef);                           // Push the reference of newly created <chat-box-message> in the array of reference in this module
  }
  playAudio() {
    let audio = new Audio();
    audio.src = "/assets/sounds/longexpected.mp3";
    audio.load();
    audio.play();
  }

  toggleOptions() {
    if (this.displayOptions) {
      this.displayOptions = false
    } else {
      this.displayOptions = true
      this.outSide = false
    }
  }

  toggleTranscript() {

    if (this.displayEmail) {
      this.displayEmail = false
    } else {
      this.displayOptions = false
      this.displayEmail = true
      this.outSide = false
    }
  }

  sendTranscript(download: boolean) {


    if (!this.firstTimeUser) {
      let data = {
        email: this.transcriptEmail,
        chat_id: this.vizz_id,
        download: download
      }

      this.api.sendTranscript(data).subscribe((res) => {

        if (download) {
          var data = '';
          res.forEach((message) => {
            if (message.sender == 'customer') {
              data += 'You   : ' + message.message
            } else {
              data += 'Agent : ' + message.message
            }
          })

          const blob = new Blob([data], { type: 'plain/text' });
          const url = window.URL.createObjectURL(blob);
          const link = this.downloadZipLink.nativeElement;
          link.href = url;
          link.download = 'chat.txt';
          link.click();
          window.URL.revokeObjectURL(url);

        }

      })
    }


  }

  toggleLeave() {
    if (!this.firstTimeUser) {
      if (this.displayLeave) {
        this.displayLeave = false
      } else {
        this.displayOptions = false
        this.displayLeave = true
        this.outSide = false
      }
    }
  }

  toggleRating() {

    if (this.displayRating) {
      this.displayRating = false
    } else {
      this.displayOptions = false
      this.displayRating = true
      this.outSide = false
    }
  }

  clickedOutside(event: Object) {

    if (this.outSide) {
      if (event && event['value'] === true) {
        this.displayEmail = false
        this.displayOptions = false
        this.displayLeave = false
        this.displayRating = false
      }
    } else {
      this.outSide = true
    }
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

  customerTyping() {
    this.chatService.typing({ roomno: this.vizz_id, user: 'customer' })
  }
 


}
