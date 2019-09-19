import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../auth.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

// TODO need to correct messages
// TODO need to add client validation

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }

    this.auth.login(this.form.value.username, this.form.value.password)
      .then(() => {
        return this.router.navigate(['/dashboard']);
      })
      .catch(() => {
        this.snackBar.open('Error');
      });
  }

  ngOnInit() {
  }

}
