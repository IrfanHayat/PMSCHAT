import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private messageSource = new BehaviorSubject('');
  private message = new BehaviorSubject('');
  private Id = new BehaviorSubject('');
  private getBoolean = new BehaviorSubject('');
  newMessage=this.message
  id=this.Id
  boolean=this.getBoolean
  currentMessage = this.messageSource;
  constructor() { }
  getRejectValue(value){
     this.getBoolean.next(value)  
  }
  changeMessage(message: string) {
    this.messageSource.next(message)
  }
  getRatingMessage(message,id){
     this.newMessage.next(message)
     this.id.next(id)
  }
}
