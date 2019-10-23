import { Component, ElementRef, OnInit } from '@angular/core';
import {ToolbarService} from '../services/toolbar-service';
import {DemoService } from '../services/demo-service';
import { HaloService} from "../services/halo-service";
import * as joint from '../../vendor/rappid';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rappid Demo App';
  private rappid: any;
  constructor (private http: HttpClient, private  element: ElementRef) {
  }

  ngOnInit() {
    this.rappid = new DemoService (this.http, this.element.nativeElement, new ToolbarService(), new HaloService());
    this.rappid.startRappid();
  }


}

