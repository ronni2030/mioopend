# 🔌 GUÍA DE INTEGRACIÓN BACKEND - OpenBlind Cliente

## ✅ **LO QUE YA ESTÁ HECHO**

### 1. Configuración Central (SIN archivos .env)
- ✅ **`src/config/api.config.ts`** - Configuración de URL y endpoints del backend
- ✅ **`src/services/api/client.ts`** - Cliente Axios configurado
- ✅ **Backend funcionando en**: `http://localhost:8888`

### 2. Servicios Creados y Listos para Usar
- ✅ `src/features/emergency-contacts/services/contactsService.ts`
- ✅ `src/features/support/services/supportService.ts`
- ✅ `src/features/incidents/services/incidentsService.ts`
- ✅ `src/features/settings/services/preferencesService.ts`
- ✅ `src/features/places/services/placesService.new.ts` (actualizado)

---

## 📋 **TAREAS POR ESTUDIANTE**

### **BAJAÑA GUERRERO JOMAR (N°1) - Inicio + Perfil**

**Archivos a modificar:**
- `src/features/users/screens/*` - Pantallas de perfil
- `src/features/users/hooks/useUsers.ts` - Hook para perfil

**Servicio a usar:**
```typescript
import { API_ENDPOINTS } from '../../../config/api.config';
import api from '../../../services/api/client';

// Ejemplo: Obtener usuario
const response = await api.get(API_ENDPOINTS.usuarios.obtener(idUsuario));
const usuario = response.data.data;

// Ejemplo: Actualizar usuario
await api.put(API_ENDPOINTS.usuarios.actualizar(idUsuario), {
  nameUsers: 'Nuevo Nombre',
  emailUser: 'nuevo@email.com',
  phoneUser: '0999999999',
});
```

**Pantallas:**
1. **HomeScreen** - Inicio con botones grandes accesibles
2. **ProfileScreen** - Ver y editar perfil
3. **DeleteAccountScreen** - Solicitar baja de cuenta

---

### **ESTRADA MURILLO ARIEL (N°1) - Preferencias**

**Archivos a modificar:**
- `src/features/settings/screens/*` - Pantallas de preferencias
- `src/features/settings/hooks/usePreferences.ts` - Nuevo hook

**Servicio YA CREADO:**
```typescript
import { preferencesService } from '../services/preferencesService';

// Obtener preferencias del usuario
const preferencias = await preferencesService.getByUsuario(idUsuario);

// Actualizar preferencias
await preferencesService.update(idPreferencias, {
  velocidadVoz: 1.2,
  volumenVoz: 85,
  feedbackHaptico: true,
  nivelDetalleInstrucciones: 'detallado',
});

// Resetear a valores por defecto
await preferencesService.reset(idPreferencias);
```

**Pantallas:**
1. **PreferencesScreen** - Configurar voz, volumen, idioma
2. **AccessibilityScreen** - Alto contraste, tamaño de fuente
3. **ResetPreferencesScreen** - Resetear a valores por defecto

---

### **GUZMAN MONCAYO PAULA (N°1) - Lugares Favoritos**

**Archivos a modificar:**
- `src/features/places/screens/*` - Pantallas de lugares
- `src/features/places/hooks/usePlaces.ts` - Hook de lugares
- **IMPORTANTE:** Reemplazar `placesService.ts` con `placesService.new.ts`

**Servicio YA ACTUALIZADO:**
```typescript
import { placesService } from '../services/placesService.new';

// Obtener lugares del usuario
const lugares = await placesService.getByUsuario(idUsuario);

// Crear lugar favorito
const nuevoLugar = await placesService.createPlace({
  userId: idUsuario.toString(),
  name: 'Mi Casa',
  address: 'Calle Principal 123',
  description: 'Casa familiar',
  type: 'casa',
  latitude: -0.2298500,
  longitude: -78.5249500,
});

// Actualizar lugar
await placesService.updatePlace(idLugar, {
  name: 'Casa (Actualizado)',
  type: 'casa',
});

// Eliminar lugar
await placesService.deletePlace(idLugar);
```

**Pantallas:**
1. **PlacesListScreen** - Listar lugares favoritos con voz
2. **PlaceFormScreen** - Crear/editar lugar
3. **PlaceDetailScreen** - Ver detalle y escuchar información

---

### **BAÑO LEMA DAMARIS (N°1) - Contactos de Emergencia**

**Archivos a modificar:**
- `src/features/emergency-contacts/screens/ContactsScreen.tsx`
- `src/features/emergency-contacts/hooks/useEmergencyContacts.ts`
- **IMPORTANTE:** Actualizar hook para usar el servicio real

**Servicio YA CREADO:**
```typescript
import { contactsService } from '../services/contactsService';

// Obtener contactos del usuario
const contactos = await contactsService.getByUsuario(idUsuario);

// Crear contacto
const nuevoContacto = await contactsService.create({
  idUsuario,
  nombre: 'María',
  apellido: 'Pérez',
  telefono: '0999123456',
  parentesco: 'madre',
});

// Actualizar contacto
await contactsService.update(idContacto, {
  telefono: '0999999999',
});

// Eliminar contacto
await contactsService.delete(idContacto);
```

**Cambio necesario en `useEmergencyContacts.ts`:**
```typescript
// ANTES (estado local):
const [contacts, setContacts] = useState<ContactoEmergencia[]>([]);

// DESPUÉS (con backend):
const [contacts, setContacts] = useState<ContactoEmergencia[]>([]);
const [loading, setLoading] = useState(false);

const loadContacts = async (userId: number) => {
  setLoading(true);
  try {
    const data = await contactsService.getByUsuario(userId);
    setContacts(data);
  } catch (error) {
    console.error('Error loading contacts:', error);
  } finally {
    setLoading(false);
  }
};
```

**Pantallas:**
1. **ContactsListScreen** - Listar contactos con voz
2. **ContactFormScreen** - Crear/editar contacto
3. **ContactDetailScreen** - Ver y escuchar contacto

---

### **MARCILLO GUANIN MARIA (N°2) - Navegación**

**Archivos a modificar:**
- `src/features/navigation/services/navigation.service.ts`
- `src/features/navigation/services/tracking.service.ts`
- `src/features/navigation/screens/*`

**Cambios necesarios:**

**ANTES:**
```typescript
const API_URL = `${import.meta.env.VITE_API_URL}/tracking`; // ❌ NO FUNCIONA
```

**DESPUÉS:**
```typescript
import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';

// Calcular ruta
const response = await api.post(API_ENDPOINTS.navegacion.calcularRuta, {
  idUsuario: 1,
  origen: { latitud: -0.2298500, longitud: -78.5249500 },
  destino: { latitud: -0.2200000, longitud: -78.5100000 },
});
const ruta = response.data.data;

// Iniciar navegación
await api.post(API_ENDPOINTS.navegacion.iniciar, {
  idUsuario,
  origen,
  destino,
});

// Actualizar posición durante navegación
await api.put(API_ENDPOINTS.navegacion.actualizarPosicion, {
  idUsuario,
  latitud,
  longitud,
  precision: 10,
});

// Recalcular ruta si se desvía
await api.post(API_ENDPOINTS.navegacion.recalcular, {
  idUsuario,
  latitud,
  longitud,
});

// Finalizar navegación
await api.post(API_ENDPOINTS.navegacion.finalizar, {
  idUsuario,
  completada: true,
});
```

**Pantallas:**
1. **NavigationScreen** - Navegación en tiempo real con voz
2. **RoutePreviewScreen** - Ver ruta antes de iniciar
3. **TrackingScreen** - Seguimiento GPS en tiempo real

---

### **ATIENCIA CASA LEONARDO (N°2) - Tarjeta + Historial**

**Archivos a modificar:**
- `src/features/identification-card/services/cardService.ts`
- `src/features/identification-card/screens/*`
- `src/features/navigation-history/services/historyService.ts`
- `src/features/navigation-history/screens/*`

**Servicios a usar:**
```typescript
import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';

// === TARJETA MÉDICA ===
// Obtener tarjeta del usuario
const response = await api.get(API_ENDPOINTS.tarjetaMedica.porUsuario(idUsuario));
const tarjeta = response.data.data;

// Crear tarjeta
await api.post(API_ENDPOINTS.tarjetaMedica.crear, {
  idUsuario,
  nombreCompleto: 'Juan Pérez',
  tipoSangre: 'O+',
  alergias: 'Penicilina',
  condicionesMedicas: 'Diabetes',
  medicamentos: 'Insulina',
  contactoEmergencia: '0999123456',
});

// Actualizar tarjeta
await api.put(API_ENDPOINTS.tarjetaMedica.actualizar(idTarjeta), {
  contactoEmergencia: '0999999999',
});

// === HISTORIAL DE RUTAS ===
// Obtener historial del usuario
const historialResponse = await api.get(
  API_ENDPOINTS.historialRutas.porUsuario(idUsuario)
);
const rutas = historialResponse.data.data;

// Marcar ruta como favorita
await api.post(API_ENDPOINTS.historialRutas.marcarFavorita(idRuta));

// Eliminar ruta específica
await api.delete(API_ENDPOINTS.historialRutas.eliminar(idRuta));

// Limpiar todo el historial
await api.delete(API_ENDPOINTS.historialRutas.limpiar(idUsuario));
```

**Pantallas:**
1. **CardViewScreen** - Ver tarjeta con QR
2. **CardSetupScreen** - Crear/editar tarjeta
3. **HistoryListScreen** - Listar rutas pasadas
4. **HistoryDetailScreen** - Ver detalle de ruta

---

### **TIPANLUISA CEVALLOS OSCAR (N°3) - Incidencias + Soporte**

**Archivos a modificar:**
- `src/features/incidents/screens/*`
- `src/features/incidents/hooks/useIncidents.ts` - Nuevo hook
- `src/features/support/screens/*`
- `src/features/support/hooks/useSupport.ts` - Nuevo hook

**Servicios YA CREADOS:**
```typescript
import { incidentsService } from '../services/incidentsService';
import { supportService } from '../services/supportService';

// === INCIDENCIAS ===
// Obtener incidencias del usuario
const incidencias = await incidentsService.getByUsuario(idUsuario);

// Obtener incidencias cercanas a la ruta
const cercanas = await incidentsService.getNearby(latitud, longitud, 1000);

// Reportar incidencia
await incidentsService.create({
  idUsuario,
  tipo: 'obstaculo',
  descripcion: 'Bache grande en la acera',
  latitud: -0.2298500,
  longitud: -78.5249500,
});

// Cerrar incidencia
await incidentsService.close(idIncidencia);

// === SOPORTE ===
// Obtener tickets del usuario
const tickets = await supportService.getByUsuario(idUsuario);

// Crear ticket
await supportService.create({
  idUsuario,
  asunto: 'Problema con navegación',
  descripcion: 'La voz no funciona correctamente',
  prioridad: 'alta',
});

// Agregar más detalles al ticket
await supportService.update(idTicket, {
  descripcion: 'La voz no funciona correctamente. Actualización: ahora funciona a veces.',
});
```

**Pantallas:**
1. **IncidentsListScreen** - Ver incidencias cercanas
2. **ReportIncidentScreen** - Reportar obstáculo/obra
3. **SupportListScreen** - Ver mis tickets
4. **CreateTicketScreen** - Crear ticket de soporte

---

## 🔧 **PASOS PARA INTEGRAR**

### Paso 1: Actualizar archivos de servicio
```bash
# Reemplazar placesService.ts con el nuevo
cd src/features/places/services
mv placesService.ts placesService.old.ts
mv placesService.new.ts placesService.ts
```

### Paso 2: Actualizar imports en componentes
```typescript
// ANTES:
const API_URL = "http://localhost:8888/tracking"; // ❌

// DESPUÉS:
import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';
```

### Paso 3: Cambiar llamadas a API
```typescript
// ANTES:
const res = await fetch(`${API_URL}/algo`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// DESPUÉS:
const response = await api.post(API_ENDPOINTS.algo, data);
const resultado = response.data.data;
```

### Paso 4: Manejar errores
```typescript
try {
  const data = await contactsService.create(nuevoContacto);
  // Éxito
} catch (error) {
  console.error('Error:', error);
  // Mostrar mensaje de error al usuario
}
```

---

## 🚀 **INICIAR EL BACKEND**

```bash
# En otra terminal, ir al backend
cd c:\Users\user\Desktop\openblind\openblind-back-nuevo

# Iniciar servidor
npm start

# El backend estará en: http://localhost:8888
```

---

## 📝 **NOTAS IMPORTANTES**

1. **NO usar archivos .env** - Todo está en `src/config/api.config.ts`
2. **Formato de respuesta del backend**:
   ```json
   {
     "success": true,
     "message": "Mensaje descriptivo",
     "data": { /* tus datos aquí */ }
   }
   ```
3. **IDs del backend son numéricos** - Convertir a string si es necesario en el frontend
4. **Borrado lógico vs físico**:
   - Contactos y Lugares: borrado FÍSICO (DELETE real)
   - Usuarios y Tickets: borrado LÓGICO (campo `activo: false`)
5. **Voice Synthesis**: Usar Web Speech API en el frontend, NO en backend

---

## ✅ **CHECKLIST DE INTEGRACIÓN**

Por cada módulo:
- [ ] Importar servicio correcto desde `services/`
- [ ] Usar `API_ENDPOINTS` de `config/api.config.ts`
- [ ] Manejar estados de carga (`loading`)
- [ ] Manejar errores con try/catch
- [ ] Mostrar feedback al usuario (éxito/error)
- [ ] Probar CRUD completo:
  - [ ] CREATE
  - [ ] READ (listar y obtener por ID)
  - [ ] UPDATE
  - [ ] DELETE

---

## 🆘 **AYUDA**

Si tienen problemas:
1. Verificar que el backend esté corriendo en `http://localhost:8888`
2. Revisar consola del navegador (F12) para ver errores
3. Revisar consola del backend para ver requests
4. Verificar que los datos enviados coincidan con el formato esperado
