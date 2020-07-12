import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatboxPrototypeComponent } from './chatbox-prototype.component';

describe('ChatboxPrototypeComponent', () => {
  let component: ChatboxPrototypeComponent;
  let fixture: ComponentFixture<ChatboxPrototypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatboxPrototypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatboxPrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
