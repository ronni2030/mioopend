/**
 * HomePage - Rediseñada completamente
 * Diseño moderno, limpio, profesional y funcional
 * Con i18n completo y control por voz total
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/i18nContext';
import { useVoiceControl } from '../hooks/useVoiceControl';

interface MenuOption {
  id: string;
  titleKey: string;
  icon: string;
  route: string;
  color: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, speak } = useI18n();
  const { listenOnce, isListening } = useVoiceControl({ enabled: true, continuous: false });

  const menuOptions: MenuOption[] = [
    {
      id: 'navigation',
      titleKey: 'navigation',
      icon: '🧭',
      route: '/navigation',
      color: 'from-purple-600 to-purple-700',
    },
    {
      id: 'location',
      titleKey: 'myLocation',
      icon: '📍',
      route: '/location',
      color: 'from-blue-600 to-blue-700',
    },
    {
      id: 'places',
      titleKey: 'places',
      icon: '⭐',
      route: '/places',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'emergency',
      titleKey: 'emergency',
      icon: '🚨',
      route: '/emergency-contacts',
      color: 'from-red-600 to-red-700',
    },
    {
      id: 'incidents',
      titleKey: 'incidents',
      icon: '⚠️',
      route: '/incidents',
      color: 'from-yellow-600 to-yellow-700',
    },
    {
      id: 'support',
      titleKey: 'support',
      icon: '💬',
      route: '/support',
      color: 'from-green-600 to-green-700',
    },
    {
      id: 'history',
      titleKey: 'history',
      icon: '📜',
      route: '/history',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'idcard',
      titleKey: 'myCard',
      icon: '🆔',
      route: '/view-card',
      color: 'from-indigo-600 to-indigo-700',
    },
    {
      id: 'profile',
      titleKey: 'profile',
      icon: '👤',
      route: '/profile',
      color: 'from-purple-600 to-purple-700',
    },
    {
      id: 'settings',
      titleKey: 'settings',
      icon: '⚙️',
      route: '/settings',
      color: 'from-gray-600 to-gray-700',
    },
  ];

  // Mensaje de bienvenida al cargar
  useEffect(() => {
    speak(t('welcomeMessage'), 'high');
  }, []);

  const handleOptionClick = (option: MenuOption) => {
    speak(`${t('voiceMessages.navigatingTo')} ${t(option.titleKey)}`, 'high');
    navigate(option.route);
  };

  const handleVoiceButton = () => {
    speak(t('helpMessage'), 'high');
    listenOnce();
  };

  return (
    <div className="min-h-screen animated-gradient text-white main-container">
      {/* Header Moderno */}
      <header className="modern-header fade-in">
        <h1>{t('appName')}</h1>
        <p>{t('appTagline')}</p>
      </header>

      {/* Tarjeta de Estadísticas */}
      <div className="stats-card fade-in">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="icon">📍</div>
            <div className="label">{t('gpsActive')}</div>
          </div>
          <div className="stat-item">
            <div className="icon">🎤</div>
            <div className="label">{t('voiceOn')}</div>
          </div>
          <div className="stat-item">
            <div className="icon text-yellow-300 font-bold">{menuOptions.length}</div>
            <div className="label">{t('modules')}</div>
          </div>
        </div>
      </div>

      {/* Encabezado del menú */}
      <div className="px-4 mb-4 flex justify-between items-center fade-in">
        <h2 className="text-xl font-black">{t('mainMenu')}</h2>
        <button
          onClick={handleVoiceButton}
          className="text-sm text-purple-300 hover:text-white font-bold px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20"
          aria-label={t('voiceHelp')}
        >
          🎤 {t('voiceHelp')}
        </button>
      </div>

      {/* Grid de opciones - Tamaño NORMAL */}
      <div className="grid-2-cols">
        {menuOptions.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            onFocus={() => speak(t(option.titleKey))}
            className="menu-button stagger-item ripple"
            style={{ animationDelay: `${index * 0.05}s` }}
            aria-label={t(option.titleKey)}
          >
            <div className="icon">{option.icon}</div>
            <div className="label">{t(option.titleKey)}</div>
          </button>
        ))}
      </div>

      {/* Botón flotante de voz */}
      <button
        onClick={handleVoiceButton}
        className="floating-button"
        aria-label={t('voiceHelp')}
      >
        <span className="icon">🎤</span>
      </button>
    </div>
  );
};

export default HomePage;
