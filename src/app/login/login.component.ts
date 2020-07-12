import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;
  messages = [];
  data: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  ngOnInit() {

    if (this.api.loggedIn()) {
      this.router.navigate(['/dashboard'])
    }

  }

  onLogoutClick() {
    this.api.logout();
    this.router.navigate(['/login']);
    return false;
  }


  authenticate() {
    const user = {
      username: this.username,
      password: this.password
    }


    this.api.authenticateUser(user).subscribe(data => {
      this.messages[0] = data.msg
      if (data.success) {
        this.api.storeUserData(data.token, data.user.id);
        this.ngFlashMessageService.showFlashMessage({
          messages: this.messages,
          dismissible: true,
          timeout: 3000,
          type: 'success'
        });
        this.router.navigate(['/dashboard']);

      } else {

        this.ngFlashMessageService.showFlashMessage({
          messages: this.messages,
          dismissible: true,
          timeout: 2000,
          type: 'danger'
        });

        this.router.navigate(['/login']);
      }
    });
  }


}
