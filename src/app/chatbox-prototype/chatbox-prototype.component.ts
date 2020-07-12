import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chatbox-prototype',
  templateUrl: './chatbox-prototype.component.html',
  styleUrls: ['./chatbox-prototype.component.css']
})
export class ChatboxPrototypeComponent implements OnInit {

  @Input('primarycolor') primaryColor: any;
  @Input('secondarycolor') secondaryColor: any;
  constructor() { }

  ngOnInit() {

  }


}
