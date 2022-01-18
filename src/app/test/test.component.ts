import {Component, ErrorHandler, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  _value: string = '';

  // Importing the HttpClient into your component and adding it to the constructor() params.
  // I need to import it into app.module.
  // I also need to declare it into the test module (spec.ts)

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
  }

  synchroneValue() {
    this._value = "valueAfterSynchrone";
    return this._value;
  }

  async valueAfterA(): Promise<string> {
    try {
      this._value = "valueAfterAsynchrone";
    } catch (error) {
      console.error(error);
    }
    return this._value;
  };

  async changeValueWithHttpClient() {
    return this.httpClient.get<string>('fakeUrl').subscribe(result => {
      this._value = result;
    })
  }

}

