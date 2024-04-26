import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SecureNavigation from './controllers/SecureNavigation';
import AppMainDrawerContent from './components/drawers/AppMainDrawer';

import { ProfileScreen, TasksScreen, ToolsScreen } from './screens';


const Drawer = createDrawerNavigator();

const AppScreen = () => (
  <Drawer.Navigator 
    initialRouteName="Profile" 
    drawerContent={(props) => <AppMainDrawerContent {...props} />}
    screenOptions={{ unmountOnBlur: true }}
  >
    <Drawer.Screen 
      name="Profile" 
      component={ProfileScreen}
      />
    <Drawer.Screen 
      name="Tools" 
      component={ToolsScreen} 
    />
    <Drawer.Screen 
      name="Tasks" 
      component={TasksScreen} 
    />
  </Drawer.Navigator>
);

const SecuredNavigationAppScreen = () => (
  <SecureNavigation 
    component={AppScreen} 
    name="AppMain" 
    options={{ title: 'OSFC Employee App' }} 
  />
);


export default SecuredNavigationAppScreen;
