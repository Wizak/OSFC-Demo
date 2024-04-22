import 'react-native-gesture-handler';

import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";

import { name as appName } from './app.json';
import { theme } from './src/core/theme';

import AuthContextProvider from './src/contexts/auth';
import App from './src';


const Main = () => (
  <PaperProvider theme={theme}>
    <AuthContextProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <App />
        </NavigationContainer>
        <StatusBar style="dark" 
          translucent={true} hidden={false} />
      </SafeAreaProvider>
    </AuthContextProvider>
  </PaperProvider>
);

AppRegistry.registerComponent(appName, () => Main);


export default Main;
