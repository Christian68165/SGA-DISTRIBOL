// utils.js - Funciones auxiliares

function mostrarAlerta(mensaje, tipo = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function confirmarAccion(mensaje, callback) {
    if (confirm(mensaje)) {
        callback();
    }
}

function formatearFecha(fecha) {
    const f = new Date(fecha);
    return f.toLocaleDateString('es-BO') + ' ' + f.toLocaleTimeString('es-BO');
}

function limpiarFormulario(formId) {
    document.getElementById(formId).reset();
}

function cerrarSesion() {
    supabase.auth.signOut().then(() => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const btnCerrar = document.getElementById('btnCerrarSesion');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }
});