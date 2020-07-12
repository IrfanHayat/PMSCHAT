import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { ChatsComponent } from '../chats/chats.component';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input('username') username: any;
  isAgent: boolean;
  @Output() projectsAssigned = new EventEmitter<string>();
  value;

  constructor(
    private api: ApiService,
    private router: Router,
    private chatService: ChatService,
    private servicesData: ServicesService,
  ) { }

  ngOnInit() {
    if (this.router.url == '/agent-dashboard' || this.router.url == '/assigned-projects' || this.router.url == '/history') {
      this.isAgent = true;
    }
    if (this.router.url == '/dashboard') {
      this.isAgent = false;
    }
  }

  onLogoutClick() {

    if (this.isAgent) {

      this.api.agentData(this.username).subscribe((data) => {

        var user = {
          _id: data._id,
          name: data.name,
          company_id: data.company_Id,
          status: 'left'
        }

        data.assigned_projects.forEach((projectId) => {
          this.api.getProjectDetail(projectId).subscribe((project) => {
            this.chatService.checkOnlineAgents({ roomno: projectId, listeningroom: project.name, user: user })
          })
        })
      })

      this.api.agentlogout();
      this.chatService.logout();
      this.router.navigate(['/agent-login']);
      return false;
    } else {
      this.api.logout();
      this.router.navigate(['/login']);
      return false;
    }

  }
  rejectChat(value){
   
   this.servicesData.getRejectValue(value)
  }
  
  goChats() {
    this.router.navigate(['/agent-dashboard'])
  }
  canDeactivate() {
    console.log("Hi I am here")
  }
 

}
