import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {
  transform(visitors: any[], value:string): any {
    if(!value){
      return visitors;
    }
    
     return visitors.filter(data=>data.location.country===value)
  }
  

}
