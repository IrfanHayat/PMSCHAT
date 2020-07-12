import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date1'
})
export class DatePipe implements PipeTransform {
  transform(customdata: any[], value:string): any {
   if(!value){
     return customdata
   }    
  return customdata.filter(data=>data.user_name===value)
}
 
}
