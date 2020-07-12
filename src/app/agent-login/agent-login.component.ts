import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';
import { first } from 'rxjs/operators';
import { ServicesService } from '../services.service';
@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.css']
})
export class AgentLoginComponent implements OnInit {
  @Input() Agent: any;
  name: String;
  password: String;
  data: any;
  invalidLogin: boolean = false;
  messages = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private ngFlashMessageService: NgFlashMessageService,
  ) { }

  ngOnInit() {

    if (this.api.agentlogIn()) {
      this.router.navigate(['/agent-dashboard'])
    }
  }

  loginAgent() {
    const user = {
      name: this.name,
      password: this.password
    }
    this.Agent = user.name;
    this.api.authenticateAgent(user).pipe(first()).subscribe(data => {
      this.messages[0] = data.msg
      if (data.success) {
        this.api.storeAgentData(data.token, data.user.name, data.user.id);
        this.ngFlashMessageService.showFlashMessage({
          messages: this.messages,
          dismissible: true,
          timeout: 3000,
          type: 'success'
        });
        this.router.navigate(['/agent-dashboard']);
      } else {

        this.ngFlashMessageService.showFlashMessage({
          messages: this.messages,
          dismissible: true,
          timeout: 3000,
          type: 'danger'
        });

        this.router.navigate(['/agent-login']);
      }
    });

  }





  onLogoutClick() {

    localStorage.removeItem("agent-token");
    this.router.navigate(['/agent-login']);
    return false;
  }


}
