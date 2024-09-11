import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Buffer } from 'buffer';
import process from 'process';

globalThis.Buffer = Buffer;
globalThis.process = process;

import { appStore } from '../appStore';
import { appRouter } from '../appRouter';

import 'react-datepicker/dist/react-datepicker.css';
import '../../shared/firebase';
import '../styles/base.scss';

const Root = () => (
  <React.StrictMode>
    <ReduxProvider store={appStore}>
      <RouterProvider router={appRouter()} />
    </ReduxProvider>
  </React.StrictMode>
);

export { Root };