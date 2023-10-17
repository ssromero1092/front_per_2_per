import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

const urlAPI = environment.apiURL;
const endpoint = 'chat';


@Injectable({
  providedIn: 'root'
})
export class ApiChatService {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private http: HttpClient,
  ) { }

  public getChat(): Observable<{}> {
    const strEndPoint = urlAPI + endpoint;
    return this.http.get<Response>(strEndPoint, {});
  }

  public postChat(usuario:string,valor_entrada:number,tipo_mensaje:string): Observable<{}> {
    const strEndPoint = urlAPI + endpoint;
      return this.http.post<Response>(strEndPoint, { usuario,valor_entrada,tipo_mensaje }, {  observe: 'response' })
  }
}
