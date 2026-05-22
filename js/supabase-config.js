// supabase-config.js
// Reemplaza estos valores con los de tu proyecto en Supabase

const SUPABASE_URL = 'https://hygdfzpgyoqagxkmmdte.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Z2RmenBneW9xYWd4a21tZHRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQ3MjIwMSwiZXhwIjoyMDk1MDQ4MjAxfQ.M1r6B0rFd26KTnYRg8BqX21-bg3LhNza5GYGO-ZrmIU';

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
