import { Injectable } from '@angular/core';
import { Cliente } from '../components/clientes/cliente';
import { CLIENTES } from '../components/clientes/clientes.json';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import  swal  from 'sweetalert2';
import { Router } from '@angular/router'
import {formatDate, DatePipe}from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'contentType':'application/json'});

  constructor(private httpClient:HttpClient, private router: Router ) { }
/*
  getClientes(): Observable<Cliente[]> {
    // return of(CLIENTES);//Convertimos el listado de clientes en un observable
    //return this.httpClient.get<Cliente[]>(this.urlEndPoint);//forma 1
    
    return this.httpClient.get(this.urlEndPoint).pipe(
      map ( response => {
          let clientes = response as Cliente[] ;
          
          return clientes.map( cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            
            //forma 1 para formatear fecha
            //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
            
            //forma 2 para foramtear fecha
            let datePipe = new DatePipe('es');//codigo registrado en app.modules.ts
            //cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy');
            cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
            //foramto de fecha. dia de la semana EEE(nombre de las semana abreviado) o EEEE(nombre de las semana completo)
            // MMM (mes de año abreviado), MMMM(mes de año completo).
            // 'EEE dd/MM/yyyy'

            return cliente;
          })
        } 
      ) );//forma 2
      
  }*/


  getClientes(page:number): Observable<any> {    
    return this.httpClient.get(this.urlEndPoint + '/page/' + page).pipe(
      tap( (response:any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map ( (response:any) => {
          (response.content as Cliente[]).map( cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            let datePipe = new DatePipe('es');//codigo registrado en app.modules.ts
            cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
            return cliente;
          })
          return response;
        }),
      tap( (response:any) => {
          console.log('ClienteService: tap 2');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          })
        })
    );
      
  }


/*
  create(cliente: Cliente): Observable<any> {
    console.log('creating a new client!!');
    return this.httpClient.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e);
        swal('Error al crear!!', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
*/
create(cliente: Cliente): Observable<Cliente> {
  console.log('creating a new client!!');
  return this.httpClient.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
    map((response:any) => response.cliente as Cliente),
    catchError(e => {
      
      if(e.status == 400 ){
        return throwError(e);
      }
      
      console.log(e);
      swal('Error al crear!!', e.error.mensaje, 'error');
      return throwError(e);
    })
  );
}
  getCliente(id): Observable<any> {
    return this.httpClient.get<any>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal('Error al editar al cliente!!', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente ): Observable<any> {
    return this.httpClient.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers:this.httpHeaders}).pipe(
      catchError(e => {
        
        if(e.status == 400 ){
          return throwError(e);
        }

        console.log(e);
        swal('Error al actualizar al cliente !!', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e);
        console.error(e.error.mensaje);
        swal('Error al eliminar al cliente!!', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

}
