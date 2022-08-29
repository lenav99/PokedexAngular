import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommunicationHelper } from './CommunicationHelper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  title = 'my-app';
  constructor(private http: HttpClient) {
  }

  getGeneration(id: number) {
    const comHelper = new CommunicationHelper()
    comHelper.getGeneration(id, this.http)
  }





}


