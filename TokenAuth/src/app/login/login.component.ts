import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  submitForm() {
    console.log('submit clicked', this.loginForm.controls['userName'].value, this.loginForm.controls['password'].value);
    this.authService.login(this.loginForm.controls['userName'].value, this.loginForm.controls['password'].value).subscribe( (data : UserModel) =>{
      console.log('trigger call', data);
      localStorage.setItem('authToken', data.accessToken);
    });
  }

  secureCall() {
    this.authService.secureCall().subscribe( (result) => {
      console.log('Success:' + result);
    }, (error) => {
      console.log('Error:' + error);
    })

  }

}
