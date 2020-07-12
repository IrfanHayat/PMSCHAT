  import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { error } from 'util';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { Http, Headers, ResponseContentType  } from '@angular/http';
import { HttpModule } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})

export class ApiService {


  authToken: any;
  agentToken:any;
  userData: any;
  agent:any;

  constructor(
    private http: Http,
    private router: Router,
    private cookieService: CookieService
  ) { }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  };

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  registerUser(user) {
    return this.http.post('/api/register', user).map(res => res.json())
  }

  storeUserData(token,user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    this.authToken = token;
    this.userData = user; 
  }

  storeAgentData(token,user,id) {
    localStorage.setItem('agent-token', token);
    localStorage.setItem('agent', user);
    localStorage.setItem('agentid', id);
    this.agentToken = token;
    this.agent = user; 
  }


  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateAgent(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/agentlogin', user, {headers: headers})
      .map(res => res.json());
  }

  
  checkChatStatus(project_name) {
    let headers  =  new Headers();
    headers.append('Content-Type', 'application/json');
    var apiUrl = '/api/checkChatStatus';
    const url = `${apiUrl}/${project_name}`;
    return this.http.get(url, {headers: headers})
      .map(res => res.json());
  }

  transferChat(data){
    let headers = new Headers();
    var url = '/api/transferchat';
    return this.http.post(url,data ,{headers: headers}).map(res => res.json());
  }

  getDashboard() {
    let headers = new Headers();
    this.loadToken();
    this.comapanyId();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/api/dashboard', {headers: headers}).map(res => res.json());
  }

  getAgentboard() {
    let headers = new Headers();
    this.loadAgentToken();
    this.AgentId();
    headers.append('Authorization', this.agentToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/api/agent-board', {headers: headers}).map(res => res.json());
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  loadAgentToken() {
    const token = localStorage.getItem('agent-token');
    this.agentToken = token;
  
  }

  comapanyId() {
    const user = localStorage.getItem('user');
    this.userData = user;
  }

  AgentId() {
    const user = localStorage.getItem('agent');
    this.agent= user;
  }

  agentlogout() {
    localStorage.removeItem('agent-token');
    localStorage.removeItem('agent');
  }

  AgentLogout(name): Observable<any> {
    let headers = new Headers();
    var apiUrl = '/api/checkstatus';
    const url = `${apiUrl}/${name}`;
    console.log(name);
    return this.http.post(url, {headers: headers}).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

   loggedIn() {
    return tokenNotExpired('token');
  }



  agentlogIn(){
    return tokenNotExpired('agent-token');
  }


  addproject(data, company_Id) {
    
    let headers = new Headers();
    var apiUrl = '/api/addproject';
    const url = `${apiUrl}/${company_Id}`;
    return this.http.post(url, data, {headers: headers}).map(res => res.json())
    
  }

  removeproject(data) {
    
    let headers = new Headers();
    var url = '/api/removeproject';
    return this.http.post(url, data, {headers: headers}).map(res => res.json())
    
  }

  removeagent(data) {
    
    let headers = new Headers();
    var url = '/api/removeagent';
    return this.http.post(url, data, {headers: headers}).map(res => res.json())
    
  }

  assignAgent(data) {
    
    let headers = new Headers();
    var url = '/api/assignagent';
    return this.http.post(url, data, {headers: headers}).subscribe(res => console.log(res))
    
  }

  updateChatStatus(project_name){
    let headers = new Headers();
    var apiUrl = '/api/updateChatStatus';
    const url = `${apiUrl}/${project_name}`;
    return this.http.put(url, {headers: headers}).map(res => res.json())
  }


  closeChat(chat_Id){
    let headers = new Headers();
    var apiUrl = '/api/closeChat';
    const url = `${apiUrl}/${chat_Id}`;
    return this.http.put(url, {headers: headers}).subscribe(res => {
    })
  }

  get_customer_data(Id){
    let headers = new Headers();
    var apiUrl = '/api/get_customer_data';
    const url = `${apiUrl}/${Id}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }
  
  get_agent_data(){
    let headers = new Headers();
    var apiUrl = '/agent/getAgent';
    const url = `${apiUrl}`;
    return this.http.get(url, {headers: headers}).map(res=>res.json());
  }
  get_all_messages(Id){
    console.log(Id)
    let headers = new Headers();
    var apiUrl = '/api/get_messages';
    const url = `${apiUrl}/${Id}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }

  saveMessage(data,chat_Id){
    let headers = new Headers();
    var apiUrl = '/api/saveMsg';
    const url = `${apiUrl}/${chat_Id}`;
    return this.http.put(url,data,{headers: headers}).subscribe(res => {
      res.json();
    })
  }
  editMessage(data,chat_Id,time){
    
    let headers = new Headers();
    var apiUrl = '/api/update_message';
    const url = `${apiUrl}/${chat_Id}/${time}`;
    return this.http.put(url,data,{headers: headers}).subscribe(res => {
      res.json();
    })
  }


  chat(data, project_Id,project_name) {
    let headers = new Headers();
    var apiUrl = '/api/chat';
    var url = `${apiUrl}/${project_Id}/${project_name}`;
    console.log(data)
    return this.http.post(url, data, {headers: headers}).map(res => res.json())
  }

  addagent(data, company_Id) {
    let headers = new Headers();
    var apiUrl = '/api/addagent';
    var url = `${apiUrl}/${company_Id}`;
    return this.http.post(url, data, {headers: headers}).map(res => res.json());
  }

  assign(data, project_Id) {
    let headers = new Headers();
    var apiUrl = '/api/assignProj';
    var url = `${apiUrl}/${project_Id}`;
    return this.http.put(url, data, {headers: headers}).map(res => res.json())
  }

  getProjects(company_Id): Observable<any> {
    let headers = new Headers();
    var apiUrl = '/api/project';
    const url = `${apiUrl}/${company_Id}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }
  getAgentData_ID(agentId){
    let headers = new Headers();
    var apiUrl = '/api/agents-detail';
    const url = `${apiUrl}/${agentId}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }
  assignedProjects(data): Observable<any> {
    let headers = new Headers();
    var url = '/api/assigned-projects';
    return this.http.post(url,data, {headers: headers}).map(res => res.json());
  }

  getContacts(): Observable<any> {
    let headers = new Headers();
    var apiUrl = '/api/find_customers';
    const url = `${apiUrl}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }

  getVisitors(skip): Observable<any> {
    let headers = new Headers();
    var url = `/api/getVisitors/${skip}`
 
    return this.http.get(url,{headers: headers}).map(res => res.json());
  }

   getVisitorDetail(visitorId): Observable<any> {
    let headers = new Headers();
    var url = `/api/getVisitor/${visitorId}`
    return this.http.get(url,{headers: headers}).map(res => res.json());
  }

  get_message(chat_Id): Observable<any> {
    let headers = new Headers();
    var apiUrl = '/api/get_message';
    const url = `${apiUrl}/${chat_Id}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }

  getDigieUser(){
    let headers = new Headers();
  
    return this.http.get("https://app.digiebot.com/admin/api/get_session_api", {headers:headers}).map((response) => response.json())
  }

  sendTranscript(data){
    let headers = new Headers();
    var url = '/api/email_transcript';
    return this.http.post(url,data, {headers: headers}).map(res => res.json());
  }


  downloadFile() {
    return this.http
      .post('/api/email_transcript', {
        responseType: ResponseContentType.Blob
      })
      .map(res => {
        return {
          filename: 'sent-mail.png',
          data: res.blob()
        };
      })
      .subscribe(res => {
          console.log('start download:',res);
          var url = window.URL.createObjectURL(res.data);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = res.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        }, error => {
          console.log('download error:', JSON.stringify(error));
        }, () => {
          console.log('Completed file download.')
        });
  }



  getTicket(): Observable<any> {
    let headers = new Headers();
    return this.http.get('/api/getTicket', {headers: headers}).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  

  Agent(company_Id): Observable<any> {
    let headers = new Headers();
    var apiUrl = '/api/agent';
    const url = `${apiUrl}/${company_Id}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }


  getAgent(project_id): Observable<any> {
    
    let headers = new Headers();
    var apiUrl = '/api/agentName';
    const url = `${apiUrl}/${project_id}`;
    return this.http.get(url, {headers: headers}).map(res =>res.json());

  }

  getAllAgents(): Observable<any> {
    let headers = new Headers();
    headers.append('x-access-token',localStorage.getItem('agent-token'))
    var url = '/api/agents';
    return this.http.get(url, {headers: headers}).map(res =>res.json());
  }


  
  findChat(agent_name): Observable<any> {
    let headers = new Headers();
    headers.append('x-access-token',localStorage.getItem('agent-token'))
    var apiUrl = '/api/find';
    const url = `${apiUrl}/${agent_name}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }


  agentData(agent_name): Observable<any> {
    let headers = new Headers();
    var apiUrl = '/api/agentData';
    const url = `${apiUrl}/${agent_name}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }

  companyData(company_Id): Observable<any> {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    var apiUrl = '/api/companyData';
    const url = `${apiUrl}/${company_Id}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }

  getAgentName(name): Observable<any> {
    let headers = new Headers();
    var apiUrl = '/api/agentName';
    const url = `${apiUrl}/${name}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());

  }

  getProject(name): Observable<any> {
    let headers = new Headers();
    console.log(name)
    var apiUrl = '/api/project';
    const url = `${apiUrl}/${name}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }


  saveMsg(data) {
    this.http.post('/api/msg', data).subscribe(res => {
      console.log(res);
    })
  }

  getMsg(): Observable<any> {
    let headers = new Headers();
    return this.http.get('/api/getmsg', {headers: headers}).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  updateColorsAdmin(data) {
    return this.http.post('/api/update-colors', data).map(res => res.json())
  }

  getProjectDetail(id){
    let name=0; 
    var url = `/api/get-project/${id}`
    return this.http.get(url).map(res => res.json())
  }
  
  getPmsTickets(skip): Observable<any> {
    let headers = new Headers();
    var url = `https://updatemedaily.com/webServices/getTickets/${skip}`; // Get project Names and Employee names
    return this.http.get(url,{headers: headers}).map(res => res.json());
  }

  getTicketDetail(ticketId): Observable<any> {
    let headers = new Headers();
    var apiUrl = 'https://updatemedaily.com/webServices/getTicket';
    const url = `${apiUrl}/${ticketId}`;
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }

  getAssignedAgent(chatid){

    var url = `/api/get-assigned-agent/${chatid}`
    return this.http.get(url).map(res => res.json())
  }

  getPmsEmpAndProjects(): Observable<any> {
    let headers = new Headers();
    var url = 'https://updatemedaily.com/webServices/endpoints/get-ticket-details'; // Get project Names and Employee names
    return this.http.get(url,{headers: headers}).map(res => res.json());
  }

  submitTicketPms(data): Observable<any> {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Headers', '*');
    headers.append('Access-Control-Allow-Methods', '*');
    headers.append('Access-Control-Allow-Origin', '*');
    var url = 'https://updatemedaily.com/webServices/endpoints/submit-ticket'; // Get project Names and Emplyee names
    return this.http.post(url,data,{headers: headers}).map(res => res.json());
  }
  
  submitTicket(data): Observable<any> {
    let headers = new Headers();
    var url = '/api/tickets'; // Get project Names and Emplyee names
    return this.http.post(url,data,{headers: headers}).map(res => res.json());
  }


  sendTicketEmail(data){
    let headers = new Headers();
    var url = '/api/email_ticket_details'; // Get project Names and Emplyee names
    return this.http.post(url,data,{headers: headers}).map(res => res.json());
  }
  
  getCustomerData(email): Observable<any> {
    let headers = new Headers();
    var url = '/api/get-customer-data';
    return this.http.post(url,{email:email},{headers: headers}).map(res => res.json());
  }
  
  getAgentData(): Observable<any> {
    let headers = new Headers();
    var url = '/api/agents-detail';
    return this.http.get(url,{headers: headers}).map(res => res.json());
  }

  
  
}


