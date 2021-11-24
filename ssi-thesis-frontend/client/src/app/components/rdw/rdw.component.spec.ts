import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdwComponent } from './rdw.component';

describe('RdwComponent', () => {
  let component: RdwComponent;
  let fixture: ComponentFixture<RdwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
