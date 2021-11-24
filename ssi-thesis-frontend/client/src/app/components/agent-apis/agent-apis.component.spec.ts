import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentApisComponent } from './agent-apis.component';

describe('AgentApisComponent', () => {
  let component: AgentApisComponent;
  let fixture: ComponentFixture<AgentApisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentApisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
