import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventNotFoundComponent } from './event-not-found.component';

describe('EventNotFoundComponent', () => {
  let component: EventNotFoundComponent;
  let fixture: ComponentFixture<EventNotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventNotFoundComponent]
    });
    fixture = TestBed.createComponent(EventNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
