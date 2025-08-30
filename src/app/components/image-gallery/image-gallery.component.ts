import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { GalleryItem } from '../../models/gallery-item.model';
import PinchZoom from 'pinch-zoom-js';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss'
})
export class ImageGalleryComponent implements AfterViewInit, OnDestroy {
  images: GalleryItem[] = [
    { src: 'assets/images/10.jpg', alt: '10' },
    { src: 'assets/images/11.jpg', alt: '11' },
    { src: 'assets/images/1.jpg', alt: '1' },
    { src: 'assets/images/2.jpg', alt: '2' },
    { src: 'assets/images/3.jpg', alt: '3' },
    { src: 'assets/images/4.jpg', alt: '4' },
    { src: 'assets/images/5.jpg', alt: '5' },
    { src: 'assets/images/6.jpg', alt: '6' },
    { src: 'assets/images/7.jpg', alt: '7' },
    { src: 'assets/images/8.jpg', alt: '8' },
    { src: 'assets/images/9.jpg', alt: '9' },
  
   
  ];

  isOpen = false;
  selected: GalleryItem | null = null;

  @ViewChild('pz') pzRef?: ElementRef<HTMLElement>;
  private pz?: PinchZoom;

  private handlePopState = () => {
    if (this.isOpen) {
      this.close(); // only closes the modal, not the component
      // Do NOT call history.back() again here — it would cause double back
    }
  };

  constructor(private location: Location) {}

  ngAfterViewInit() {}

  open(img: GalleryItem) {
    this.selected = img;
    this.isOpen = true;

    // Push a dummy state when modal opens
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
    if (!ev || (ev.target as HTMLElement).classList.contains('bg-black/90')) {
      this.isOpen = false;
      this.selected = null;
      this.pz?.destroy?.();
      this.pz = undefined;

      document.body.classList.remove('lightbox-open');

      // Remove popstate listener
      window.removeEventListener('popstate', this.handlePopState);

      // Do not call history.back(), just close the modal
    }
  }

  ngOnDestroy(): void {
    this.pz?.destroy?.();
    document.body.classList.remove('lightbox-open');
    window.removeEventListener('popstate', this.handlePopState);
  }
  logout(){
    this.location.back();
  }
}
