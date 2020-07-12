import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjPageComponent } from './proj-page.component';

describe('ProjPageComponent', () => {
  let component: ProjPageComponent;
  let fixture: ComponentFixture<ProjPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
