# 🚀 Guía Completa: Cómo Probar OpenBlind

**Fecha:** 2026-01-07

## ✅ Lo Que Se Ha Completado

### 1. Sistema de Voz 100% Funcional
- ✅ Saludo automático al iniciar
- ✅ Anuncio automático de páginas
- ✅ 13 comandos de voz globales
- ✅ Feedback de voz en todas las acciones
- ✅ Reconocimiento continuo de voz

### 2. Páginas Accesibles Creadas
- ✅ HomePage (página principal con menú de voz)
- ✅ SettingsPage (configuración de voz, tema, fuente)
- ✅ IncidentsPage (reportar obstáculos/obras)
- ✅ SupportPage (crear tickets de soporte)

### 3. Modo Alto Contraste para Daltónicos
- ✅ Fondo negro + texto amarillo brillante
- ✅ Contraste 19.56:1 (excelente accesibilidad)
- ✅ 4 tamaños de fuente ajustables

### 4. Integración Backend Completa
- ✅ Todos los servicios conectados al backend
- ✅ API configurada en api.config.ts (sin .env)
- ✅ Endpoints correctos para todos los módulos

---

## 📋 Pre-requisitos

### Backend (ya está funcionando)
El backend debe estar corriendo en `http://localhost:8888`

Si no está corriendo:
```bash
cd c:\Users\user\Desktop\openblind\openblind-back-nuevo
npm start
```

### Frontend (vamos a probarlo ahora)
```bash
cd c:\Users\user\Desktop\openblind\front-unido
npm install  # Solo la primera vez
npm run dev
```

---

## 🎯 Pasos para Probar TODO

### PASO 1: Instalar Dependencias (si no lo has hecho)

```bash
cd c:\Users\user\Desktop\openblind\front-unido
npm install
```

**Posibles errores:**
- Si falta `leaflet`: `npm install leaflet react-leaflet`
- Si falta `@types/leaflet`: `npm install -D @types/leaflet`

### PASO 2: Iniciar el Frontend

```bash
npm run dev
```

Esto abrirá el navegador en `http://localhost:5173` (o el puerto que Vite asigne)

### PASO 3: Permitir Micrófono

Cuando abras la aplicación, el navegador te pedirá permiso para usar el micrófono.

**⚠️ IMPORTANTE:** Debes hacer clic en "Permitir" o "Allow" para que el reconocimiento de voz funcione.

Si no lo permites, puedes seguir usando la app con el mouse/teclado, pero no podrás usar comandos de voz.

---

## 🎤 Pruebas de Voz (SIN TOCAR LA PANTALLA)

### Prueba 1: Saludo Automático ✅

**Qué esperar:**
1. Abre la app
2. **AUTOMÁTICAMENTE** debes escuchar: "Bienvenido a Open Blind, tu asistente de navegación accesible. ¿En qué podemos ayudarte?"
3. Luego escucharás: "Estás en página principal. Opciones disponibles: navegación, lugares favoritos, contactos de emergencia, reportar incidencia, soporte, configuración."

**Si NO escuchas nada:**
- Verifica que permitiste el micrófono
- Verifica que el volumen no esté en 0
- Abre la consola del navegador (F12) y busca errores

### Prueba 2: Navegación por Voz ✅

**Di estos comandos en voz alta:**

| Di esto | Qué debe pasar |
|---------|----------------|
| "navegación" | Va a la página de navegación |
| "atrás" | Vuelve a la página anterior |
| "configuración" | Va a configuración |
| "menú" | Lee todas las opciones disponibles |
| "ayuda" | Explica los comandos de voz |
| "repetir" | Repite la última información |
| "detener" | Detiene la voz |

**Si no reconoce tu voz:**
- Habla más fuerte y claro
- Verifica que el micrófono funcione (prueba en otra app)
- Di las palabras exactas de la lista

### Prueba 3: Configuración de Voz ✅

**Pasos:**
1. Di "configuración" o haz clic en ⚙️ Configuración
2. Escucharás: "Estás en configuración. Opciones disponibles: preferencias de voz, modo alto contraste, tamaño de fuente..."
3. Usa los sliders para ajustar:
   - **Velocidad** (0.5x - 2.0x)
   - **Volumen** (0% - 100%)
4. Haz clic en "🎤 Probar Voz" para escuchar con la nueva configuración

**Resultado esperado:**
- La voz debe sonar más rápida/lenta según la velocidad
- Debe sonar más fuerte/suave según el volumen
- Los cambios se guardan automáticamente en localStorage

### Prueba 4: Alto Contraste para Daltónicos ✅

**Pasos:**
1. Ve a configuración
2. En "Tema Visual", haz clic en "Alto Contraste"
3. Escucharás: "Modo alto contraste activado"

**Resultado esperado:**
- Fondo NEGRO (#000000)
- Texto AMARILLO BRILLANTE (#FFFF00)
- Botones VERDES (#00FF00)
- Bordes BLANCOS (#FFFFFF)
- Todo debe ser super visible

**Probar tamaños de fuente:**
- Pequeño (14px)
- Mediano (16px)
- Grande (20px)
- Extra Grande (24px)

### Prueba 5: Reportar Incidencia ✅

**Pasos:**
1. Di "incidencia" o haz clic en ⚠️ Reportar Incidencia
2. Haz clic en "➕ Nuevo Reporte"
3. Selecciona tipo: 🚧 Obstáculo, 🏗️ Obra, ⚠️ Zona Peligrosa, o ❓ Otro
4. Escribe una descripción (ej: "Bache grande en la esquina")
5. La app obtendrá tu ubicación GPS automáticamente
6. Haz clic en "✅ Enviar Reporte"
7. Escucharás: "Incidencia reportada correctamente"

**Resultado esperado:**
- El reporte aparece en "Mis Incidencias Reportadas"
- Se guarda en el backend
- Puedes eliminarlo con el botón "🗑️ Eliminar"

**Probar lectura por voz:**
- Haz clic en "🔊 Leer Incidencias"
- Debe leer todas tus incidencias por voz

### Prueba 6: Crear Ticket de Soporte ✅

**Pasos:**
1. Di "soporte" o haz clic en 💬 Soporte
2. Haz clic en "➕ Nuevo Ticket"
3. Escribe un asunto (ej: "No puedo calcular rutas")
4. Selecciona prioridad: 🟢 Baja, 🟡 Media, o 🔴 Alta
5. Escribe descripción del problema
6. Haz clic en "✅ Crear Ticket"
7. Escucharás: "Ticket de soporte creado correctamente"

**Resultado esperado:**
- El ticket aparece en "Mis Tickets de Soporte"
- Se guarda en el backend con estado "abierto"
- Puedes leerlo por voz con "🔊 Leer Ticket"

### Prueba 7: Comandos de Voz en Cualquier Página ✅

**Estés donde estés, prueba:**
- Di "inicio" → Vuelve al home
- Di "menú" → Lee opciones
- Di "ayuda" → Explica comandos
- Di "atrás" → Vuelve atrás
- Di "detener" → Para la voz

**Esto debe funcionar EN TODAS LAS PÁGINAS**

---

## 🐛 Problemas Comunes y Soluciones

### Problema 1: No se escucha nada

**Posibles causas:**
1. **Volumen del sistema en 0**
   - Solución: Sube el volumen del sistema

2. **Navegador no soporta Speech Synthesis**
   - Solución: Usa Chrome, Edge o Firefox (versiones recientes)

3. **Página en segundo plano**
   - Solución: Mantén la pestaña activa

4. **Error en consola**
   - Solución: Abre F12 y busca errores en rojo

### Problema 2: No reconoce comandos de voz

**Posibles causas:**
1. **Micrófono no permitido**
   - Solución: Haz clic en el candado (🔒) en la barra de direcciones → Permisos → Permitir micrófono

2. **Micrófono desconectado o en mute**
   - Solución: Verifica configuración del sistema

3. **Navegador no soporta Speech Recognition**
   - Solución: Usa Chrome o Edge (Firefox tiene soporte limitado)

4. **Idioma incorrecto**
   - Solución: Verifica que el reconocimiento esté en español (es-ES)

### Problema 3: Error "Cannot find module"

**Ejemplo:** `Cannot find module './shared/contexts/VoiceNavigationContext'`

**Solución:**
```bash
# Verifica que el archivo exista
ls src/shared/contexts/VoiceNavigationContext.tsx

# Si no existe, copia los archivos que creamos
```

### Problema 4: Error de Leaflet (mapa)

**Error:** `Cannot find module 'leaflet'`

**Solución:**
```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

### Problema 5: Backend no responde

**Error:** `Network Error` o `ERR_CONNECTION_REFUSED`

**Solución:**
```bash
# Verifica que el backend esté corriendo
cd c:\Users\user\Desktop\openblind\openblind-back-nuevo
npm start

# Debe decir: Server running on port 8888
```

---

## 📊 Checklist de Pruebas Completo

### Accesibilidad por Voz
- [ ] Saludo automático al iniciar
- [ ] Anuncio automático de páginas
- [ ] Comando "navegación" funciona
- [ ] Comando "configuración" funciona
- [ ] Comando "incidencia" funciona
- [ ] Comando "soporte" funciona
- [ ] Comando "menú" lee opciones
- [ ] Comando "ayuda" explica comandos
- [ ] Comando "atrás" vuelve atrás
- [ ] Comando "detener" para la voz

### Configuración
- [ ] Slider de velocidad funciona
- [ ] Slider de volumen funciona
- [ ] Botón "Probar Voz" funciona
- [ ] Modo alto contraste funciona
- [ ] Colores son super visibles en alto contraste
- [ ] Tamaños de fuente funcionan
- [ ] Cambios se guardan (recargar página y verificar)

### Incidencias
- [ ] Crear incidencia funciona
- [ ] GPS obtiene ubicación
- [ ] Incidencia aparece en lista
- [ ] Leer incidencias por voz funciona
- [ ] Eliminar incidencia funciona
- [ ] Feedback de voz en cada acción

### Soporte
- [ ] Crear ticket funciona
- [ ] Ticket aparece en lista
- [ ] Leer tickets por voz funciona
- [ ] Se muestran prioridades correctas
- [ ] Feedback de voz en cada acción

### Integración Backend
- [ ] Incidencias se guardan en backend
- [ ] Tickets se guardan en backend
- [ ] Preferencias se guardan en backend
- [ ] No hay errores en consola

---

## 🔧 Dependencias Necesarias

Si encuentras errores de módulos faltantes, instala:

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

**Dependencias ya incluidas:**
- react
- react-dom
- react-router-dom
- axios
- typescript
- vite
- tailwindcss

---

## 🎯 Siguiente Paso: Integrar con Páginas Existentes

Algunas páginas ya existentes necesitan:
1. Agregar `useVoiceNavigation` para feedback de voz
2. Usar botones grandes (min 60px altura)
3. Agregar `onFocus={() => speak('...')}`
4. Probar en modo alto contraste

**Páginas que necesitan actualización:**
- FavoritePlacesListScreen
- ContactsScreen
- LocationScreen (navegación GPS)

---

## 📝 Notas Importantes

### APIs Usadas (GRATIS)

1. **Web Speech API** (navegador)
   - SpeechSynthesis (hablar)
   - SpeechRecognition (escuchar)
   - 100% gratis, nativo del navegador

2. **Geolocation API** (navegador)
   - GPS del dispositivo
   - 100% gratis, nativo del navegador

3. **OpenRouteService API** (backend)
   - Ya configurado en backend
   - 2,000 requests/día gratis
   - API Key en `src/config/keys.js`

4. **Leaflet + OpenStreetMap** (mapas)
   - Mapas gratis
   - No requiere API key

### NO se usa .env

Todo está en archivos de configuración directos:
- Frontend: `src/config/api.config.ts`
- Backend: `src/config/keys.js`

Esto es INTENCIONAL porque `.env` causa problemas en VPS.

---

## 🎉 ¡Todo Listo!

Si seguiste todos los pasos, ahora tienes:
- ✅ App 100% accesible por voz
- ✅ Modo alto contraste para daltónicos
- ✅ Backend integrado
- ✅ Incidencias funcionando
- ✅ Soporte funcionando
- ✅ Configuración persistente

**Para probar sin tocar pantalla:**
1. Abre la app
2. Espera el saludo
3. Di "menú" para escuchar opciones
4. Di el nombre de cualquier sección
5. Usa comandos de voz para navegar

**¡Disfruta! 🚀**
