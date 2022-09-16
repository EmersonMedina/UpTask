import axios from 'axios'; 
import Swal from 'sweetalert2'; 
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes'); 

if (tareas) {
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')) {
            //Estraer el id de la tarea
            const icono = e.target; 
            const idTarea = icono.parentElement.parentElement.dataset.tarea; 

            ///Request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url, { idTarea })
                .then(response => {
                    if (response.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }

        //Cuando selecciona el icono eliminar 
        if (e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement, 
                  idTarea = tareaHTML.dataset.tarea;
            Swal.fire({
                title: '¿Deseas borrar esta tarea?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí borrarla',
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) { 
                    //Enviar petición a axios 
                    const url = `${location.origin}/tareas/${idTarea} `; 

                    axios.delete(url, { params: { idTarea }})
                        .then(function (respuesta) {
                            if (respuesta.status === 200) {
                                Swal.fire(
                                    'Borrado!',
                                    respuesta.data,
                                    'success'
                                )

                                //Eliminar el nodo
                                tareaHTML.remove(); 
                                actualizarAvance();
                            }

                           
                        })
                        .catch(error => {
                            Swal.fire( {
                                icon: 'error', 
                                title: 'Hubo un error', 
                                text: 'No se pudo eliminar la tarea'
                            })
                        })
                }
            })

        }
    })
}


export default tareas; 