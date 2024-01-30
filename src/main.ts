import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ToDoCommonModule } from './app/modules/to-do-commun/to-do-common.module';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  // platformBrowserDynamic().bootstrapModule(ToDoCommonModule)
  // .catch(err => console.log(err));
