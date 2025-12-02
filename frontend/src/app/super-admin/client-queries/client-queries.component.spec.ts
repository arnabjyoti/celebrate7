import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientQueriesComponent } from './client-queries.component';

describe('ClientQueriesComponent', () => {
  let component: ClientQueriesComponent;
  let fixture: ComponentFixture<ClientQueriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientQueriesComponent]
    });
    fixture = TestBed.createComponent(ClientQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
