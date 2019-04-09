import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../../services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import  swal  from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente:Cliente = new Cliente();
  private titulo:string = "Crear cliente";
  private errores : string [];

  constructor(private clienteService: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.clienteService.getCliente(id).subscribe( cliente => this.cliente = cliente)
        }
      }
    )
  }

  create (): void {
    this.clienteService.create(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        swal('Nuevo cliente',`Cliente ${response.nombre} creado con exito!!`, 'success')
      }, err => {
        console.log(err);
        this.errores = err.error.error as string [];
      }
    )
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/clientes']);
        swal('Cliente actualizado',`${response.mensaje}: ${response.cliente.nombre}`, 'success')
      }, err => {
        this.errores = err.error.error as string [];
        console.error('Codigo de error desde el backend: ' + err.status);
        console.error(err.error.error);
        
      }
    )
  }

}
