// entradas.js

async function buscarProductoPorSKU(sku) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku_code', sku)
        .single();
    
    if (error) {
        return null;
    }
    return data;
}

document.getElementById('skuCode')?.addEventListener('blur', async () => {
    const sku = document.getElementById('skuCode').value;
    if (sku) {
        const producto = await buscarProductoPorSKU(sku);
        if (producto) {
            document.getElementById('descripcion').value = producto.description;
            document.getElementById('categoria').value = producto.category || '';
            document.getElementById('stockActual').value = producto.stock_current;
        } else {
            mostrarAlerta('Producto no encontrado', 'warning');
            document.getElementById('descripcion').value = '';
            document.getElementById('categoria').value = '';
            document.getElementById('stockActual').value = '';
        }
    }
});

document.getElementById('formEntrada')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const sku = document.getElementById('skuCode').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    if (!sku || cantidad <= 0) {
        mostrarAlerta('Datos inválidos. La cantidad debe ser mayor a 0', 'danger');
        return;
    }
    
    const producto = await buscarProductoPorSKU(sku);
    if (!producto) {
        mostrarAlerta('Producto no encontrado', 'danger');
        return;
    }
    
    const nuevoStock = producto.stock_current + cantidad;
    
    const { error: updateError } = await supabase
        .from('products')
        .update({ stock_current: nuevoStock })
        .eq('id', producto.id);
    
    if (updateError) {
        mostrarAlerta('Error al registrar entrada', 'danger');
        return;
    }
    
    const user = await getCurrentUser();
    await supabase.from('movements').insert({
        product_id: producto.id,
        user_id: user?.id,
        type: 'entrada',
        quantity: cantidad
    });
    
    mostrarAlerta(`✅ Entrada registrada. Nuevo stock: ${nuevoStock}`, 'success');
    limpiarFormulario('formEntrada');
    cargarHistorial();
});

async function cargarHistorial() {
    const { data, error } = await supabase
        .from('movements')
        .select('*, products(sku_code, description), users(name)')
        .eq('type', 'entrada')
        .order('created_at', { ascending: false })
        .limit(10);
    
    if (error) return;
    
    const tbody = document.getElementById('historialEntradas');
    if (tbody) {
        tbody.innerHTML = data.map(m => `
            <tr>
                <td>${formatearFecha(m.created_at)}</td>
                <td>${m.products?.sku_code}</td>
                <td>${m.products?.description?.substring(0, 30)}</td>
                <td>${m.quantity}</td>
                <td>${m.users?.name || '-'}</td>
            </tr>
        `).join('');
    }
}

function limpiarFormulario() {
    document.getElementById('skuCode').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('stockActual').value = '';
}

cargarHistorial();