// reportes.js

let movimientosData = [];
let chartInstance = null;

async function cargarProductosParaFiltro() {
    const { data, error } = await supabase.from('products').select('sku_code, description');
    if (error) return;
    
    const select = document.getElementById('filtroProducto');
    if (select) {
        select.innerHTML = '<option value="">Todos los productos</option>' +
            data.map(p => `<option value="${p.sku_code}">${p.sku_code} - ${p.description.substring(0, 40)}</option>`).join('');
    }
}

async function cargarKardex() {
    let query = supabase.from('movements').select('*, products(*), users(name)');
    
    const filtroProducto = document.getElementById('filtroProducto')?.value;
    const filtroTipo = document.getElementById('filtroTipo')?.value;
    
    if (filtroProducto) {
        const { data: producto } = await supabase.from('products').select('id').eq('sku_code', filtroProducto).single();
        if (producto) query = query.eq('product_id', producto.id);
    }
    
    if (filtroTipo) query = query.eq('type', filtroTipo);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
        mostrarAlerta('Error al cargar Kardex', 'danger');
        return;
    }
    
    movimientosData = data;
    
    const tbody = document.getElementById('cuerpoKardex');
    tbody.innerHTML = data.map(m => `
        <tr>
            <td>${formatearFecha(m.created_at)}</td>
            <td>${m.products?.description || '-'}</td>
            <td>${m.products?.sku_code || '-'}</td>
            <td class="${m.type === 'entrada' ? 'text-success' : 'text-danger'} fw-bold">
                ${m.type === 'entrada' ? '📥 ENTRADA' : '📤 SALIDA'}
            </td>
            <td>${m.quantity}</td>
            <td>${m.users?.name || '-'}</td>
        </tr>
    `).join('');
    
    actualizarGrafico();
    actualizarResumen();
}

function actualizarGrafico() {
    const entradas = movimientosData.filter(m => m.type === 'entrada').length;
    const salidas = movimientosData.filter(m => m.type === 'salida').length;
    
    const ctx = document.getElementById('graficoStock')?.getContext('2d');
    if (!ctx) return;
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Entradas', 'Salidas'],
            datasets: [{
                data: [entradas, salidas],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Movimientos por tipo' }
            }
        }
    });
}

function actualizarResumen() {
    const totalEntradas = movimientosData.filter(m => m.type === 'entrada').reduce((sum, m) => sum + m.quantity, 0);
    const totalSalidas = movimientosData.filter(m => m.type === 'salida').reduce((sum, m) => sum + m.quantity, 0);
    
    const resumenDiv = document.getElementById('resumenTexto');
    if (resumenDiv) {
        resumenDiv.innerHTML = `
            <div class="list-group">
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    Total entradas (unidades)
                    <span class="badge bg-success rounded-pill">${totalEntradas}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    Total salidas (unidades)
                    <span class="badge bg-danger rounded-pill">${totalSalidas}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    Movimientos registrados
                    <span class="badge bg-primary rounded-pill">${movimientosData.length}</span>
                </div>
            </div>
        `;
    }
}

function exportarExcel() {
    const data = movimientosData.map(m => ({
        Fecha: formatearFecha(m.created_at),
        Producto: m.products?.description,
        SKU: m.products?.sku_code,
        Tipo: m.type,
        Cantidad: m.quantity,
        Usuario: m.users?.name
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kardex');
    XLSX.writeFile(wb, `kardex_${new Date().toISOString().split('T')[0]}.xlsx`);
}

function exportarPDF() {
    const element = document.getElementById('contenidoParaImprimir');
    if (element) {
        html2pdf().from(element).save(`kardex_${new Date().toISOString().split('T')[0]}.pdf`);
    }
}

function imprimir() {
    const contenido = document.getElementById('contenidoParaImprimir')?.innerHTML;
    if (contenido) {
        const ventana = window.open('');
        ventana.document.write(`
            <html>
                <head><title>Kardex SGA DISTRIBOL</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body><div class="container mt-4">${contenido}</div></body>
            </html>
        `);
        ventana.document.close();
        ventana.print();
    }
}

cargarProductosParaFiltro();
cargarKardex();