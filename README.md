# SGA DISTRIBOL - Sistema de Gestión de Almacén

## Descripción
Sistema web para la gestión de inventarios y procesos logísticos de DISTRIBOL S.R.L.

## Tecnologías utilizadas
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Supabase (Base de datos + Autenticación)

## Estructura del proyecto
sga-distribol/
├── index.html # Login
├── dashboard.html # Panel principal
├── entrada.html # Recepción de mercancía
├── salida.html # Despacho de mercancía
├── productos.html # CRUD de productos
├── reportes.html # Reportes y Kardex
├── usuarios.html # Gestión de usuarios
├── css/
│ └── styles.css
├── js/
│ ├── supabase-config.js
│ ├── utils.js
│ ├── dashboard.js
│ ├── entradas.js
│ ├── salidas.js
│ ├── productos.js
│ ├── reportes.js
│ └── usuarios.js
└── pages/
└── 404.html

## Configuración
1. Crear proyecto en Supabase
2. Ejecutar el script SQL para crear tablas
3. Configurar `SUPABASE_URL` y `SUPABASE_ANON_KEY` en `js/supabase-config.js`
4. Desplegar en GitHub Pages o servidor web

## Credenciales de prueba
- Email: admin@admin.com
- Contraseña: admin123