// src/app/components/image-gallery/image-gallery.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import PinchZoom from 'pinch-zoom-js';
import { SupaGalleryService, SupaImage } from '../../services/supa-gallery.service';
import {MatIconModule} from '@angular/material/icon'
@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss'
})
export class ImageGalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  private supa = inject(SupaGalleryService);

  images: SupaImage[] = [];
  isOpen = false;
  selected: SupaImage | null = null;

  uploading = false;

  @ViewChild('pz') pzRef?: ElementRef<HTMLElement>;
  private pz?: PinchZoom;

  constructor(private location: Location) {}

  async ngOnInit() { await this.refresh(); }

  async refresh() {
    this.images = await this.supa.list();
  }

  async onFileSelect(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image.');
      input.value = '';
      return;
    }

    this.uploading = true;
    try {
      await this.supa.upload(file);
      await this.refresh();
    } catch (e: any) {
      console.error('Upload failed:', e);
      alert(e?.message || 'Upload failed');
    } finally {
      this.uploading = false;
      input.value = '';
    }
  }

  async delete(img: SupaImage, ev?: MouseEvent) {
    ev?.stopPropagation(); // prevent opening lightbox
    if (!confirm('Delete this image?')) return;
    await this.supa.remove(img.name);
    this.images = this.images.filter(i => i.name !== img.name);
  }

  private handlePopState = () => { if (this.isOpen) this.close(); };

  ngAfterViewInit() {}

  open(img: SupaImage) {
    this.selected = img;
    this.isOpen = true;
    history.pushState({ modal: true }, '');
    window.addEventListener('popstate', this.handlePopState);

    setTimeout(() => {
      if (this.pzRef?.nativeElement) {
        this.pz?.destroy?.();
        this.pz = new PinchZoom(this.pzRef.nativeElement, {
          draggableUnzoomed: true,
          minZoom: 1,
          maxZoom: 5,
        });
      }
      document.body.classList.add('lightbox-open');
    });
  }

  close(ev?: MouseEvent) {
    // only close when clicking the backdrop (not inner content)
    if (!ev || (ev.target as HTMLElement).classList.contains('bg-black/90')) {
      this.isOpen = false;
      this.selected = null;
      this.pz?.destroy?.();
      this.pz = undefined;
      document.body.classList.remove('lightbox-open');
      window.removeEventListener('popstate', this.handlePopState);
    }
  }

  ngOnDestroy(): void {
    this.pz?.destroy?.();
    document.body.classList.remove('lightbox-open');
    window.removeEventListener('popstate', this.handlePopState);
  }

  logout() { this.location.back(); }

  // optional: improves ngFor perf
  trackByName = (_: number, img: SupaImage) => img.name;
}
