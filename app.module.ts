import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatToolbarModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatIconModule, MatCardModule, MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AgentGuard } from './agent.guard';
import { ApiService } from './api.service';
import { TokenInterceptorService } from './token-interceptor.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AgentLoginComponent } from './agent-login/agent-login.component';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { ChatService } from './chat.service';
import { HttpModule } from '@angular/http';
import { NgIf } from '@angular/common';
import { ProjPageComponent } from './proj-page/proj-page.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule, Routes } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { ChatsComponent } from './chats/chats.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerComponent } from './customer/customer.component';
import { MessageComponent } from './message/message.component';
import { MessagesComponent } from './messages/messages.component';
import { ChatboxmessageComponent } from './chatboxmessage/chatboxmessage.component';
import { CookieService } from 'ngx-cookie-service';
import { CustomerEmptyComponent } from './customer-empty/customer-empty.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ArchivesComponent } from './archives/archives.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChatboxPrototypeComponent } from './chatbox-prototype/chatbox-prototype.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { AssignedProjectsComponent } from './assigned-projects/assigned-projects.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { VisitorDetailComponent } from './visitor-detail/visitor-detail.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AgentPipe } from './agent.pipe';
import { DatePipe } from './date.pipe';
import { CountryPipe } from './country.pipe';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { AgentHistoryPipe } from './agent-history.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportComponent } from './report/report.component';
import { ServicesService } from './services.service';

const AppRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  
  { path: "agent-login", component: AgentLoginComponent },
  { path: "agent-chats",component: ChatsComponent, canActivate: [AgentGuard]},
  { path: "agent-dashboard", component: ChatsComponent, canActivate: [AgentGuard] },
  { path: "proj-page/:project_name/:project_Id/:username/:useremail", component: ProjPageComponent },
  { path: "assigned-projects", component: AssignedProjectsComponent },
  { path: "history", component: ArchivesComponent },
  { path: "visitors", component: VisitorsComponent },
  { path: "tickets", component: TicketsComponent },
  { path: "agents", component:  AgentListComponent},
  { path: "reports", component: LandingPageComponent },
  { path: "apps", component: LandingPageComponent },
  
  { path: "subscribe", component: LandingPageComponent },
  { path: "profile", component: LandingPageComponent },
  { path: "notifications", component: LandingPageComponent },
  { path: "help", component:LandingPageComponent},
  { path: "report",component:ReportComponent}
  

];

@NgModule({
  declarations: [
    
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    AgentLoginComponent,
    ProjPageComponent,
    HeaderComponent,
    ChatsComponent,
    CustomersComponent,
    CustomerComponent,
    MessageComponent,
    MessagesComponent,
    ChatboxmessageComponent,
    CustomerEmptyComponent,
    ArchivesComponent,
    VisitorsComponent,
    ChatboxPrototypeComponent,
    ClickOutsideDirective,
    AssignedProjectsComponent,
    TicketsComponent,
    TicketDetailComponent,
    VisitorDetailComponent,
    LandingPageComponent,
    AgentPipe,
    DatePipe,
    CountryPipe,
    AgentDetailComponent,
    AgentListComponent,
    AgentHistoryPipe,
    ReportComponent,
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule, MatToolbarModule, MatCardModule, MatInputModule, MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    HttpModule,
    MatFormFieldModule, MatPaginatorModule,
    RouterModule.forRoot(AppRoutes),
    NgFlashMessagesModule.forRoot(),
    FlashMessagesModule.forRoot(),
    ColorPickerModule,
    Ng2SearchPipeModule
  ],
  entryComponents: [
    CustomerComponent,
    ChatsComponent,
    MessageComponent,
    MessagesComponent,
    ChatboxmessageComponent,
    CustomerEmptyComponent,
    TicketDetailComponent,
    VisitorDetailComponent,
    AgentDetailComponent
  ],
  providers: [AuthGuard, AgentGuard, ApiService, ChatService, CookieService,ServicesService],
  bootstrap: [AppComponent]
})


export class AppModule { }



