import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsClientComponent } from './event-details-client.component';

describe('EventDetailsClientComponent', () => {
  let component: EventDetailsClientComponent;
  let fixture: ComponentFixture<EventDetailsClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventDetailsClientComponent]
    });
    fixture = TestBed.createComponent(EventDetailsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
