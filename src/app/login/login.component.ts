import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  displayRegisterDialog: boolean = false;

  formLogin = new FormGroup({
    login: new FormControl(''),
    senha: new FormControl(''),
  });

  constructor(private loginService: LoginService, private router:Router) { }

  logar() {
    console.log(this.formLogin.value);
    const username = this.formLogin.get('login')?.value as string;
    const password = this.formLogin.get('senha')?.value as string;

    if (username && password) {
      this.loginService.getLogin(username, password).subscribe(
        (response) => {
          console.log('LOGADO COM SUCESSO', response);
          const data:any=response;


          localStorage.setItem('idusuario',data.usuario.idlogin.toString());
          localStorage.setItem('loginusuario',data.usuario.login_usuario.toString());
          this.router.navigate(['home']);
        },
        (error) => {
          console.error('ERRO AO LOGAR', error);
        }
      );
    } else {
      console.error('LOGIN OU SENHA ERRADOS');
    }
  }
}
