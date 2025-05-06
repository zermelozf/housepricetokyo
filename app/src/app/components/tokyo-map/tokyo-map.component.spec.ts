import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokyoMapComponent } from './tokyo-map.component';

describe('TokyoMapComponent', () => {
  let component: TokyoMapComponent;
  let fixture: ComponentFixture<TokyoMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokyoMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokyoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
