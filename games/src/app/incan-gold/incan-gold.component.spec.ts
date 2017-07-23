import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncanGoldComponent } from './incan-gold.component';

describe('IncanGoldComponent', () => {
  let component: IncanGoldComponent;
  let fixture: ComponentFixture<IncanGoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncanGoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncanGoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
