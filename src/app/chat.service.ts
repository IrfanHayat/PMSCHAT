import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable'


@Injectable()
export class ChatService {
    current_url : any;
    socket:any;

  constructor() {
    this.socket = io('/', {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts: Infinity
    });
     
  }

  public joinRoom(roomno){
    this.socket.emit('join',roomno)
  }

  public leaveRoom(roomno){
    this.socket.emit('leave',roomno)
  }
  
  public sendMessage(message,id) {

      this.socket.emit('new-message', message,id);
  }
  public updateMessage(message,chat_id,time) {
    console.log("get Function Chat update",time)
    this.socket.emit('update-message', message,chat_id,time);
}
public getUpdateMessages = () =>{
    
  return Observable.create((observer) => {
      this.socket.on("update-message", (message,time) => {
        console.log("get Function Chat ser",time)
           let messages={
             message:message,
             updatetime:time
          }
          observer.next(messages);
          
      });
  });
}

  public chatUpdate(data) {
    this.socket.emit('chat-update', data);
  }
  
  public getChatUpdate = () =>{
    return Observable.create((observer) => {
        this.socket.on('chat-update', (chat_id) => {
            observer.next(chat_id);
        });
    });
  }
  public setNotification(msg){
    this.showDesktopNotification(msg);
     this.sendNodeNotification(msg); 
  }

  public showNotification(){
    this.socket.on('show_notification', function (data) {
      this.showDesktopNotification(data);
     });
  }
  
 
requestNotificationPermissions() {
  
  if (Notification['permission'] !== 'denied') {
  Notification.requestPermission(function (permission) {
  });
  }
  }
  
  showDesktopNotification(message) {
    
    this.requestNotificationPermissions();
    var instance = new Notification(
    message
    );
    // instance.onclick = function () {
    // // Something to do
    // };
    // instance.onerror = function () {
    // // Something to do
    // };
    // instance.onshow = function () {
    // // Something to do
    // };
    // instance.onclose = function () {
    // // Something to do
    // };
   
    setTimeout(instance.close.bind(instance),3000);
    return false;
    }

  public sendNodeNotification(msg) {
    this.socket.emit('new_notification', {
    message: msg,
    });
    }


  public getCustomer = () =>{
    return Observable.create((observer) => {
        this.socket.on('new-customer', (message) => {
            observer.next(message);
        });
    });
  }

  public getMessages = () =>{
    
      return Observable.create((observer) => {
          this.socket.on("new-message", (message) => {
              observer.next(message);
          });
      });
  }

  

  public removeCustomer(data){
    this.socket.emit('remove-customer',data);
  }

  public assignAgent(data){
    this.socket.emit('agent-assigned',data);
  }

  public checkOnlineAgents(data){
    this.socket.emit('online-agents',data);
  }

  public onlineAgents(){
    return Observable.create((observer) => {
        this.socket.on('online-agents', (data) => {
            observer.next(data);
        });
    });

  }

  public leftChat(chat_id){
    this.socket.emit('chat-left',chat_id);
  }

  public agentLeft(){
    return Observable.create((observer) => {
        this.socket.on('chat-left', (chat_id) => {
            observer.next(chat_id);
        });
    });

  }

  public logout(){
    this.socket.emit('agent-logout');
  }

  public agentAssigned = () =>{
    return Observable.create((observer) => {
        this.socket.on('agent-assigned', (data) => {
            observer.next(data);
        });
    });
  }

  public getRemovingCustomer = () =>{
    return Observable.create((observer) => {
        this.socket.on('remove-customer', (data) => {
            observer.next(data);
        });
    });
  }

  public transferChat(data){
    this.socket.emit('transfer-chat',data);
  }

  public typing = (data)=>{
    this.socket.emit('typing',data);
  }

  public recievedTyping = () =>{
    return Observable.create((observer) => {
        this.socket.on('typing', (data) => {
            observer.next(data);
        });
    });
  }

  public test = ()=>{
    this.socket.emit('test',{'message':'emited'});
  }
}