import "../../styles/HomeScreen.css";import { useState } from 'react';
import NavBar from './NavBar/NavBar.jsx';
import DashboardScreen from '../DashboardScreen/DashboardScreen.jsx';
import AddHabitScreen from '../AddHabbitScreen/AddHabitScreen.jsx'; 
import DailyEntriesScreen from '../DailyEntriesScreen/DailyEntriesScreen.jsx';


const HomeScreen = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const token = localStorage.getItem('auth_token');
  const isAuthenticated = !!token;
  const userName = localStorage.getItem('userName') || 'Usuario';

  const renderPage = () => {

    switch (currentPage) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'add-habit':
        return <AddHabitScreen />;
      case 'daily-entries':
        return <DailyEntriesScreen />;
      /*case 'stats':
        return <StatsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:'dashboard'; */
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="home-layout">
      <NavBar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userName={userName}
        isAuthenticated={isAuthenticated}
      />
      <main className="home-content">{renderPage()}</main>
    </div>
  );
};

export default HomeScreen;