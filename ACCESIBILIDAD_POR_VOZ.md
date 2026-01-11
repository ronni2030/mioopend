# 🎤 Sistema de Accesibilidad por Voz - OpenBlind

**Última actualización:** 2026-01-07

Este documento describe el sistema completo de accesibilidad por voz implementado en OpenBlind para personas ciegas, con vista parcial y daltónicas.

---

## 🎯 Objetivo Principal

**La aplicación debe funcionar 100% por voz sin necesidad de tocar la pantalla.**

Desde el inicio, la app dice:
> "Bienvenido a Open Blind, tu asistente de navegación accesible. ¿En qué podemos ayudarte?"

Y anuncia automáticamente todas las opciones disponibles en cada página.

---

## 📁 Archivos Creados

### 1. Hooks de Voz

#### `src/shared/hooks/useVoiceAssistant.ts`
**Hook principal del asistente de voz**

Funciones principales:
- `speak(text, priority)` - Habla un texto (prioridad 'high' cancela todo lo anterior)
- `welcome()` - Saludo de bienvenida inicial
- `announcePage(pageName, options)` - Anuncia página actual y opciones disponibles
- `readMenu(menuItems)` - Lee opciones de menú con números
- `announceSuccess(message)` - Anuncia éxito de acción
- `announceError(message)` - Anuncia error
- `help()` - Explica comandos disponibles
- `stop()` - Detiene speech
- `pause()` / `resume()` - Pausa/reanuda

Características:
- Cola de mensajes (no se superponen)
- Configuración desde localStorage (velocidad, volumen)
- Priorización de mensajes urgentes
- Idioma español (es-ES)

#### `src/shared/hooks/useSpeechRecognition.ts`
**Hook de reconocimiento de voz**

Funciones principales:
- `startListening()` - Inicia escucha continua
- `stopListening()` - Detiene escucha
- `registerCommands(commands)` - Registra comandos de voz
- `findMatchingCommand(text)` - Busca comando que coincida

Características:
- Reconocimiento continuo en español
- Matching de keywords flexibles
- Manejo de errores (sin micrófono, sin habla, etc.)
- Transcripción en tiempo real

### 2. Contextos Globales

#### `src/shared/contexts/VoiceNavigationContext.tsx`
**Proveedor global de navegación por voz**

Funcionalidades:
- Saludo automático al iniciar la app
- Anuncio automático de cambios de página
- Comandos de voz globales registrados:
  - "inicio" / "home" → Ir a página principal
  - "navegación" / "navegar" → Ir a navegación
  - "lugares" / "favoritos" → Ir a lugares favoritos
  - "contactos" / "emergencia" → Ir a contactos de emergencia
  - "incidencia" / "reportar" → Reportar incidencia
  - "soporte" / "ayuda técnica" → Ir a soporte
  - "configuración" / "ajustes" → Ir a configuración
  - "atrás" / "volver" → Volver página anterior
  - "menú" / "opciones" → Leer menú principal
  - "repetir" / "otra vez" → Repetir última información
  - "ayuda" → Instrucciones de uso
  - "detener" / "callate" / "silencio" → Detener voz

Características:
- Escucha automática al cargar
- Mapeo completo de rutas
- Activación/desactivación global

#### `src/shared/contexts/ThemeContext.tsx`
**Proveedor de temas accesibles**

Modos disponibles:
1. **Modo Claro** (light)
   - Fondo blanco (#ffffff)
   - Texto oscuro (#1f2937)
   - Colores estándar

2. **Modo Oscuro** (dark)
   - Fondo oscuro (#1a1a1a)
   - Texto claro (#ffffff)
   - Colores suaves

3. **Alto Contraste** (high-contrast) ⭐
   - Fondo negro (#000000)
   - Texto amarillo brillante (#FFFF00)
   - Primario verde (#00FF00)
   - Secundario cian (#00FFFF)
   - Error rojo (#FF0000)
   - Advertencia naranja (#FFA500)
   - Bordes blancos (#FFFFFF)

Tamaños de fuente:
- Pequeño (14px)
- Mediano (16px)
- Grande (20px)
- Extra Grande (24px)

Características:
- Persistencia en localStorage
- Feedback de voz al cambiar tema
- Variables CSS personalizadas

### 3. Páginas

#### `src/pages/HomePage.tsx`
**Página principal accesible**

Características:
- Botones GRANDES (min 180px altura)
- Emojis grandes (6xl) para identificación visual
- Bordes gruesos (4px) con hover/focus
- Comandos de voz visibles en cada opción
- Indicador de escucha (micrófono animado)
- Botón de ayuda flotante
- Anuncio automático al enfocar botón
- 6 opciones principales:
  1. 🧭 Navegación
  2. ⭐ Lugares Favoritos
  3. 🚨 Contactos de Emergencia
  4. ⚠️ Reportar Incidencia
  5. 💬 Soporte
  6. ⚙️ Configuración

#### `src/pages/SettingsPage.tsx`
**Página de configuración accesible**

Opciones configurables:
1. **Velocidad de voz** (0.5x - 2.0x)
   - Slider con feedback en tiempo real
   - Marcadores de referencia

2. **Volumen** (0% - 100%)
   - Control preciso en incrementos de 5%
   - Prueba inmediata

3. **Tema visual**
   - 3 opciones con previsualización
   - Feedback de voz al cambiar

4. **Tamaño de fuente**
   - 4 tamaños con ejemplo visual
   - Aplicación instantánea

Características:
- Botón "Leer Configuración Actual"
- Botón "Probar Voz"
- Sincronización con backend (usePreferences)
- Persistencia en localStorage

### 4. Hooks de Módulos con Voz

Todos los hooks ahora incluyen feedback de voz:

#### `src/features/places/hooks/usePlaces.ts`
- `readPlaces()` - Lee lista de lugares favoritos

#### `src/features/settings/hooks/usePreferences.ts`
- `readPreferences()` - Lee preferencias actuales
- Feedback al crear/actualizar/resetear

#### `src/features/support/hooks/useSupport.ts`
- `readTickets()` - Lee lista de tickets
- `readTicket(ticket)` - Lee ticket específico
- Feedback al crear/actualizar/archivar

#### `src/features/incidents/hooks/useIncidents.ts`
- `readIncidents()` - Lee lista de incidencias
- Feedback al crear/actualizar/cerrar/eliminar

#### `src/features/emergency-contacts/hooks/useEmergencyContacts.ts`
- `readContacts()` - Lee lista de contactos
- `readContact(contact)` - Lee contacto específico
- Feedback al agregar/actualizar/eliminar

---

## 🚀 Integración en la Aplicación

Para integrar el sistema de voz, actualiza tu `App.tsx`:

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { VoiceNavigationProvider } from './shared/contexts/VoiceNavigationContext';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
// ... otros imports

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <VoiceNavigationProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* ... otras rutas */}
          </Routes>
        </VoiceNavigationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
```

**IMPORTANTE:** `VoiceNavigationProvider` DEBE estar dentro de `BrowserRouter` porque usa `useNavigate` y `useLocation`.

---

## 📝 Uso en Componentes

### Ejemplo 1: Usar voz en un componente

```tsx
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';

function MiComponente() {
  const { speak, announceSuccess } = useVoiceNavigation();

  const handleAction = async () => {
    try {
      await algunaAccion();
      announceSuccess('Acción completada exitosamente');
    } catch (error) {
      speak('Error al realizar la acción', 'high');
    }
  };

  return (
    <button
      onClick={handleAction}
      onFocus={() => speak('Botón de acción')}
    >
      Realizar Acción
    </button>
  );
}
```

### Ejemplo 2: Usar tema accesible

```tsx
import { useTheme } from '../shared/contexts/ThemeContext';

function MiComponente() {
  const { mode, toggleHighContrast } = useTheme();

  return (
    <div>
      <p>Modo actual: {mode}</p>
      <button onClick={toggleHighContrast}>
        Alternar Alto Contraste
      </button>
    </div>
  );
}
```

### Ejemplo 3: Registrar comandos de voz personalizados

```tsx
import { useSpeechRecognition } from '../shared/hooks/useSpeechRecognition';
import { useEffect } from 'react';

function MiComponente() {
  const { registerCommands } = useSpeechRecognition();

  useEffect(() => {
    const commands = [
      {
        name: 'Guardar',
        keywords: ['guardar', 'salvar', 'save'],
        action: () => {
          console.log('Guardando...');
        },
      },
      {
        name: 'Cancelar',
        keywords: ['cancelar', 'descartar', 'cerrar'],
        action: () => {
          console.log('Cancelando...');
        },
      },
    ];

    registerCommands(commands);
  }, []);

  return <div>Mi componente con comandos personalizados</div>;
}
```

---

## ✅ Checklist de Accesibilidad

### Requisitos Implementados

- ✅ Saludo automático al iniciar ("Bienvenido a Open Blind...")
- ✅ Anuncio automático de páginas y opciones disponibles
- ✅ Navegación completa por comandos de voz
- ✅ Feedback de voz en todas las acciones
- ✅ Cola de mensajes (sin superposición)
- ✅ Priorización de mensajes urgentes
- ✅ Comandos globales (inicio, menú, ayuda, atrás, etc.)
- ✅ Reconocimiento continuo de voz en español
- ✅ Modo alto contraste para daltónicos
- ✅ 4 tamaños de fuente ajustables
- ✅ Configuración persistente en localStorage
- ✅ Botones grandes (min 180px altura)
- ✅ Bordes gruesos (4px) para mejor visibilidad
- ✅ Indicadores visuales claros (emojis grandes)
- ✅ Hover y focus states bien definidos
- ✅ ARIA labels en todos los elementos interactivos
- ✅ Feedback de voz al cambiar configuración
- ✅ Integración con hooks de todos los módulos
- ✅ Sincronización con backend (preferencias)

### Pendiente de Implementar

- ⬜ Integración completa en todas las páginas
- ⬜ Formularios accesibles con voz
- ⬜ Confirmaciones por voz ("¿Estás seguro?")
- ⬜ Pruebas completas sin tocar pantalla
- ⬜ Optimización de latencia de respuesta

---

## 🎨 Guía de Diseño Accesible

### Tamaños Mínimos

- **Botones:** Mínimo 60px altura, 200px ancho (idealmente 180px altura)
- **Texto:** Mínimo 16px (usar tamaño configurable)
- **Espaciado:** Mínimo 8px entre elementos interactivos
- **Bordes:** Mínimo 2px (idealmente 4px para alto contraste)

### Colores (Alto Contraste)

```css
:root.high-contrast {
  --color-bg: #000000;        /* Negro puro */
  --color-text: #FFFF00;      /* Amarillo brillante */
  --color-primary: #00FF00;   /* Verde brillante */
  --color-secondary: #00FFFF; /* Cian brillante */
  --color-error: #FF0000;     /* Rojo puro */
  --color-warning: #FFA500;   /* Naranja */
  --color-success: #00FF00;   /* Verde brillante */
  --color-border: #FFFFFF;    /* Blanco */
}
```

### Contraste Mínimo

- Texto normal: 4.5:1
- Texto grande (18px+): 3:1
- Alto contraste: 7:1+ (amarillo sobre negro = 19.56:1 ✅)

---

## 🔊 Comandos de Voz Globales

| Comando | Alternativas | Acción |
|---------|-------------|--------|
| inicio | home, principal, volver inicio | Ir a página principal |
| navegación | navegar, ir navegación, calcular ruta | Ir a navegación |
| lugares | favoritos, lugares favoritos, mis lugares | Ir a lugares favoritos |
| contactos | emergencia, contactos emergencia, mis contactos | Ir a contactos |
| incidencia | reportar, obstáculo, obra, peligro | Reportar incidencia |
| soporte | ayuda técnica, ticket, problema | Ir a soporte |
| configuración | ajustes, preferencias, settings | Ir a configuración |
| atrás | volver, regresar, anterior | Página anterior |
| menú | opciones, qué puedo hacer, mostrar menú | Leer menú principal |
| repetir | otra vez, de nuevo, qué dijiste | Repetir última info |
| ayuda | cómo funciona, instrucciones, comandos | Ayuda de uso |
| detener | callate, silencio, parar, stop | Detener voz |

---

## 🧪 Pruebas Recomendadas

### Prueba 1: Navegación Sin Tocar Pantalla

1. Abrir la app
2. Esperar saludo automático
3. Escuchar opciones
4. Decir "navegación" → Debe ir a navegación
5. Decir "atrás" → Debe volver
6. Decir "configuración" → Debe ir a configuración
7. Decir "menú" → Debe leer todas las opciones

### Prueba 2: Alto Contraste

1. Ir a configuración
2. Activar modo alto contraste
3. Verificar colores brillantes sobre negro
4. Verificar legibilidad de todo el texto
5. Verificar bordes blancos bien definidos

### Prueba 3: Velocidad y Volumen

1. Ir a configuración
2. Cambiar velocidad a 0.5x
3. Probar voz → Debe hablar lento
4. Cambiar velocidad a 2.0x
5. Probar voz → Debe hablar rápido
6. Cambiar volumen a 50%
7. Probar voz → Debe sonar más bajo

### Prueba 4: Feedback de Acciones

1. Ir a lugares favoritos
2. Agregar un lugar
3. Esperar "Lugar guardado correctamente"
4. Eliminar el lugar
5. Esperar "Lugar eliminado"

---

## 📞 Soporte

Para problemas o sugerencias sobre accesibilidad:
- Crear ticket en soporte
- Email: soporte@openblind.com (ficticio)
- Reportar en GitHub Issues

---

## 🏆 Créditos

Sistema de accesibilidad desarrollado para **OpenBlind** - Navegación accesible para personas ciegas, con vista parcial y daltónicas.

**Tecnologías utilizadas:**
- Web Speech API (SpeechSynthesis + SpeechRecognition)
- React Hooks
- Context API
- TypeScript
- TailwindCSS
- localStorage

---

*Última actualización: 2026-01-07*
