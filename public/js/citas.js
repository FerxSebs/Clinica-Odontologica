document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const servicioSelect = document.getElementById('servicio_id');
    const personalSelect = document.getElementById('personal_id');
    const fechaInput = document.getElementById('fecha_hora');
    const form = document.querySelector('form');

    // Establecer fecha mínima como hoy
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    fechaInput.min = today.toISOString().slice(0, 16);

    // Manejar cambios en el selector de servicio
    if (servicioSelect) {
        servicioSelect.addEventListener('change', function() {
            console.log('Servicio seleccionado:', this.value);
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption) {
                console.log('Servicio texto:', selectedOption.text);
            }
        });
    }

    // Manejar cambios en el selector de personal
    if (personalSelect) {
        personalSelect.addEventListener('change', function() {
            console.log('Personal seleccionado:', this.value);
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption) {
                console.log('Personal texto:', selectedOption.text);
            }
        });
    }

    // Manejar cambios en la fecha
    if (fechaInput) {
        fechaInput.addEventListener('change', function() {
            console.log('Fecha seleccionada:', this.value);
            const fechaSeleccionada = new Date(this.value);
            if (fechaSeleccionada < today) {
                alert('No puedes seleccionar una fecha pasada');
                this.value = '';
            }
        });
    }

    // Manejar envío del formulario
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const servicio = servicioSelect ? servicioSelect.value : '';
            const personal = personalSelect ? personalSelect.value : '';
            const fecha = fechaInput ? fechaInput.value : '';

            if (!servicio || !personal || !fecha) {
                alert('Por favor, completa todos los campos');
                return;
            }

            const fechaSeleccionada = new Date(fecha);
            if (fechaSeleccionada < today) {
                alert('No puedes seleccionar una fecha pasada');
                return;
            }

            // Si todo está bien, enviar el formulario
            console.log('Enviando formulario con:', {
                servicio,
                personal,
                fecha
            });
            this.submit();
        });
    }

    // Manejar cancelación de citas
    document.querySelectorAll('.cancelar-cita').forEach(button => {
        button.addEventListener('click', async function() {
            if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
                const citaId = this.dataset.citaId;
                try {
                    const response = await fetch(`/citas/${citaId}`, {
                        method: 'DELETE'
                    });
                    const data = await response.json();
                    if (response.ok) {
                        alert(data.mensaje);
                        location.reload();
                    } else {
                        alert(data.mensaje || 'Error al cancelar la cita');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al cancelar la cita');
                }
            }
        });
    });

    // Función para formatear la fecha
    function formatearFecha(fecha) {
        const f = new Date(fecha);
        return f.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}); 