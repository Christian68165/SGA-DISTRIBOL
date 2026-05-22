// dashboard.js

let productosData = [];

async function cargarDashboard() {
    // Cargar productos
    const { data: productos, error } = await supabase.from('products').select('*');
    
    if (error) {
        mostrarAlerta('Error al cargar datos: ' + error.message, 'danger');
        return;
    }
    
    productosData = productos;
    
    // Calcular estadísticas
    const totalProductos = productos.length;
    const stockTotal = productos.reduce((sum, p) => sum + p.stock_current, 0);
    const productosCriticos = productos.filter(p => p.stock_current <= p.stock_security).length;
    
    // Cargar movimientos del mes
    const fechaInicio = new Date();
    fechaInicio.setDate(1);
    const { data: movimientos } = await supabase
        .from('movements')
        .select('*')
        .gte('created_at', fechaInicio.toISOString());
    
    const totalMovimientos = movimientos?.length || 0;
    
    // Actualizar tarjetas
    document.getElementById('totalProductos').innerText = totalProductos;
    document.getElementById('stockTotal').innerText = stockTotal;
    document.getElementById('productosCriticos').innerText = productosCriticos;
    document.getElementById('totalMovimientos').innerText = totalMovimientos;
    
    // Actualizar alertas
    const alertasHtml = productos
        .filter(p => p.stock_current <= p.stock_security)
        .map(p => `
            <div class="alert alert-warning">
                <strong>⚠️ ${p.sku_code}</strong> - ${p.description}<br>
                Stock actual: ${p.stock_current} (Mínimo: ${p.stock_security})
            </div>
        `).join('');
    
    document.getElementById('alertasContainer').innerHTML = alertasHtml || 
        '<div class="alert alert-success">✅ No hay alertas críticas</div>';
    
    // Actualizar tabla
    actualizarTabla(productos);
    
    // Mostrar usuario
    const user = await getCurrentUser();
    if (user) {
        document.getElementById('userInfo').innerText = user.email;
    }
}

function actualizarTabla(productos) {
    const tbody = document.getElementById('tablaProductos');
    tbody.innerHTML = '';
    
    productos.forEach(p => {
        const estado = p.stock_current <= p.stock_security ? 'CRÍTICO' : 'Normal';
        const colorEstado = p.stock_current <= p.stock_security ? 'text-danger' : 'text-success';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${p.sku_code}</td>
            <td>${p.description}</td>
            <td>${p.category || '-'}</td>
            <td>${p.stock_current}</td>
            <td>${p.stock_security}</td>
            <td class="${colorEstado} fw-bold">${estado}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarProducto('${p.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        `;
    });
}

// Búsqueda en tiempo real
document.getElementById('buscarProducto')?.addEventListener('input', (e) => {
    const filtro = e.target.value.toLowerCase();
    const filtrados = productosData.filter(p => 
        p.sku_code.toLowerCase().includes(filtro) || 
        p.description.toLowerCase().includes(filtro)
    );
    actualizarTabla(filtrados);
});

cargarDashboard();