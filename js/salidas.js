// salidas.js

async function buscarProductoPorSKU(sku) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku_code', sku)
        .single();
    
    if (error) return null;
    return data;
}

document.getElementById('skuCode')?.addEventListener('blur', async () => {
    const sku = document.getElementById('skuCode').value;
    if (sku) {
        const producto = await buscarProductoPorSKU(sku);
        if (producto) {
            document.getElementById('descripcion').value = producto.description;
            document.getElementById('stockDisponible').value = producto.stock_current;
            document.getElementById('stockFinal').value = producto.stock_current;
        } else {
            mostrarAlerta('Producto no encontrado', 'warning');
            document.getElementById('descripcion').value = '';
            document.getElementById('stockDisponible').value = '';
            document.getElementById('stockFinal').value = '';
        }
    }
});

document.getElementById('cantidad')?.addEventListener('input', () => {
    const stock = parseInt(document.getElementById('stockDisponible').value) || 0;
    const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
    const final = stock - cantidad;
    document.getElementById('stockFinal').value = final >= 0 ? final : 0;
});

document.getElementById('formSalida')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const sku = document.getElementById('skuCode').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    if (!sku || cantidad <= 0) {
        mostrarAlerta('Datos inválidos', 'danger');
        return;
    }
    
    const producto = await buscarProductoPorSKU(sku);
    if (!producto) {
        mostrarAlerta('Producto no encontrado', 'danger');
        return;
    }
    
    if (producto.stock_current < cantidad) {
        mostrarAlerta(`Stock insuficiente. Disponible: ${producto.stock_current}`, 'danger');
        return;
    }
    
    const nuevoStock = producto.stock_current - cantidad;
    
    const { error: updateError } = await supabase
        .from('products')
        .update({ stock_current: nuevoStock })
        .eq('id', producto.id);
    
    if (updateError) {
        mostrarAlerta('Error al registrar salida', 'danger');
        return;
    }
    
    const user = await getCurrentUser();
    await supabase.from('movements').insert({
        product_id: producto.id,
        user_id: user?.id,
        type: 'salida',
        quantity: cantidad
    });
    
    mostrarAlerta(`✅ Salida registrada. Nuevo stock: ${nuevoStock}`, 'success');
    limpiarFormulario('formSalida');
    cargarHistorial();
});

async function cargarHistorial() {
    const { data, error } = await supabase
        .from('movements')
        .select('*, products(sku_code, description), users(name)')
        .eq('type', 'salida')
        .order('created_at', { ascending: false })
        .limit(10);
    
    if (error) return;
    
    const tbody = document.getElementById('historialSalidas');
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
    document.getElementById('stockDisponible').value = '';
    document.getElementById('stockFinal').value = '';
}

cargarHistorial();