/* eslint-disable import/no-extraneous-dependencies */
import 'demo-dialogic-react-router/src/layout.css';

import { HomePage } from 'demo-dialogic-react-router/src/pages/HomePage';
import { ProfileRoutes } from 'demo-dialogic-react-router/src/pages/ProfilePage';
import { useStore } from 'demo-dialogic-react-router/src/store';
import { Dialog, Notification } from 'dialogic-react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const PREFIX = '/UseDialogComponentTest';

export default function UseDialogComponent() {
  const store = useStore();
  return (
    <div className='app'>
      <Routes>
        <Route
          path='/profile/*'
          element={
            <ProfileRoutes
              pathPrefix={PREFIX}
              useDialogComponent
              store={store}
            />
          }
        />
        <Route path='/' element={<HomePage pathPrefix={PREFIX} />} />
      </Routes>
      <Dialog />
      <Notification />
    </div>
  );
}
