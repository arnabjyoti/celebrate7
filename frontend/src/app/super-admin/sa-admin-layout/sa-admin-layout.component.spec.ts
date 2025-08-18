import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaAdminLayoutComponent } from './sa-admin-layout.component';

describe('SaAdminLayoutComponent', () => {
  let component: SaAdminLayoutComponent;
  let fixture: ComponentFixture<SaAdminLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaAdminLayoutComponent]
    });
    fixture = TestBed.createComponent(SaAdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
