// productos.js

async function cargarProductos() {
    const { data, error } = await supabase.from('products').select('*').order('id');
    
    if (error) {
        mostrarAlerta('Error al cargar productos', 'danger');
        return;
    }
    
    const tbody = document.getElementById('listaProductos');
    tbody.innerHTML = data.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.sku_code}</td>
            <td>${p.description}</td>
            <td>${p.category || '-'}</td>
            <td>${p.stock_current}</td>
            <td>${p.stock_security}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarProducto(${p.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function nuevoProducto() {
    document.getElementById('modalTitulo').innerText = 'Nuevo Producto';
    document.getElementById('productoId').value = '';
    document.getElementById('formProducto').reset();
}

async function editarProducto(id) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    
    if (error) {
        mostrarAlerta('Error al cargar producto', 'danger');
        return;
    }
    
    document.getElementById('modalTitulo').innerText = 'Editar Producto';
    document.getElementById('productoId').value = data.id;
    document.getElementById('skuCode').value = data.sku_code;
    document.getElementById('descripcion').value = data.description;
    document.getElementById('categoria').value = data.category || '';
    document.getElementById('stockActual').value = data.stock_current;
    document.getElementById('stockSeguridad').value = data.stock_security;
    
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    modal.show();
}

async function eliminarProducto(id) {
    confirmarAccion('¿Eliminar este producto?', async () => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        
        if (error) {
            mostrarAlerta('Error al eliminar', 'danger');
        } else {
            mostrarAlerta('Producto eliminado', 'success');
            cargarProductos();
        }
    });
}

document.getElementById('formProducto')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('productoId').value;
    const data = {
        sku_code: document.getElementById('skuCode').value,
        description: document.getElementById('descripcion').value,
        category: document.getElementById('categoria').value,
        stock_current: parseInt(document.getElementById('stockActual').value) || 0,
        stock_security: parseInt(document.getElementById('stockSeguridad').value) || 10
    };
    
    let error;
    if (id) {
        const result = await supabase.from('products').update(data).eq('id', id);
        error = result.error;
    } else {
        const result = await supabase.from('products').insert(data);
        error = result.error;
    }
    
    if (error) {
        mostrarAlerta('Error al guardar: ' + error.message, 'danger');
    } else {
        mostrarAlerta('Producto guardado correctamente', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
        modal.hide();
        cargarProductos();
    }
});

cargarProductos();