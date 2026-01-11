/**
 * Configuración COMPLETA - Todas las preferencias del usuario
 * Incluye: Voz, Idioma, Háptico, Detalle, Fuente, Alto Contraste, Tema
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';
import { useTheme } from '../shared/contexts/ThemeContext';
import { usePreferences } from '../features/settings/hooks/usePreferences';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, Button } from '../shared/components/ui';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useVoiceNavigation();
  const { mode, setMode } = useTheme();
  const [userId] = useState(1);
  const { preferences, updatePreferences, resetPreferences } = usePreferences(userId);

  // Estados locales para todos los ajustes
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(100);
  const [language, setLanguage] = useState<number>(1); // 1=Español, 2=Inglés
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [detailLevel, setDetailLevel] = useState<'basico' | 'medio' | 'detallado'>('medio');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'pequeno' | 'mediano' | 'grande' | 'extra_grande'>('mediano');

  useEffect(() => {
    if (preferences) {
      setVoiceRate(preferences.velocidadVoz);
      setVoiceVolume(preferences.volumenVoz);
      setLanguage(preferences.idIdioma);
      setHapticFeedback(preferences.feedbackHaptico);
      setDetailLevel(preferences.nivelDetalleInstrucciones);
      setHighContrast(preferences.modoAltoContraste);
      setFontSize(preferences.tamanoFuente);
    }
  }, [preferences]);

  const handleVoiceRateChange = async (newRate: number) => {
    setVoiceRate(newRate);
    localStorage.setItem('voiceRate', newRate.toString());
    await updatePreferences({ velocidadVoz: newRate });
    speak(`Velocidad ajustada a ${newRate.toFixed(1)}`, 'high');
  };

  const handleVoiceVolumeChange = async (newVolume: number) => {
    setVoiceVolume(newVolume);
    localStorage.setItem('voiceVolume', (newVolume / 100).toString());
    await updatePreferences({ volumenVoz: newVolume });
    speak(`Volumen ajustado a ${newVolume} por ciento`, 'high');
  };

  const handleLanguageChange = async (newLang: number) => {
    setLanguage(newLang);
    await updatePreferences({ idIdioma: newLang });
    speak(newLang === 1 ? 'Idioma cambiado a Español' : 'Language changed to English', 'high');
  };

  const handleHapticChange = async (enabled: boolean) => {
    setHapticFeedback(enabled);
    await updatePreferences({ feedbackHaptico: enabled });
    speak(`Feedback háptico ${enabled ? 'activado' : 'desactivado'}`, 'high');
  };

  const handleDetailLevelChange = async (level: 'basico' | 'medio' | 'detallado') => {
    setDetailLevel(level);
    await updatePreferences({ nivelDetalleInstrucciones: level });
    speak(`Nivel de detalle cambiado a ${level}`, 'high');
  };

  const handleFontSizeChange = async (size: 'pequeno' | 'mediano' | 'grande' | 'extra_grande') => {
    setFontSize(size);
    await updatePreferences({ tamanoFuente: size });
    speak(`Tamaño de fuente cambiado a ${size}`, 'high');
  };

  const handleHighContrastChange = async (enabled: boolean) => {
    setHighContrast(enabled);
    await updatePreferences({ modoAltoContraste: enabled });
    speak(`Alto contraste ${enabled ? 'activado' : 'desactivado'}`, 'high');
  };

  const handleResetPreferences = async () => {
    if (window.confirm('¿Estás seguro de restablecer todas las preferencias a los valores por defecto?')) {
      const success = await resetPreferences();
      if (success) {
        speak('Preferencias restablecidas correctamente', 'high');
      }
    }
  };

  const testVoice = () => {
    speak('Prueba de voz con tu configuración actual', 'high');
  };

  return (
    <PageLayout title="Configuración">
      <div className="space-y-5 pb-6">
        {/* Velocidad de Voz */}
        <Card className="stagger-item">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl bounce-soft">🎤</span>
              <span className="text-xl font-bold drop-shadow">Velocidad de Voz</span>
            </div>
            <span className="text-purple-300 font-mono font-bold text-lg">{voiceRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={voiceRate}
            onChange={(e) => handleVoiceRateChange(parseFloat(e.target.value))}
            className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-sm text-purple-300 mt-2 font-semibold">
            <span>🐌 Lento</span>
            <span>🚀 Rápido</span>
          </div>
        </Card>

        {/* Volumen */}
        <Card className="stagger-item" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl bounce-soft">🔊</span>
              <span className="text-xl font-bold drop-shadow">Volumen</span>
            </div>
            <span className="text-purple-300 font-mono font-bold text-lg">{voiceVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={voiceVolume}
            onChange={(e) => handleVoiceVolumeChange(parseInt(e.target.value))}
            className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-sm text-purple-300 mt-2 font-semibold">
            <span>🔇 Bajo</span>
            <span>📢 Alto</span>
          </div>
        </Card>

        <Button
          onClick={testVoice}
          variant="primary"
          fullWidth
          className="stagger-item"
          style={{ animationDelay: '0.2s' }}
        >
          🎤 Probar Voz
        </Button>

        {/* Idioma */}
        <Card className="stagger-item" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-bold drop-shadow mb-4 flex items-center gap-3">
            <span className="bounce-soft text-3xl">🌍</span>
            Idioma / Language
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLanguageChange(1)}
              className={`p-5 rounded-2xl text-lg font-bold smooth-transition ${
                language === 1
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              🇪🇸 Español
            </button>
            <button
              onClick={() => handleLanguageChange(2)}
              className={`p-5 rounded-2xl text-lg font-bold smooth-transition ${
                language === 2
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </Card>

        {/* Feedback Háptico */}
        <Card className="stagger-item" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl bounce-soft">📳</span>
              <span className="text-xl font-bold drop-shadow">Vibración</span>
            </div>
            <button
              onClick={() => handleHapticChange(!hapticFeedback)}
              className={`px-8 py-3 rounded-2xl font-bold text-lg smooth-transition ${
                hapticFeedback
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white/10 text-purple-300'
              }`}
            >
              {hapticFeedback ? 'ON' : 'OFF'}
            </button>
          </div>
        </Card>

        {/* Nivel de Detalle de Instrucciones */}
        <Card className="stagger-item" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-xl font-bold drop-shadow mb-4 flex items-center gap-3">
            <span className="bounce-soft text-3xl">📋</span>
            Detalle de Instrucciones
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleDetailLevelChange('basico')}
              className={`p-4 rounded-xl text-base font-bold smooth-transition ${
                detailLevel === 'basico'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              Básico
            </button>
            <button
              onClick={() => handleDetailLevelChange('medio')}
              className={`p-4 rounded-xl text-base font-bold smooth-transition ${
                detailLevel === 'medio'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              Medio
            </button>
            <button
              onClick={() => handleDetailLevelChange('detallado')}
              className={`p-4 rounded-xl text-base font-bold smooth-transition ${
                detailLevel === 'detallado'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              Detallado
            </button>
          </div>
        </Card>

        {/* Tamaño de Fuente */}
        <Card className="stagger-item" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-xl font-bold drop-shadow mb-4 flex items-center gap-3">
            <span className="bounce-soft text-3xl">🔤</span>
            Tamaño de Texto
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleFontSizeChange('pequeno')}
              className={`p-4 rounded-xl text-xs font-bold smooth-transition ${
                fontSize === 'pequeno'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              Pequeño
            </button>
            <button
              onClick={() => handleFontSizeChange('mediano')}
              className={`p-4 rounded-xl text-sm font-bold smooth-transition ${
                fontSize === 'mediano'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              Mediano
            </button>
            <button
              onClick={() => handleFontSizeChange('grande')}
              className={`p-4 rounded-xl text-base font-bold smooth-transition ${
                fontSize === 'grande'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              Grande
            </button>
            <button
              onClick={() => handleFontSizeChange('extra_grande')}
              className={`p-4 rounded-xl text-lg font-bold smooth-transition ${
                fontSize === 'extra_grande'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              Extra Grande
            </button>
          </div>
        </Card>

        {/* Alto Contraste */}
        <Card className="stagger-item" style={{ animationDelay: '0.7s' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl bounce-soft">⚫⚪</span>
              <span className="text-xl font-bold drop-shadow">Alto Contraste</span>
            </div>
            <button
              onClick={() => handleHighContrastChange(!highContrast)}
              className={`px-8 py-3 rounded-2xl font-bold text-lg smooth-transition ${
                highContrast
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 text-purple-300'
              }`}
            >
              {highContrast ? 'ON' : 'OFF'}
            </button>
          </div>
        </Card>

        {/* Modo Visual (Tema) */}
        <Card className="stagger-item" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-xl font-bold drop-shadow mb-4 flex items-center gap-3">
            <span className="bounce-soft text-3xl">🎨</span>
            Tema Visual
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setMode('light')}
              className={`p-5 rounded-2xl text-base font-bold smooth-transition ${
                mode === 'light'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              ☀️ Claro
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`p-5 rounded-2xl text-base font-bold smooth-transition ${
                mode === 'dark'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              🌙 Oscuro
            </button>
            <button
              onClick={() => setMode('high-contrast')}
              className={`p-5 rounded-2xl text-base font-bold smooth-transition ${
                mode === 'high-contrast'
                  ? 'bg-purple-600 scale-105 shadow-lg border-3 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              ⚫⚪ Alto
            </button>
          </div>
        </Card>

        {/* Botón Resetear */}
        <Button
          onClick={handleResetPreferences}
          variant="danger"
          fullWidth
          className="stagger-item"
          style={{ animationDelay: '0.9s' }}
        >
          🔄 Restablecer a Valores por Defecto
        </Button>

        <Card className="stagger-item bg-purple-900/30 border border-purple-500/30" style={{ animationDelay: '1.0s' }}>
          <p className="text-lg text-purple-100 flex items-start gap-3 leading-relaxed">
            <span className="text-3xl bounce-soft">💡</span>
            <span>Todas tus configuraciones se guardan automáticamente y se sincronizan con el backend.</span>
          </p>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
