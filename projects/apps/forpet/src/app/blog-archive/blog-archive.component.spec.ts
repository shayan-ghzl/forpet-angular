import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogArchiveComponent } from './blog-archive.component';

describe('BlogArchiveComponent', () => {
  let component: BlogArchiveComponent;
  let fixture: ComponentFixture<BlogArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogArchiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
