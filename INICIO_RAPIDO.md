# INICIO RÁPIDO - OpenBlind Frontend Cliente

## REQUISITOS PREVIOS

- Node.js 18+ instalado
- Backend de OpenBlind corriendo
- Navegador Chrome o Edge

---

## INSTALACIÓN Y EJECUCIÓN (3 PASOS)

### 1. Instalar dependencias (solo la primera vez)

```bash
cd c:\Users\user\Desktop\openblind\front-unido
npm install
```

### 2. Iniciar el backend (Terminal 1)

```bash
cd c:\Users\user\Desktop\openblind\openblind-back-nuevo
npm start
```

Espera a ver el mensaje: `Server running on port 8888`

### 3. Iniciar el frontend (Terminal 2)

```bash
cd c:\Users\user\Desktop\openblind\front-unido
npm run dev
```

Abre tu navegador en: **http://localhost:5173**

---

## PRUEBA RÁPIDA (5 MINUTOS)

### ✅ 1. Diseño Responsive
- Abre DevTools (F12)
- Modo responsive (Ctrl+Shift+M)
- Cambia tamaño: 375px, 414px
- **Verificar:** Botones tamaño normal (NO gigantes)

### ✅ 2. Reconocimiento de Voz
- Haz clic en el botón del micrófono 🎤
- Permite acceso al micrófono
- Di: **"Navegación"**
- **Verificar:** Navega a la pantalla de navegación

### ✅ 3. Cambio de Idioma
- Di: **"Ajustes"** o haz clic en ⚙️ Ajustes
- Haz clic en **🇬🇧 English**
- **Verificar:** Toda la app cambia a inglés
- Di: **"Spanish"**
- **Verificar:** Vuelve a español

### ✅ 4. Geolocalización
- Di: **"Ubicación"** o haz clic en 📍 Mi Ubicación
- Permite acceso a ubicación
- **Verificar:** Muestra tu dirección actual

### ✅ 5. Cálculo de Rutas
- Di: **"Navegación"** o haz clic en 🧭 Navegación
- Ingresa origen y destino
- Haz clic en **Calcular Ruta**
- **Verificar:** Muestra la ruta calculada

---

## COMANDOS DE VOZ DISPONIBLES

### Navegación
- **"Navegación"** - Ir a navegación
- **"Ubicación"** - Ver mi ubicación
- **"Lugares"** - Ver lugares favoritos
- **"Emergencia"** - Contactos de emergencia
- **"Historial"** - Ver historial de rutas
- **"Ajustes"** - Ir a configuración
- **"Inicio"** - Volver al menú principal

### Configuración
- **"Modo oscuro"** - Activar tema oscuro
- **"Modo claro"** - Activar tema claro
- **"Inglés"** - Cambiar a inglés
- **"Español"** - Cambiar a español

---

## SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Cannot connect to backend"
**Solución:**
```bash
# Verifica que el backend esté corriendo
cd c:\Users\user\Desktop\openblind\openblind-back-nuevo
npm start
```

### ❌ Reconocimiento de voz no funciona
**Solución:**
1. Usa Chrome o Edge (no Firefox)
2. Permite acceso al micrófono
3. Verifica que no haya otros tabs usando el micrófono

### ❌ Rutas no se calculan
**Solución:**
1. Verifica que backend esté en puerto 8888
2. Revisa logs del backend
3. Verifica OpenRouteService API key en `openblind-back-nuevo/src/config/keys.js`

### ❌ Geolocalización no funciona
**Solución:**
1. Permite acceso a ubicación en el navegador
2. En producción, requiere HTTPS

---

## ESTRUCTURA DEL PROYECTO

```
front-unido/
├── src/
│   ├── i18n/
│   │   ├── translations.ts        # Traducciones ES/EN
│   │   └── i18nContext.tsx        # Provider de idioma
│   ├── hooks/
│   │   └── useVoiceControl.tsx    # Hook de control por voz
│   ├── services/
│   │   └── geocoding.ts           # Geolocalización Ecuador
│   ├── pages/
│   │   ├── HomePage.tsx           # Página principal rediseñada
│   │   ├── SettingsPage.tsx       # Configuración accesible
│   │   └── ...
│   ├── config/
│   │   └── api.config.ts          # Configuración API backend
│   └── index.css                  # Estilos responsive normales
├── CAMBIOS_CRITICOS_APLICADOS.md  # Documentación completa
└── package.json
```

---

## CARACTERÍSTICAS PRINCIPALES

### 🎨 Diseño Moderno
- Botones tamaño normal (48-100px)
- Fuentes normales (14-20px)
- Responsive (360px - 480px)
- Animaciones suaves

### 🎤 Control por Voz Total
- Navegación completa
- Cambio de idioma
- Cambio de tema
- Comandos en ES/EN

### 🌐 Internacionalización
- Español e Inglés completo
- Persistencia en localStorage
- Cambio dinámico

### 📍 Geolocalización Ecuador
- Nominatim (OpenStreetMap)
- Solo resultados en Ecuador
- Geocodificación inversa

### 🛣️ Navegación
- OpenRouteService API
- Rutas optimizadas
- Instrucciones paso a paso

---

## TECNOLOGÍAS

- React 19 + TypeScript
- Tailwind CSS
- Vite
- Web Speech API
- Nominatim API
- OpenRouteService API

---

## COMANDOS NPM

```bash
npm run dev       # Desarrollo
npm run build     # Producción
npm run preview   # Vista previa producción
npm run lint      # Linter
```

---

## SOPORTE

Para más información, consulta:
- `CAMBIOS_CRITICOS_APLICADOS.md` - Documentación completa
- DevTools Console (F12) - Logs y errores
- Backend logs - Errores del servidor

---

**¡Listo para usar! 🚀**
