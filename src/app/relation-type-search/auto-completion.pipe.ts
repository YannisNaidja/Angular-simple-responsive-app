import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Pipe({
  name: 'autoCompletion'
})
export class AutoCompletionPipe implements PipeTransform {

    transform(items: string[], filterQuery: FormControl): string[] {
    
        console.log("hiiiiiiiiii");
        console.log(items);
        
        if (!items) return null;
        if (!filterQuery) {
            if (filterQuery.value.length < 3) return items;
        }
        
        console.log(filterQuery.value);
        console.log("mais non là");
        
        return items.filter((item : string) => {
            return item.toLowerCase().indexOf(filterQuery.value) === 0;
        });
      }
}
