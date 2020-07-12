import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatToolbarModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatIconModule, MatCardModule, MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app/app.component';
import { RegisterComponent } from './app/register/register.component';
import { LoginComponent } from './app/login/login.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { AuthGuard } from './app/auth.guard';
import { AgentGuard } from './app/agent.guard';
import { ApiService } from './app/api.service';
import { TokenInterceptorService } from './app/token-interceptor.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AgentLoginComponent } from './app/agent-login/agent-login.component';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { ChatService } from './app/chat.service';
import { HttpModule } from '@angular/http';
import { NgIf } from '@angular/common';
import { ProjPageComponent } from './app/proj-page/proj-page.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule, Routes } from '@angular/router';

import { HeaderComponent } from './app/header/header.component';
import { ChatsComponent } from './app/chats/chats.component';
import { CustomersComponent } from './app/customers/customers.component';
import { CustomerComponent } from './app/customer/customer.component';
import { MessageComponent } from './app/message/message.component';
import { MessagesComponent } from './app/messages/messages.component';
import { ChatboxmessageComponent } from './app/chatboxmessage/chatboxmessage.component';
import { CookieService } from 'ngx-cookie-service';
import { CustomerEmptyComponent } from './app/customer-empty/customer-empty.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ArchivesComponent } from './app/archives/archives.component';
import { VisitorsComponent } from './app/visitors/visitors.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChatboxPrototypeComponent } from './app/chatbox-prototype/chatbox-prototype.component';
import { ClickOutsideDirective } from './app/click-outside.directive';
import { AssignedProjectsComponent } from './app/assigned-projects/assigned-projects.component';
import { TicketsComponent } from './app/tickets/tickets.component';
import { TicketDetailComponent } from './app/ticket-detail/ticket-detail.component';
import { VisitorDetailComponent } from './app/visitor-detail/visitor-detail.component';
import { LandingPageComponent } from './app/landing-page/landing-page.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


const AppRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "agent-login", component: AgentLoginComponent },
  { path: "agent-dashboard", component: ChatsComponent, canActivate: [AgentGuard]},
  { path: "proj-page", component: ProjPageComponent },
  { path: "assigned-projects", component: AssignedProjectsComponent },
  { path: "history", component: ArchivesComponent },
  { path: "visitors", component: VisitorsComponent },
  { path: "tickets", component: TicketsComponent },
  { path: "agents", component: LandingPageComponent },
  { path: "chats", component: LandingPageComponent },
  { path: "subscribe", component: LandingPageComponent },
  { path: "profile", component: LandingPageComponent },
  { path: "notifications", component: LandingPageComponent },
  { path: "help", component:LandingPageComponent},
  { path:"reports",component:LandingPageComponent} 

  

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
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    HttpClientModule,
    ReactiveFormsModule,
    
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
    VisitorDetailComponent
  ],
  providers: [AuthGuard, AgentGuard, ApiService, ChatService, CookieService],
  bootstrap: [AppComponent]
})


export class AppModule { }



