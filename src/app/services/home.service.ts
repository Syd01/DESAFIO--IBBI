
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environments'; // Importe environmentimport { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private api:ApiService,private auth:AuthService,private http:HttpClient) { }

  private apiUrl=environment.apiUrl;
  private exchangeRateApiUrl = 'https://api.exchangerate-api.com/v4/latest/BRL'; // URL da API de taxa de câmbio

  getPrato() {
    const token = this.auth.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/pratos/`;
    return this.api.get(url, httpOptions);
  }

  getExchangeRate(): Observable<number> {
    return this.http.get(this.exchangeRateApiUrl).pipe(
      map((data: any) => data.rates.USD)
    );
  }
  postTipos(TiposData: { descricao: string }) { // Corrigido para receber descricao como string
    const token = this.auth.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/tipos/`;
    return this.api.post(url, TiposData, httpOptions); // Utiliza método POST ao invés de PUT para criar nova categoria
  }
  getTipos() {
    const token = this.auth.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/tipos/`;
    return this.api.get(url, httpOptions);
  }

  postPratos(PratoData: any ) { // Corrigido para receber descricao como string
    const token = this.auth.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/pratos/`;
    return this.api.post(url, PratoData, httpOptions); // Utiliza método POST ao invés de PUT para criar nova categoria
  }

  postCompra(pratoId: number, compraData: { quantidade: number }) {
    const token = this.auth.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/prato_compra/${pratoId}`;
    return this.api.put(url, compraData, httpOptions);
  }




}
