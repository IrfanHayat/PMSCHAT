import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agent'
})
export class AgentPipe implements PipeTransform {

  transform(customdata: any[], value:string): any {
     if(!value){
      return  customdata
     }
     console.log(customdata)
        return customdata.filter(data=> data.name===value)
  }
   
}
