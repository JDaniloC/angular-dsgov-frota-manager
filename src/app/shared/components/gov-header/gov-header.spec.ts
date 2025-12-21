import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovHeader } from './gov-header';

describe('GovHeader', () => {
  let component: GovHeader;
  let fixture: ComponentFixture<GovHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
