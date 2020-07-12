import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agentHistory'
})
export class AgentHistoryPipe implements PipeTransform {
  transform(customdata: any[], value: string): any {

    if (!value) {
      return customdata
    }

    for (let a in customdata) {
      let agentArr = customdata[a]['agent'];

      for (let n in agentArr) {
        if (agentArr[n]['name'] === value) {
          return customdata
        }

      }
    }


  }



}
