/**
 * Layout compartido para todas las páginas
 * Diseño estético con glassmorphism y gradientes
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  headerAction?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  showBackButton = true,
  headerAction,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen animated-gradient text-white">
      {/* Header con glassmorphism */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-40 fade-in">
        <div className="p-6 flex items-center justify-between">
          {showBackButton ? (
            <button
              onClick={() => navigate(-1)}
              className="text-2xl hover:scale-110 smooth-transition drop-shadow-lg"
              aria-label="Volver atrás"
            >
              ←
            </button>
          ) : (
            <div className="w-8"></div>
          )}
          <h1 className="text-2xl font-bold drop-shadow-2xl">{title}</h1>
          {headerAction || <div className="w-8"></div>}
        </div>
      </header>

      {/* Contenido con padding */}
      <main className="px-4 py-6 fade-in">
        {children}
      </main>
    </div>
  );
};
