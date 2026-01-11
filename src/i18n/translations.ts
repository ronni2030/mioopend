/**
 * Sistema de Internacionalización (i18n) - OpenBlind
 * Español e Inglés completo
 */

export const translations = {
  es: {
    // General
    appName: 'OpenBlind',
    appTagline: 'Tu asistente de navegación accesible',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    back: 'Volver',
    next: 'Siguiente',

    // Navegación
    navigation: 'Navegación',
    myLocation: 'Mi Ubicación',
    places: 'Lugares',
    emergency: 'Emergencia',
    incidents: 'Incidencias',
    support: 'Soporte',
    history: 'Historial',
    myCard: 'Mi Tarjeta',
    profile: 'Perfil',
    settings: 'Ajustes',

    // HomePage
    welcomeMessage: 'Bienvenido a OpenBlind. Di ubicación para saber dónde estás, o di guía para iniciar navegación.',
    gpsActive: 'GPS Activo',
    voiceOn: 'Voz ON',
    modules: 'Módulos',
    mainMenu: 'Menú Principal',
    voiceHelp: 'Ayuda por Voz',
    helpMessage: 'Para navegar, di el nombre de la opción',

    // Navegación
    calculateRoute: 'Calcular Ruta',
    startNavigation: 'Iniciar Navegación',
    stopNavigation: 'Detener Navegación',
    origin: 'Origen',
    destination: 'Destino',
    duration: 'Duración',
    distance: 'Distancia',
    steps: 'Pasos',
    currentLocation: 'Ubicación Actual',
    selectDestination: 'Seleccionar Destino',

    // Lugares
    favoritePlace: 'Lugar Favorito',
    addPlace: 'Agregar Lugar',
    searchPlace: 'Buscar Lugar',
    nearbyPlaces: 'Lugares Cercanos',

    // Emergencia
    emergencyContacts: 'Contactos de Emergencia',
    addContact: 'Agregar Contacto',
    callEmergency: 'Llamar Emergencia',

    // Configuración
    language: 'Idioma',
    spanish: 'Español',
    english: 'Inglés',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    voiceSpeed: 'Velocidad de Voz',
    voiceVolume: 'Volumen de Voz',
    theme: 'Tema',
    accessibility: 'Accesibilidad',

    // Comandos de voz
    voiceCommands: {
      navigation: ['navegación', 'navegar', 'guía'],
      location: ['ubicación', 'dónde estoy', 'mi ubicación'],
      places: ['lugares', 'favoritos'],
      emergency: ['emergencia', 'ayuda', 'sos'],
      settings: ['ajustes', 'configuración', 'opciones'],
      darkMode: ['modo oscuro', 'tema oscuro'],
      lightMode: ['modo claro', 'tema claro'],
      changeLanguage: ['cambiar idioma', 'idioma inglés', 'cambiar a inglés'],
      back: ['volver', 'atrás', 'regresar'],
    },

    // Mensajes de voz
    voiceMessages: {
      navigatingTo: 'Navegando a',
      languageChanged: 'Idioma cambiado a',
      darkModeEnabled: 'Modo oscuro activado',
      lightModeEnabled: 'Modo claro activado',
      commandNotUnderstood: 'No entendí el comando',
      listeningCommand: 'Escuchando comando...',
    },
  },

  en: {
    // General
    appName: 'OpenBlind',
    appTagline: 'Your accessible navigation assistant',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',

    // Navigation
    navigation: 'Navigation',
    myLocation: 'My Location',
    places: 'Places',
    emergency: 'Emergency',
    incidents: 'Incidents',
    support: 'Support',
    history: 'History',
    myCard: 'My Card',
    profile: 'Profile',
    settings: 'Settings',

    // HomePage
    welcomeMessage: 'Welcome to OpenBlind. Say location to know where you are, or say guide to start navigation.',
    gpsActive: 'GPS Active',
    voiceOn: 'Voice ON',
    modules: 'Modules',
    mainMenu: 'Main Menu',
    voiceHelp: 'Voice Help',
    helpMessage: 'To navigate, say the option name',

    // Navigation
    calculateRoute: 'Calculate Route',
    startNavigation: 'Start Navigation',
    stopNavigation: 'Stop Navigation',
    origin: 'Origin',
    destination: 'Destination',
    duration: 'Duration',
    distance: 'Distance',
    steps: 'Steps',
    currentLocation: 'Current Location',
    selectDestination: 'Select Destination',

    // Places
    favoritePlace: 'Favorite Place',
    addPlace: 'Add Place',
    searchPlace: 'Search Place',
    nearbyPlaces: 'Nearby Places',

    // Emergency
    emergencyContacts: 'Emergency Contacts',
    addContact: 'Add Contact',
    callEmergency: 'Call Emergency',

    // Settings
    language: 'Language',
    spanish: 'Spanish',
    english: 'English',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    voiceSpeed: 'Voice Speed',
    voiceVolume: 'Voice Volume',
    theme: 'Theme',
    accessibility: 'Accessibility',

    // Voice commands
    voiceCommands: {
      navigation: ['navigation', 'navigate', 'guide'],
      location: ['location', 'where am i', 'my location'],
      places: ['places', 'favorites'],
      emergency: ['emergency', 'help', 'sos'],
      settings: ['settings', 'configuration', 'options'],
      darkMode: ['dark mode', 'dark theme'],
      lightMode: ['light mode', 'light theme'],
      changeLanguage: ['change language', 'spanish language', 'change to spanish'],
      back: ['back', 'return', 'go back'],
    },

    // Voice messages
    voiceMessages: {
      navigatingTo: 'Navigating to',
      languageChanged: 'Language changed to',
      darkModeEnabled: 'Dark mode enabled',
      lightModeEnabled: 'Light mode enabled',
      commandNotUnderstood: 'Command not understood',
      listeningCommand: 'Listening for command...',
    },
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.es;
