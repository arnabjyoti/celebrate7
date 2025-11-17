import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsCategorywiseComponent } from './events-categorywise.component';

describe('EventsCategorywiseComponent', () => {
  let component: EventsCategorywiseComponent;
  let fixture: ComponentFixture<EventsCategorywiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventsCategorywiseComponent]
    });
    fixture = TestBed.createComponent(EventsCategorywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
