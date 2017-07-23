import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SevenWondersComponent } from './seven-wonders.component';

describe('SevenWondersComponent', () => {
  let component: SevenWondersComponent;
  let fixture: ComponentFixture<SevenWondersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SevenWondersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SevenWondersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
