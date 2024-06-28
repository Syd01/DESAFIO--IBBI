import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'restaurante';
constructor(private router:Router){

}
ngOnInit(){
  let id= localStorage.getItem('idusuario');
  if(id){
    this.router.navigate(['home']);
  }else{
    this.router.navigate(['login']);
  }
}
}
