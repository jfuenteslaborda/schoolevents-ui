import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CarouselUnfilteredComponent } from './carousel-unfiltered.component';

describe('CarouselUnfilteredComponent', () => {
  let component: CarouselUnfilteredComponent;
  let fixture: ComponentFixture<CarouselUnfilteredComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CarouselUnfilteredComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselUnfilteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
