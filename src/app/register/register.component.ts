import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  messages = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  ngOnInit() {

    if (this.api.loggedIn()) {
      this.router.navigate(['dashboard'])
    }

  }

  registerUser(user) {
    this.api.registerUser(user).subscribe(data => {

      this.messages[0] = data.msg
      if (data.success) {
        this.messages[0] += ' We are proceeding you to login'
        this.ngFlashMessageService.showFlashMessage({
          messages: this.messages,
          dismissible: true,
          timeout: 3000,
          type: 'success'
        });
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 3000);

      } else {
        this.ngFlashMessageService.showFlashMessage({
          messages: this.messages,
          dismissible: true,
          timeout: 3000,
          type: 'danger'
        });

        this.router.navigate(['register']);
      }
    });

  }

  onLogoutClick() {
    this.api.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
