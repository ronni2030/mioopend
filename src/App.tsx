import { Routes, Route } from 'react-router-dom';
import { VoiceNavigationProvider } from './shared/contexts/VoiceNavigationContext';
import { BottomNav } from './shared/components/navigation/BottomNav';
import HomePage from './pages/HomePage';
import NavigationPage from './pages/NavigationPage';
import LocationPage from './pages/LocationPage';
import PlacesPage from './pages/PlacesPage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import IncidentsPage from './pages/IncidentsPage';
import SupportPage from './pages/SupportPage';
import HistoryPage from './pages/HistoryPage';
import IDCardPage from './pages/IDCardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <VoiceNavigationProvider>
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/emergency-contacts" element={<EmergencyContactsPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/view-card" element={<IDCardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </VoiceNavigationProvider>
  );
}

export default App;