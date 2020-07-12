import { Component , HostListener, OnInit } from '@angular/core'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  constructor(){}

  ngOnInit(){
    // function for alert to show on window reload or leaving window

    //   window.addEventListener("beforeunload", function (e)
    //   {
    //     var confirmationMessage = "\o/";
       
    //     e.returnValue = confirmationMessage;     
    //     return confirmationMessage;              
    // });

  }

}
