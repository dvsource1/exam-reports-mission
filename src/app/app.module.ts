import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BarChartComponent } from './core/components/bar-chart/bar-chart.component';
import { ReportComponent } from './report/report.component';
import { MomentDatePipe } from './core/pipes/moment-date.pipe';

/**
 * Bootstrap module
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@NgModule({
  declarations: [AppComponent, ReportComponent, BarChartComponent, MomentDatePipe],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
})
export class AppModule {}
