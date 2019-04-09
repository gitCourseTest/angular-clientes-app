import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../../services/cliente.Service';
import  swal  from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes : Cliente[];

  constructor(private clienteService:ClienteService, private activatedRoute:ActivatedRoute ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let page:number = +params.get('page');//anteponiendole el signo +, automaticamtne se convierte a numero
      if(!page){
        page = 0;
      }
      // this.clientes = this.clienteService.getClientes();
      this.clienteService.getClientes(page)
      .pipe(
          tap(response => {
            console.log('ClienteComponent: tap 3');
            (response.content as Cliente[]).forEach(cliente => {
              console.log(cliente.nombre);
            });
          })
      )
      .subscribe(
        response => this.clientes = response.content as Cliente[]
        /*function (resultado) {//estp es lo mismo que en la funcion de flecha
            this.clientes = resultado;
        }*/
      );
    })
  }

  delete (cliente: Cliente ): void {
    swal({
      title: 'Estas seguro?',
      text: `Seguro que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swal(
              'Cliente eliminado!',
              `Cliente ${cliente.nombre} eliminado con exito!`,
              'success'
            )
          }
        )
      }
    })

  }

}
