import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-assigned-projects',
  templateUrl: './assigned-projects.component.html',
  styleUrls: ['./assigned-projects.component.css']
})
export class AssignedProjectsComponent implements OnInit {

  username: string;
  displayProjects: boolean = true;
  projects: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    var name = localStorage.getItem('agent');
    this.username = name

    this.api.assignedProjects({ agent_id: localStorage.getItem('agentid') }).subscribe((res) => {

      if (res.success) {
        this.projects = res.data
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


}
