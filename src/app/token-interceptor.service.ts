import { Injectable,Injector } from '@angular/core';
import {HttpInterceptor} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private injector :Injector) { }
  intercept(req,next){
    
    let tokenizedReq  = req.clone({
      setHeaders:{
        Authorization : `Bearer ${localStorage.getItem('token')}`
      }
    })
    return next.handle(tokenizedReq);
  }
}
