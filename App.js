import React from 'react';
import {Context} from './src/context/Context';
import {LogBox} from 'react-native'
import Routes from './src/routes/routes';
export default function App() {
  LogBox.ignoreAllLogs()
  return (
    <Context>
      <Routes />
    </Context>
  );
}
