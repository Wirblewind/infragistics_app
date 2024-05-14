import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxActionStripModule, IgxAvatarComponent, IgxButtonModule, IgxDropDownModule, IgxFilterPipe, IgxFocusModule, IgxGridComponent, IgxGridModule, IgxIconComponent, IgxIconModule, IgxInputDirective, IgxInputGroupComponent, IgxInputGroupModule, IgxListComponent, IgxListItemComponent, IgxNavbarModule, IgxNavigationDrawerModule, IgxPaginatorComponent, IgxPrefixDirective, IgxSuffixDirective, IgxToggleModule } from 'igniteui-angular';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TasksComponent } from './pages/tasks/tasks.component';
import { NavMenuComponent } from './shared/nav-menu/nav-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { IgxDataChartAnnotationModule, IgxDataChartCategoryCoreModule, IgxDataChartCategoryModule, IgxDataChartCoreModule, IgxDataChartInteractivityModule, IgxDataChartVerticalCategoryModule, IgxDoughnutChartModule, IgxItemLegendModule, IgxPieChartModule } from 'igniteui-angular-charts';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    NavMenuComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IgxPaginatorComponent,
    IgxFilterPipe,
    IgxNavbarModule,
    IgxNavigationDrawerModule,
    HammerModule,
    IgxIconModule,
    HttpClientModule,
    IgxGridModule,
    IgxActionStripModule,
    IgxInputGroupModule,
    IgxFocusModule,
    IgxButtonModule,
    IgxDropDownModule,
    IgxToggleModule,
    IgxItemLegendModule,
    IgxPieChartModule,
    IgxDoughnutChartModule,
    IgxDataChartCoreModule,
    IgxDataChartCategoryCoreModule,
    IgxDataChartCategoryModule,
    IgxDataChartAnnotationModule,
    IgxDataChartInteractivityModule,
    IgxDataChartVerticalCategoryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
