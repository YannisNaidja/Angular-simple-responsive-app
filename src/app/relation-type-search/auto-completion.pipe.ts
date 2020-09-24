import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autoCompletion'
})
export class AutoCompletionPipe implements PipeTransform {

    transform(items: String[], filterQueries: any): String[] {
        if (!items) return [];
        if (filterQueries.length === 0) return items;
        
        const filters = [];
        for (const filter of filterQueries) {
          filters.push(filter.value.toLowerCase());
        }
        return items.filter(item => {
          return filters.includes(item);
        });
      }
}
