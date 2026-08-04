# Instrucciones del proyecto — Catálogo de Licores

## Credenciales del panel admin

| Campo | Valor |
|---|---|
| Usuario | `cristian` |
| Contraseña | `cristian_licores_2026` |
| URL admin | `/catalogo-licores/login` |

---

## Cómo cambiar la contraseña

1. Calculá el nuevo hash SHA-256:

```bash
python -c "import hashlib; print(hashlib.sha256('nueva_clave'.encode()).hexdigest())"
```

2. Abrí el archivo `front/src/config/auth.config.js`

3. Reemplazá el valor de `PASSWORD_HASH` con el hash generado

4. Hacé build y deploy:

```bash
cd front
npm run deploy
```

---

## Cómo agregar imágenes a productos

Las imágenes se guardan **dentro del `db.json`** como base64 comprimido (máx. 400×400px). No hace falta manejar archivos sueltos.

**Desde el panel admin:**

1. Editá el producto → sección "Imagen del producto"
2. Hacé clic en "Seleccionar imagen" y elegí el archivo (jpg, png, webp, etc.)
3. La imagen se previsualiza automáticamente
4. Guardá el producto → la imagen queda en memoria

> Sin imagen cargada, la app muestra el ícono 🍾 como fallback.

---

## Cómo publicar cambios del catálogo (incluyendo imágenes)

Los cambios en el admin son **en memoria** — no persisten al recargar la página.

Para guardar cambios permanentemente:

1. Desde el panel admin, hacé clic en **"Exportar db.json"** (panel lateral)  
   → Se descarga el archivo con todos los productos, categorías **e imágenes incluidas**
2. Reemplazá `front/public/db.json` con el archivo descargado
3. (Opcional) Copiá también a `back/db.json` como respaldo:

```bash
copy front\public\db.json back\db.json
```

4. Commiteá y hacé deploy:

```bash
cd front
npm run deploy
```

> **Importante:** Si recargás el navegador antes de exportar, los cambios se pierden.

---

## Comandos útiles

```bash
# Desarrollo local
cd front
npm run dev
# → http://localhost:5173/catalogo-licores/

# Build de producción
npm run build

# Publicar en GitHub Pages
npm run deploy
```

---

## Estructura del proyecto

```
licores/
├── back/
│   └── db.json          ← fuente de verdad del catálogo
├── front/
│   ├── public/
│   │   ├── db.json      ← copia del back (la app lee este)
│   │   └── images/      ← fotos de productos (prod-001.jpg, ...)
│   └── src/
│       ├── config/auth.config.js   ← usuario y hash de contraseña
│       ├── context/
│       │   ├── AuthContext.jsx     ← lógica de login (SHA-256)
│       │   └── DataContext.jsx     ← estado global del catálogo
│       ├── pages/
│       │   ├── Home.jsx            ← grilla de categorías
│       │   ├── CategoryPage.jsx    ← listado de productos
│       │   └── LoginPage.jsx       ← formulario de login
│       └── admin/
│           ├── AdminDashboard.jsx
│           ├── AdminCategorias.jsx
│           └── AdminProductos.jsx
└── INSTRUCCIONES.md     ← este archivo
```

# nada