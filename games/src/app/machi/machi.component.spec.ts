import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachiComponent } from './machi.component';

describe('MachiComponent', () => {
  let component: MachiComponent;
  let fixture: ComponentFixture<MachiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
