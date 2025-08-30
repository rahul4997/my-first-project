import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';


export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'gallery',
    component: ImageGalleryComponent,
  },
];
