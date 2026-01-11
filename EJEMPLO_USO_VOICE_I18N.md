# EJEMPLO DE USO - Voice Control & i18n

## Cómo integrar en cualquier página

### 1. Importar los hooks

```typescript
import { useI18n } from '../i18n/i18nContext';
import { useVoiceControl } from '../hooks/useVoiceControl';
```

### 2. Usar en el componente

```typescript
const MiPagina: React.FC = () => {
  const { t, speak, language, changeLanguage } = useI18n();
  const { listenOnce, startListening, stopListening } = useVoiceControl({
    enabled: true,
    continuous: false,
  });

  // Hablar al cargar la página
  useEffect(() => {
    speak(t('welcomeMessage'), 'high');
  }, []);

  return (
    <div>
      <h1>{t('appName')}</h1>
      <button onClick={() => listenOnce()}>
        🎤 {t('voiceHelp')}
      </button>
    </div>
  );
};
```

---

## Traducciones personalizadas

### Agregar nuevas traducciones

**Archivo:** `src/i18n/translations.ts`

```typescript
export const translations = {
  es: {
    // ... traducciones existentes
    miNuevaClave: 'Mi nuevo texto en español',
    miSeccion: {
      titulo: 'Título de sección',
      descripcion: 'Descripción aquí',
    },
  },
  en: {
    // ... traducciones existentes
    miNuevaClave: 'My new text in English',
    miSeccion: {
      titulo: 'Section title',
      descripcion: 'Description here',
    },
  },
};
```

### Usar traducciones anidadas

```typescript
// Traducción simple
t('miNuevaClave')  // "Mi nuevo texto en español"

// Traducción anidada
t('miSeccion.titulo')  // "Título de sección"
t('miSeccion.descripcion')  // "Descripción aquí"
```

---

## Comandos de voz personalizados

### Agregar comando personalizado

```typescript
const { listenOnce } = useVoiceControl({
  enabled: true,
  continuous: false,
  onCommand: (cmd) => {
    // Manejar comando personalizado
    if (cmd.includes('buscar')) {
      const query = cmd.replace('buscar', '').trim();
      buscarLugar(query);
      speak(`Buscando ${query}`, 'high');
    }
  },
});
```

---

## Ejemplo completo: Página de Navegación

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/i18nContext';
import { useVoiceControl } from '../hooks/useVoiceControl';
import { navigationService } from '../services/navigation.service';

const NavigationPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, speak } = useI18n();
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [ruta, setRuta] = useState(null);

  // Control por voz personalizado
  const { listenOnce } = useVoiceControl({
    enabled: true,
    onCommand: (cmd) => {
      if (cmd.includes('calcular')) {
        calcularRuta();
      } else if (cmd.includes('cancelar')) {
        navigate(-1);
      }
    },
  });

  // Mensaje de bienvenida
  useEffect(() => {
    speak(t('navigation'), 'high');
  }, []);

  const calcularRuta = async () => {
    try {
      speak(t('calculateRoute'), 'high');

      const resultado = await navigationService.calcularRuta({
        idUsuario: 1,
        origen: { latitud: -0.22, longitud: -78.52 },
        destino: { latitud: -0.23, longitud: -78.51 },
      });

      setRuta(resultado.ruta);
      speak(`${t('success')}. ${t('duration')}: ${resultado.ruta.duracion.texto}`, 'high');
    } catch (error) {
      speak(t('error'), 'high');
    }
  };

  return (
    <div className="min-h-screen animated-gradient text-white main-container">
      {/* Header */}
      <header className="modern-header fade-in">
        <h1>{t('navigation')}</h1>
        <p>{t('calculateRoute')}</p>
      </header>

      {/* Formulario */}
      <div className="px-4 space-y-4">
        <div className="card-modern">
          <label className="block text-sm font-bold mb-2">
            {t('origin')}
          </label>
          <input
            type="text"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            onFocus={() => speak(t('origin'))}
            className="input-modern"
            placeholder={t('origin')}
          />
        </div>

        <div className="card-modern">
          <label className="block text-sm font-bold mb-2">
            {t('destination')}
          </label>
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            onFocus={() => speak(t('destination'))}
            className="input-modern"
            placeholder={t('destination')}
          />
        </div>

        <button
          onClick={calcularRuta}
          onFocus={() => speak(t('calculateRoute'))}
          className="btn-modern primary w-full"
        >
          🧭 {t('calculateRoute')}
        </button>

        {ruta && (
          <div className="card-modern">
            <h3 className="text-lg font-bold mb-2">{t('steps')}</h3>
            <p>⏱️ {t('duration')}: {ruta.duracion.texto}</p>
            <p>📏 {t('distance')}: {ruta.distancia.texto}</p>
          </div>
        )}
      </div>

      {/* Botón flotante de voz */}
      <button
        onClick={() => listenOnce()}
        className="floating-button"
        aria-label={t('voiceHelp')}
      >
        <span className="icon">🎤</span>
      </button>
    </div>
  );
};

export default NavigationPage;
```

---

## Buenas prácticas

### 1. Siempre usar traducciones
```typescript
// ❌ Mal
<h1>Navegación</h1>

// ✅ Bien
<h1>{t('navigation')}</h1>
```

### 2. Priorizar mensajes de voz
```typescript
// Prioridad alta - interrumpe mensajes anteriores
speak('Mensaje urgente', 'high');

// Prioridad media - mensaje normal
speak('Información', 'medium');

// Prioridad baja - puede esperar
speak('Tip', 'low');
```

### 3. Accesibilidad con onFocus
```typescript
<button
  onClick={handleClick}
  onFocus={() => speak(t('buttonLabel'))}
  aria-label={t('buttonLabel')}
>
  {t('buttonLabel')}
</button>
```

### 4. Manejar errores con voz
```typescript
try {
  await accion();
  speak(t('success'), 'high');
} catch (error) {
  speak(t('error'), 'high');
  console.error(error);
}
```

---

## Estilos CSS disponibles

```typescript
// Contenedores
className="animated-gradient"     // Fondo con gradiente animado
className="main-container"        // Contenedor principal con padding

// Headers
className="modern-header"         // Header moderno con gradiente

// Botones
className="btn-modern"            // Botón normal blanco
className="btn-modern primary"    // Botón morado
className="btn-modern secondary"  // Botón morado claro
className="btn-modern accent"     // Botón morado pastel
className="menu-button"           // Botón de menú (100px)
className="floating-button"       // Botón flotante (56px)

// Tarjetas
className="card-modern"           // Tarjeta con glass effect
className="stats-card"            // Tarjeta de estadísticas

// Grids
className="grid-2-cols"           // Grid de 2 columnas responsive

// Inputs
className="input-modern"          // Input con estilo moderno

// Animaciones
className="fade-in"               // Fade in suave
className="stagger-item"          // Aparece escalonado
className="ripple"                // Efecto ripple al click
className="smooth-transition"     // Transición suave

// Utilidades
className="glass-effect"          // Efecto cristal
```

---

## Testing de voz

### Probar reconocimiento
```typescript
const { listenOnce } = useVoiceControl({
  enabled: true,
  onCommand: (cmd) => {
    console.log('Comando detectado:', cmd);
  },
});
```

### Verificar idioma
```typescript
const { language } = useI18n();
console.log('Idioma actual:', language);  // 'es' o 'en'
```

---

## Estructura recomendada para nuevas páginas

```typescript
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/i18nContext';
import { useVoiceControl } from '../hooks/useVoiceControl';

const MiNuevaPagina: React.FC = () => {
  const navigate = useNavigate();
  const { t, speak } = useI18n();
  const { listenOnce } = useVoiceControl({ enabled: true });

  // 1. Mensaje de bienvenida
  useEffect(() => {
    speak(t('welcomeMessage'), 'high');
  }, []);

  // 2. Funciones de la página
  const handleAction = () => {
    speak(t('actionMessage'), 'high');
    // lógica aquí
  };

  // 3. Render
  return (
    <div className="min-h-screen animated-gradient text-white main-container">
      <header className="modern-header fade-in">
        <h1>{t('pageTitle')}</h1>
        <p>{t('pageDescription')}</p>
      </header>

      <div className="px-4 space-y-4">
        {/* Contenido aquí */}
      </div>

      <button onClick={() => listenOnce()} className="floating-button">
        <span className="icon">🎤</span>
      </button>
    </div>
  );
};

export default MiNuevaPagina;
```

---

¡Todo listo! Ahora puedes crear páginas accesibles con voz e i18n.
