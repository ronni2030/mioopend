/**
 * Bottom Navigation Bar - Navegación principal de la app
 * Diseño estético con glassmorphism
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVoiceNavigation } from '../../contexts/VoiceNavigationContext';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'home', icon: '🏠', label: 'Inicio', path: '/' },
  { id: 'navigation', icon: '🧭', label: 'Navegar', path: '/navigation' },
  { id: 'location', icon: '📍', label: 'Ubicación', path: '/location' },
  { id: 'history', icon: '📋', label: 'Historial', path: '/history' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { speak } = useVoiceNavigation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (item: NavItem) => {
    speak(`Navegando a ${item.label}`);
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto">
      <div className="glass-effect border-t-2 border-white/20 backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-0">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`
                  flex flex-col items-center justify-center
                  py-3 px-2 smooth-transition
                  ${active
                    ? 'bg-purple-600/40 scale-105'
                    : 'hover:bg-white/10 active:scale-95'
                  }
                  ${active ? 'border-t-2 border-purple-400' : ''}
                `}
              >
                <span className={`text-2xl mb-1 ${active ? 'bounce-soft' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] font-bold ${active ? 'text-purple-200' : 'text-gray-300'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};