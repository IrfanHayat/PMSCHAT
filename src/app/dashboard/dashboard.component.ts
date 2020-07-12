import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  projects: any;
  assignAgents: any;
  link: any;
  agents: any;
  primarycolor: any;
  secondarycolor: any;
  selectedProject: any;
  company: any;
  agentname: any; // Selected agent name in the select box
  projectHeading: any;
  displayProjects: boolean = true;
  displayAgents: boolean = true;
  proname: string;       // Add project Field name 
  url: string;           // Add project Field name 
  agentName: string;     // Add agent Field name 
  agentPassword: string; // Add agent Field name 
  companyName: string;
  removingProject: boolean = false;
  output;
  id;
  username;
  email
  constructor(
    private api: ApiService,
    private router: Router,
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  ngOnInit() {
    this.projectHeading = "Project Detail"
    this.primarycolor = '#199699'
    this.secondarycolor = '#50cdd0'
    var id = localStorage.getItem('user')

    this.api.getDashboard().subscribe(res => {

      this.company = res.user;
      this.companyName = this.company.username

      this.api.getProjects(id).subscribe(res => {
        this.projects = res;
      }, err => {
        console.log(err);
      });


      this.api.Agent(id).subscribe(res => {
        this.agents = res;
      });


    },
      err => {
        console.log(err);
        this.api.logout();
        this.router.navigate(['/login']);
        return false;
      });


  }



  updateColors() {

    if (this.selectedProject) {
      var data = {
        project_id: this.selectedProject._id,
        primarycolor: this.primarycolor,
        secondarycolor: this.secondarycolor
      }
      this.api.updateColorsAdmin(data).subscribe((data) => {

        if (data.success) {
          var messages = ['Colors updated successfuly']
          this.ngFlashMessageService.showFlashMessage({     //Show the message on the front end
            messages: messages,
            dismissible: true,
            timeout: 3000,
            type: 'success'
          });
        }

      })
    } else {
      var messages = ['Please choose any project first to update color']
      this.ngFlashMessageService.showFlashMessage({     //Show the message on the front end
        messages: messages,
        dismissible: true,
        timeout: 5000,
        type: 'danger'
      });
    }
  }

  getProjectDetail(element: any) {
    if (!this.removingProject) {

      this.selectedProject = element
      this.projectHeading = element.name
      this.api.getAgent(element._id).subscribe(data => {

        this.assignAgents = data;
      });

      this.api.getProjectDetail(element._id).subscribe(data => {
        this.primarycolor = data.primarycolor
        this.secondarycolor = data.secondarycolor
      })

      this.link = `<script id='vizz-chat' data-user="` + this.id + `" data-username="` + this.username + `" data-useremail="` + this.email + `" data-projectname="` + element.name + `" data-siteid="` + element._id + `" src="https://forexformoney.com/vizz/cdn_vizz_livechat.js"></script>`
      

    }
  }



  assign() {
    if (this.selectedProject) {
      var data = {
        name: this.agentname
      }
      this.api.assign(data, this.selectedProject._id).subscribe((response) => {
        var messages = [response.msg]

        if (response.success) {
          this.assignAgents.push(this.agents.find(x => x._id == this.agentname))
          this.ngFlashMessageService.showFlashMessage({
            messages: messages,
            dismissible: true,
            timeout: 5000,
            type: 'success'
          });

        }

      });
    } else {
      var messages = ['Please click on any project from current projects list to assign agent']
      this.ngFlashMessageService.showFlashMessage({     //Show the message on the front end
        messages: messages,
        dismissible: true,
        timeout: 5000,
        type: 'danger'
      });
    }

  }

  addproject() {
    var data = {
      proname: this.proname,
      url: this.url
    }

    this.api.addproject(data, this.company._id).subscribe((status) => {
      var messages = [status.msg]
      if (status.success) {
        this.projects.push(status.data)
        this.proname = null
        this.url = null
        this.ngFlashMessageService.showFlashMessage({
          messages: messages,
          dismissible: true,
          timeout: 5000,
          type: 'success'
        });
      } else {

        this.ngFlashMessageService.showFlashMessage({
          messages: messages,
          dismissible: true,
          timeout: 4000,
          type: 'danger'
        });
      }

    });


  }

  removeProject(id) {
    this.removingProject = true // Make true inorder to not fire getProjectDetail() function
    this.api.removeproject({ id: id }).subscribe((res) => {
      var messages = [res.msg]

      if (res.success) {
        this.projects = this.projects.filter(x => x._id != id)
        this.assignAgents = null
        this.primarycolor = '#199699'
        this.secondarycolor = '#50cdd0'
        this.link = null
        this.removingProject = false // Make true inorder to not fire getProjectDetail() function

        this.ngFlashMessageService.showFlashMessage({
          messages: messages,
          dismissible: true,
          timeout: 5000,
          type: 'success'
        });

      }

    })
  }

  addagent() {
    var data = {
      name: this.agentName,
      password: this.agentPassword
    }
    this.api.addagent(data, this.company._id).subscribe((response) => {
      var messages = [response.msg]

      if (response.success) {
        this.agents.push(response.data)
        this.agentName = null
        this.agentPassword = null
        this.ngFlashMessageService.showFlashMessage({
          messages: messages,
          dismissible: true,
          timeout: 5000,
          type: 'success'
        });

      } else {
        this.ngFlashMessageService.showFlashMessage({
          messages: messages,
          dismissible: true,
          timeout: 5000,
          type: 'danger'
        });
      }

    })
  }

  removeAgent(id) {

    this.api.removeagent({ id: id }).subscribe((res) => {
      var messages = [res.msg]

      if (res.success) {
        if (this.assignAgents) {
          this.assignAgents = this.assignAgents.filter(x => x._id != id)
        }

        this.agents = this.agents.filter(x => x._id != id)

        this.ngFlashMessageService.showFlashMessage({
          messages: messages,
          dismissible: true,
          timeout: 5000,
          type: 'success'
        });

      }

    })
  }

  toggleProjects() {
    if (this.displayProjects) {
      this.displayProjects = false
    } else {
      this.displayProjects = true
    }
  }

  toggleAgents() {
    if (this.displayAgents) {
      this.displayAgents = false
    } else {
      this.displayAgents = true
    }
  }
  canDeactivate() {
    console.log("Hi I am here")
  }

}

