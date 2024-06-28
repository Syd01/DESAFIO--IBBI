import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments'; // Corrigido o nome do arquivo de ambiente

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl; // Utilize a URL base do ambiente definido em environment.ts

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const url = `${this.apiUrl}/token/`;

    return this.http.post<any>(url, formData);
  }

  async doLogin() {
      const response: any = await this.login("dudu", "12345").toPromise();
        localStorage.setItem('token', response.access_token); // Armazena o token no localStorage


  }

  getToken() {
    let token = this.doLogin();
    return localStorage.getItem('token'); // Obtém o token armazenado no localStorage
  }

  logout() {
    localStorage.removeItem('token'); // Remove o token do localStorage ao fazer logout
  }
}
