import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationTypeSearchComponent } from './relation-type-search.component';

describe('RelationTypeSearchComponent', () => {
  let component: RelationTypeSearchComponent;
  let fixture: ComponentFixture<RelationTypeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationTypeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationTypeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
