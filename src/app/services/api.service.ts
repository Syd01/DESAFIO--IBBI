import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Certifique-se de importar o HttpClient e HttpHeaders

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get(url: string, options: { headers: HttpHeaders }) {
    return this.http.get(url, options);
  }

  post(url: string, body: any, options: { headers: HttpHeaders }) {
    return this.http.post(url, body, options);
  }
  put(url: string, body: any, options: { headers: HttpHeaders }){
    return this.http.put(url, body, options);
  }
}




