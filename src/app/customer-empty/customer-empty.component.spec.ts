import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEmptyComponent } from './customer-empty.component';

describe('CustomerEmptyComponent', () => {
  let component: CustomerEmptyComponent;
  let fixture: ComponentFixture<CustomerEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEmptyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
