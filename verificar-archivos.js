/**
 * Script de verificación de archivos críticos
 * Ejecutar: node verificar-archivos.js
 */

const fs = require('fs');
const path = require('path');

const ARCHIVOS_CRITICOS = [
  // i18n
  'src/i18n/translations.ts',
  'src/i18n/i18nContext.tsx',

  // Hooks
  'src/hooks/useVoiceControl.tsx',

  // Servicios
  'src/services/geocoding.ts',

  // Páginas principales
  'src/pages/HomePage.tsx',
  'src/pages/SettingsPage.tsx',

  // Configuración
  'src/config/api.config.ts',
  'src/main.tsx',
  'src/index.css',

  // Documentación
  'CAMBIOS_CRITICOS_APLICADOS.md',
  'INICIO_RAPIDO.md',
  'EJEMPLO_USO_VOICE_I18N.md',
  'CHECKLIST_VERIFICACION.md',
];

const ARCHIVOS_BACKEND = [
  '../openblind-back-nuevo/src/config/keys.js',
  '../openblind-back-nuevo/src/application/services/NavigationService.js',
  '../openblind-back-nuevo/app.js',
];

console.log('\n🔍 VERIFICANDO ARCHIVOS CRÍTICOS...\n');

let todoOK = true;
let archivosEncontrados = 0;
let archivosFaltantes = 0;

// Verificar archivos del frontend
console.log('📁 FRONTEND:\n');
ARCHIVOS_CRITICOS.forEach(archivo => {
  const existe = fs.existsSync(path.join(__dirname, archivo));
  if (existe) {
    console.log(`✅ ${archivo}`);
    archivosEncontrados++;
  } else {
    console.log(`❌ ${archivo} - FALTANTE`);
    archivosFaltantes++;
    todoOK = false;
  }
});

// Verificar archivos del backend
console.log('\n📁 BACKEND:\n');
ARCHIVOS_BACKEND.forEach(archivo => {
  const existe = fs.existsSync(path.join(__dirname, archivo));
  if (existe) {
    console.log(`✅ ${archivo}`);
    archivosEncontrados++;
  } else {
    console.log(`⚠️  ${archivo} - FALTANTE (verificar ruta)`);
  }
});

// Verificar configuración de API Key
console.log('\n🔑 VERIFICANDO API KEY...\n');
try {
  const keysPath = path.join(__dirname, '../openblind-back-nuevo/src/config/keys.js');
  if (fs.existsSync(keysPath)) {
    const keysContent = fs.readFileSync(keysPath, 'utf8');
    if (keysContent.includes('OPENROUTE_API_KEY')) {
      const match = keysContent.match(/OPENROUTE_API_KEY\s*=\s*['"](.+)['"]/);
      if (match && match[1] && match[1] !== 'TU_API_KEY_AQUI') {
        console.log('✅ API Key de OpenRouteService configurada');
        console.log(`   Key: ${match[1].substring(0, 20)}...`);
      } else {
        console.log('❌ API Key no configurada correctamente');
        todoOK = false;
      }
    }
  }
} catch (error) {
  console.log('⚠️  No se pudo verificar API Key');
}

// Verificar package.json
console.log('\n📦 VERIFICANDO DEPENDENCIAS...\n');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const deps = Object.keys(packageJson.dependencies || {}).length;
  console.log(`✅ ${deps} dependencias en package.json`);

  if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('✅ node_modules existe');
  } else {
    console.log('⚠️  node_modules no existe - ejecutar: npm install');
  }
} catch (error) {
  console.log('❌ Error leyendo package.json');
  todoOK = false;
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN:');
console.log('='.repeat(50));
console.log(`✅ Archivos encontrados: ${archivosEncontrados}`);
console.log(`❌ Archivos faltantes: ${archivosFaltantes}`);

if (todoOK) {
  console.log('\n✅ TODO LISTO - Puedes iniciar la aplicación\n');
  console.log('Comandos:');
  console.log('  Backend:  cd ../openblind-back-nuevo && npm start');
  console.log('  Frontend: npm run dev\n');
} else {
  console.log('\n❌ HAY PROBLEMAS - Revisar archivos faltantes\n');
  process.exit(1);
}
