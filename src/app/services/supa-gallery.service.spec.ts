import { TestBed } from '@angular/core/testing';

import { SupaGalleryService } from './supa-gallery.service';

describe('SupaGalleryService', () => {
  let service: SupaGalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupaGalleryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
