// usuarios.js

async function cargarUsuarios() {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
        mostrarAlerta('Error al cargar usuarios', 'danger');
        return;
    }
    
    const tbody = document.getElementById('listaUsuarios');
    if (tbody) {
        tbody.innerHTML = data.users.map(u => `
            <tr>
                <td>${u.id.substring(0, 8)}</td>
                <td>${u.user_metadata?.name || '-'}</td>
                <td>${u.email}</td>
                <td>${u.role || 'user'}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarUsuario('${u.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function nuevoUsuario() {
    // Solo para demostración - en producción usar formulario
    const email = prompt('Ingrese email del nuevo usuario:');
    if (email) {
        alert('Funcionalidad de creación de usuarios requiere configuración adicional en Supabase Auth');
    }
}

async function eliminarUsuario(id) {
    confirmarAccion('¿Eliminar este usuario?', async () => {
        const { error } = await supabase.auth.admin.deleteUser(id);
        
        if (error) {
            mostrarAlerta('Error al eliminar usuario', 'danger');
        } else {
            mostrarAlerta('Usuario eliminado', 'success');
            cargarUsuarios();
        }
    });
}

cargarUsuarios();