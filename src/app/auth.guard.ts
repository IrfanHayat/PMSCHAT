import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import { Router, CanActivate } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private api:ApiService,
   ) { }

  canActivate() : boolean{

  
    if (this.api.loggedIn()) {
      return true;
      
    }else{
      this.router.navigate(['']);
      return false;
    }
    
   
    
  }


}


