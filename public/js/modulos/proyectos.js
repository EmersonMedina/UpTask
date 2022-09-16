import Swal from 'sweetalert2'; 
import axios from 'axios'; 

const btnEliminar = document.querySelector('#eliminar-proyecto'); 

if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl; 

        Swal.fire({
            title: '¿Deseas borrar este proyecto?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí borrarlo',
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                //Enviar petición a axio 
                const url = `${location.origin}/proyectos/${urlProyecto} `; 
                
                axios.delete(url, { params: { urlProyecto }})
                    .then(function (respuesta) {
                        console.log(respuesta);

                        Swal.fire(
                            'Borrado!',
                            respuesta.data,
                            'success'
                        )
                
                        //Redireccionar al inicio
                        window.location.href = '/'
                    })
                    .catch(error => {
                        Swal.fire( {
                            icon: 'error', 
                            title: 'Hubo un error', 
                            text: 'No se pudo eliminar el Proyecto'
                        })
                    })

                
            }
          })
    })
}

export default btnEliminar;
