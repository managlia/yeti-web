import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardLandingComponent} from './views/dashboard-landing/dashboard-landing.component';
import {CompanyDetailsComponent} from './views/company-details/company-details.component';
import {ContactDetailsComponent} from './views/contact-details/contact-details.component';
import {CampaignDetailsComponent} from './views/campaign-details/campaign-details.component';
import {ActionDetailsComponent} from './views/action-details/action-details.component';
import {EmailDetailsComponent} from './views/email-details/email-details.component';
import {AttachmentDetailsComponent} from './views/attachment-details/attachment-details.component';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'components',
        loadChildren: './views/components/components.module#ComponentsModule'
      },
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'widgets',
        loadChildren: './views/widgets/widgets.module#WidgetsModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'company',
        component: CompanyDetailsComponent
      },
      {
        path: 'company/:id',
        component: CompanyDetailsComponent
      },
      {
        path: 'company/add/:entity/:entityId',
        component: CompanyDetailsComponent
      },
      {
        path: 'contact',
        component: ContactDetailsComponent
      },
      {
        path: 'contact/:id',
        component: ContactDetailsComponent
      },
      {
        path: 'contact/add/:entity/:entityId',
        component: ContactDetailsComponent
      },
      {
        path: 'campaign',
        component: CampaignDetailsComponent
      },
      {
        path: 'campaign/:id',
        component: CampaignDetailsComponent
      },
      {
        path: 'campaign/add/:entity/:entityId',
        component: CampaignDetailsComponent
      },
      {
        path: 'attachment',
        component: AttachmentDetailsComponent
      },
      {
        path: 'action',
        component: ActionDetailsComponent
      },
      {
        path: 'action/:id',
        component: ActionDetailsComponent
      },
      {
        path: 'email',
        component: EmailDetailsComponent
      },
      {
        path: 'email/:id',
        component: EmailDetailsComponent
      },
      {
        path: 'action/add/:entity/:entityId',
        component: ActionDetailsComponent
      },
      {
        path: 'dl',
        component: DashboardLandingComponent
      },
      {
        path: 'dl/:coc/:id',
        component: DashboardLandingComponent
      }
    ]
  },
  {
    path: 'pages',
    component: SimpleLayoutComponent,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: '',
        loadChildren: './views/pages/pages.module#PagesModule',
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
