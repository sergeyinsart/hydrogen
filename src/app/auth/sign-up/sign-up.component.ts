import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../auth.service';
import {User} from '../user';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

// TODO - correct success / error messages

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  authForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
  }

  submit() {
    const newUser = Object.assign(new User(), {
      email: this.authForm.value.email,
      first_name: this.authForm.value.first_name,
      last_name: this.authForm.value.last_name,
      username: this.authForm.value.email
    });

    this.authService.createUser(newUser)
      .then(() => {
        this.snackBar.open('Success');
        this.router.navigate(['/login']);

        return this.authService.createPassword(newUser.username, this.authForm.value.password);
      })
      .catch(() => {
        this.snackBar.open('Error');
      });
  }

}
