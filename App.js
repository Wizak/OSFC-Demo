import 'react-native-gesture-handler';

import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import Toast from 'react-native-toast-message';

import { name as appName } from './app.json';
import { theme } from './src/core/theme';

import AuthContextProvider from './src/contexts/auth';
import StoreProvider from './src/contexts/store';
import App from './src';


const Main = () => (
  <PaperProvider theme={theme}>
    <StoreProvider>
      <AuthContextProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <App />
          </NavigationContainer>
          <StatusBar hidden={false} style='dark' translucent={true} />
          <Toast />
        </SafeAreaProvider>
      </AuthContextProvider>
    </StoreProvider>
  </PaperProvider>
);

AppRegistry.registerComponent(appName, () => Main);


export default Main;
