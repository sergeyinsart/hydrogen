import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../auth.service';
import {User} from '../user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  submit() {
    this.authService.getToken()
      .subscribe((data) => {
        console.log(data);
      });
  }

}
