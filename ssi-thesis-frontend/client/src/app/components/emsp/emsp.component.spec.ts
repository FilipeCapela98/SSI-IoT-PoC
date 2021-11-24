import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmspComponent } from './emsp.component';

describe('EmspComponent', () => {
  let component: EmspComponent;
  let fixture: ComponentFixture<EmspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmspComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
