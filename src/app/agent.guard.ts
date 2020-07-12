import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ApiService } from './api.service';
@Injectable()
export class AgentGuard implements CanActivate {
  constructor(
    private router: Router,
    private api: ApiService,
  ) { }
 
  canActivate() : boolean{


  
    if(this.api.agentlogIn()){
      return true;
    }
    else {
      this.router.navigate(['/agent-login']);
      return false;
    }
    

  }

 
}