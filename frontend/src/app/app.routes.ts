import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { DocsComponent } from './components/docs/docs.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'docs', component: DocsComponent },
  { path: '**', redirectTo: '' }
];
