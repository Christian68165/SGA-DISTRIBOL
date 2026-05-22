// js/supabase-config.js
console.log('1. Iniciando supabase-config.js');

const SUPABASE_URL = 'https://hygdfzpgyoqagxkmmdte.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Z2RmenBneW9xYWd4a21tZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzIyMDEsImV4cCI6MjA5NTA0ODIwMX0.rIgvS7WoucT5sEvMFcN4i1veTqe40fu4ogHZZgEp2pQ';

// Verificar que window.supabase existe
if (typeof window.supabase === 'undefined') {
    console.error('ERROR: window.supabase no está disponible');
} else {
    console.log('2. window.supabase encontrado, creando cliente...');
}

// Crear la variable global supabase
window.supabase = window.supabase || {};
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('3. Cliente Supabase creado');

async function verificarSesion() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    }
    return session;
}

async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

if (!window.location.href.includes('index.html')) {
    verificarSesion();
}
