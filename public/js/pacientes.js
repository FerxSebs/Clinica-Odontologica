document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const buscarInput = document.getElementById('buscarPaciente');
    const tablaResultados = document.querySelector('table tbody');
    let timeoutId;

    // Función para buscar pacientes
    async function buscarPacientes(query) {
        if (!query) {
            cargarTodosPacientes();
            return;
        }

        try {
            const response = await fetch(`/api/pacientes/buscar?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            actualizarTablaPacientes(data);
        } catch (error) {
            console.error('Error al buscar pacientes:', error);
            mostrarMensaje('Error al buscar pacientes. Por favor, intente nuevamente.', 'danger');
        }
    }

    // Función para cargar todos los pacientes
    async function cargarTodosPacientes() {
        try {
            const response = await fetch('/api/pacientes');
            const data = await response.json();
            actualizarTablaPacientes(data);
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
            mostrarMensaje('Error al cargar la lista de pacientes.', 'danger');
        }
    }

    // Función para actualizar la tabla de pacientes
    function actualizarTablaPacientes(pacientes) {
        if (!tablaResultados) return;

        tablaResultados.innerHTML = '';
        
        if (pacientes.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="6" class="text-center">No se encontraron pacientes</td>';
            tablaResultados.appendChild(tr);
            return;
        }

        pacientes.forEach(paciente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${paciente.identificacion}</td>
                <td>${paciente.nombre}</td>
                <td>${paciente.telefono}</td>
                <td>${paciente.email}</td>
                <td>${paciente.ultimaCita || 'Sin citas'}</td>
                <td>
                    <div class="btn-group">
                        <a href="/pacientes/${paciente.id}" class="btn btn-sm btn-info">
                            <i class="fa-regular fa-eye me-1"></i>Ver
                        </a>
                        <a href="/pacientes/${paciente.id}/editar" class="btn btn-sm btn-primary">
                            <i class="fa-regular fa-edit me-1"></i>Editar
                        </a>
                        <a href="/historial/${paciente.id}" class="btn btn-sm btn-success">
                            <i class="fa-regular fa-file-lines me-1"></i>Historial
                        </a>
                    </div>
                </td>
            `;
            tablaResultados.appendChild(tr);
        });
    }

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 5000);
    }

    // Event Listeners
    if (buscarInput) {
        buscarInput.addEventListener('input', function(e) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                buscarPacientes(e.target.value.trim());
            }, 300);
        });
    }

    // Validación del formulario de registro/edición
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                mostrarMensaje('Por favor, complete todos los campos requeridos.', 'danger');
            }
            form.classList.add('was-validated');
        });
    }

    // Cargar pacientes al iniciar
    if (tablaResultados) {
        cargarTodosPacientes();
    }
}); 