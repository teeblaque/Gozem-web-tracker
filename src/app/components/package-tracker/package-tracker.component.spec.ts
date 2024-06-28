import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTrackerComponent } from './package-tracker.component';

describe('PackageTrackerComponent', () => {
  let component: PackageTrackerComponent;
  let fixture: ComponentFixture<PackageTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
