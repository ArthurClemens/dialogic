import './dialogic.css';
import './layout.css';

import { Dialog, Notification } from 'dialogic-react';
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { ProfileRoutes } from './pages/ProfilePage';
import { useStore } from './store';

const useDialogComponent = true;

function AppRoutes() {
  const store = useStore();

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/profile/*'
          element={
            <ProfileRoutes
              store={store}
              useDialogComponent={useDialogComponent}
            />
          }
        />
      </Routes>
      {/* Placing Notification and Dialog here allows to use Link components inside instances: */}
      <Notification />
      <Dialog />
    </Router>
  );
}

export default function App() {
  return (
    <div className='app'>
      <AppRoutes />
    </div>
  );
}
