import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { OptionEntry, DataSource } from '../obs-autocomplete/';

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  hours_worked: number;
  hourly_wage: number;
}

const apiURL = 'https://api.angularbootcamp.com/employees';

@Component({
  selector: 'obs-demo-3-real-api',
  templateUrl: './demo-3-real-api.component.html'
})
export class Demo3RealApiComponent {
  ours = new FormControl(null, [Validators.required]);
  dataSource: DataSource;

  constructor(http: HttpClient) {
    // This data source connects to an API we have posted on the Internet for
    // demonstrations and use in our Angular Boot Camp class.

    this.dataSource = {
      displayValue(value: any): Observable<OptionEntry | null> {
        if (typeof value === 'string') {
          value = parseInt(value, 10);
        }
        if (typeof value !== 'number') {
          return of(null);
        }

        return http.get<Employee>(apiURL + '/' + value).pipe(
          map(e => ({
            value: e.id,
            display: `${e.first_name} ${e.last_name} (${e.email})`,
            details: {}
          }))
        );
      },
      search(term: string): Observable<OptionEntry[]> {
        return http.get<Employee[]>(apiURL, {
          params: {
            q: term || '',
            _sort: 'last_name,first_name'
          }
        }).pipe(
          map(list => list.map(e => ({
            value: e.id,
            display: `${e.first_name} ${e.last_name} (${e.email})`,
            details: {}
          }))));
      }
    };
  }
}
