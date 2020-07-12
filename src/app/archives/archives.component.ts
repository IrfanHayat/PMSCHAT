import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { MessagesComponent } from '../messages/messages.component'
import { NgFlashMessageService } from 'ng-flash-messages';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../services.service';


@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css']
})

export class ArchivesComponent implements OnInit {

  username: string;
  customerMessages: any;
  componentsReferences = [];
  chatDate: any;
  pmsEmployees: any;
  pmsProjects: any;
  task_duedate: any;
  ticket_info: any;
  task_desc: any;
  task_status: any;
  project_milestone: any;
  task_assign_usr: any;
  customer: any;
  date;
  filterlist;
  ticketForm: FormGroup;
  submitted = false;
  id;
  message;

  subscription;
  today = new Date();
  submit;
  newdate = this.today;
  Id;
  yesterday = new Date(Date.now() - 86400000);
  dateModel = [
    { id: 1, name: "today", date: this.today },
    { id: 2, name: "yesterday", date: this.yesterday },
    { id: 3, name: "last week", date: this.today },

  ];

  rated = [
    { id: 1, name: "good" },
    { id: 2, name: "bad" },
    { id: 3, name: "not rated" },

  ]


  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;
  @ViewChild('messages', { read: ViewContainerRef }) messagesVCR: ViewContainerRef;

  constructor(
    private api: ApiService,
    private CFR: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private ngFlashMessageService: NgFlashMessageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private servicesData: ServicesService,
    
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params.email)
      this.customer = {
        email: params.email ? params.email : '',
      }
    })
  }


  ngOnInit() {
   
   this.servicesData.newMessage.subscribe(result=>{
    this.message=result
    
   });
   this.servicesData.id.subscribe(result=>{
     this.Id=result
   })
   
    this.username = localStorage.getItem('agent');
    let result = this.api.get_agent_data().subscribe(result => {
      result.agent.filter(res => {
        console.log(res)
        if (res.name === this.username) {
          this.username = res.name;
          console.log(this.id)
        }
      })
    })

    this.createEmptyChatArea()
    this.api.getCustomerData(this.customer.email).subscribe((messages) => {

      this.customerMessages = messages.data
      this.filterlist = messages.data
      console.log(this.customerMessages)

      console.log(this.today.toString())
      console.log(this.yesterday.toString())
    })
    this.api.getPmsEmpAndProjects().subscribe((pmsData) => {
      this.pmsEmployees = pmsData.employees
      this.pmsProjects = pmsData.projects
    })
    this.ticketForm = this.formBuilder.group({
      ticketName: ['', [Validators.required, , Validators.minLength(3)]],

      taskStatus: ['', Validators.required],
      employee: ['', Validators.required],
      projectName: ['', Validators.required],
      date1: ['', Validators.required]
    });

  }
  get f() { return this.ticketForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.ticketForm.invalid) {
      return;
    }


    alert('SUCCESS!! :-)')
  }


  rating(d) {
    let arr=[]
    if (d.name === "good") {
      this.customerMessages = this.filterlist
      let obj = this.customerMessages
      console.log(obj)

      for (let index in obj) {
        let message = obj[index]['messages']
        for (let data in message) {
          if (message[data]['rating'] == "good") {
            arr.push(obj[index]);
            this.customerMessages = arr

          }
        }
      }

    }
    if (d.name === "bad") {
     
      this.customerMessages = this.filterlist
      let obj = this.customerMessages
      console.log(obj)

      for (let index in obj) {
        let message = obj[index]['messages']
        for (let data in message) {
          if (message[data]['rating'] == "bad") {
            arr.push(obj[index]);
            this.customerMessages = arr

          }
        }
      }

    }
    if (d.name === "not rated") {
      this.customerMessages = this.filterlist
      let obj = this.customerMessages
      console.log(obj)

      for (let index in obj) {
        let message = obj[index]['messages']
        for (let data in message) {
          if (message[data]['rating'] != "bad" && message[data]['rating'] != "good" ) {
            arr.push(obj[index]);
            this.customerMessages = arr

          }
        }
      }
    }
  }
  getValue(d) {

    if (d.name === "today") {
      this.customerMessages = this.filterlist
      this.customerMessages = this.customerMessages.filter(data => new Date(data.messages[0].time).getDate() === new Date(d.date).getDate())



    }
    if (d.name === "yesterday") {
      this.customerMessages = this.filterlist
      this.customerMessages = this.customerMessages.filter(data => new Date(data.messages[0].time).getDate() === new Date(d.date).getDate())



    }
    if (d.name === "last week") {
      this.customerMessages = this.filterlist
      this.customerMessages = this.customerMessages.filter(data => new Date(data.messages[0].time).getDate() <= new Date(d.date).getDate() + 7)

    }
  }

  getMessage(chat_id: any, date: any) {

    let customer = this.customerMessages.filter(x => x._id == chat_id)[0]
    this.VCR.remove();
    this.chatDate = date
    let componentFactory = this.CFR.resolveComponentFactory(MessagesComponent);
    var componentRef = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
    currentComponent.ClientId = chat_id;
    currentComponent.history = true;
    currentComponent.customerName = customer.user_name
    currentComponent.getMessage({ chat_id: chat_id, assigned: true }); // Send the full data document in order to assign chat to specific agent
    currentComponent.selfRef = currentComponent;

  }

  createEmptyChatArea() {

    let componentFactory = this.CFR.resolveComponentFactory(MessagesComponent);
    var componentRef = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
    currentComponent.disableTextArea = true;
    currentComponent.history = true;
    currentComponent.selfRef = currentComponent;

  }

  setDate(days: any) {
    if (days) {
      var date = new Date();
      if (days == 6) {
        this.task_duedate = date.setDate(date.getDate() + (days + (7 - date.getDay())) % 7);
      } else {
        this.task_duedate = date.setDate(date.getDate() + days - 1)
      }
    } else {
      this.task_duedate = ''
    }

  }


  submitTicket() {

    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var guest_password = ''
    for (var i = 0; i < 10; i++)
      guest_password += possible.charAt(Math.floor(Math.random() * possible.length));

    var ticket_detail_obj = {
      "task_title": this.ticket_info,
      "task_description": this.task_desc,
      "task_status": this.task_status,
      "reportedBy": this.username,
      "project_id": this.project_milestone,
      "milestone_id": this.project_milestone,
      "user_id": this.task_assign_usr,
      "duedate": this.task_duedate,
      "task_creationdate": Date.now(),
      "ticket_attachment": '',
      "guest_email": this.customer.email,
      "guest_password": guest_password
    }

    this.api.submitTicketPms(ticket_detail_obj).subscribe(result => {
      if (result.success) {
        console.log("add succesfully")
        console.log(result)
        var data = {
          project_name: this.pmsProjects.filter(x => x._id == this.project_milestone)[0].project_name,
          ticketid: result.last_inserted_id,
          guest_email: this.customer.email,
          guest_password: null
        }

        if (!result.updatedExisting) {
          data.guest_password = guest_password
        }
        console.log(data)

        this.api.sendTicketEmail(data).subscribe((res) => {

          this.ticket_info = ''
          this.task_desc = ''
          this.task_status = ''
          this.project_milestone = ''
          this.task_assign_usr = ''
          this.task_duedate = ''

          var messages = ["Ticket ID: " + result.last_inserted_id, "Email sent to user if it's valid"]
          this.ngFlashMessageService.showFlashMessage({     //Show the message on the front end
            messages: messages,
            dismissible: true,
            timeout: 10000,
            type: 'success'
          });

        })


      } else {
        var messages = ["Some error occured"]
        this.ngFlashMessageService.showFlashMessage({     //Show the message on the front end
          messages: messages,
          dismissible: true,
          timeout: 4000,
          type: 'danger'
        });
      }

    })
  }

  submitTicketData() {
    let data = {
      "ticketName": this.ticket_info,
      "ticketPriority": this.task_status,
      "employee": "ali",
      "description": this.task_desc,
      "milestone": "hard work",
      "guestEmail": "irfanhayat@gmail.com",
      "date": Date.now(),



    }
    console.log(data)
    this.api.submitTicket(data).subscribe(res => {
      console.log(res)
    })
  }
  save() {
    this.submitted = true;
    if (this.submitted == true && this.ticket_info == ' ' || this.task_status == ' ' && this.project_milestone == ' ' && this.task_assign_usr == ' ') {

      this.submit = "Please fill all required field";
      console.log("I am Here")
      this.subscription.unsubscribe();
    }

  }


}

