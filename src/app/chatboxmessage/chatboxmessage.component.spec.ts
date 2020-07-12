import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatboxmessageComponent } from './chatboxmessage.component';

describe('ChatboxmessageComponent', () => {
  let component: ChatboxmessageComponent;
  let fixture: ComponentFixture<ChatboxmessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatboxmessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatboxmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
