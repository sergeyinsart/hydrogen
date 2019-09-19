import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit {
  private userName: string;

  constructor(private auth: AuthService) {
    this.userName = `${auth.currentUser.first_name} ${auth.currentUser.last_name}`;
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
  }

}
