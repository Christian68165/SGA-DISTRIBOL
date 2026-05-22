// supabase-config.js
// Reemplaza estos valores con los de tu proyecto en Supabase

const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';

// Inicializar cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verificar sesión al cargar
async function verificarSesion() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (!session && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    }
    
    if (session && window.location.href.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
    
    return session;
}

// Obtener usuario actual
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Ejecutar verificación
verificarSesion();
