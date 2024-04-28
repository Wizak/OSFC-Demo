import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SecureNavigation from './controllers/SecureNavigation';
import AppMainDrawerContent from './components/drawers/AppMainDrawer';

import { 
  ProfileScreen, TasksScreen, 
  ToolsScreen, ExperimentalPushNotificationsScreen,
} from './screens';
import { useStore } from './contexts/store';


const Drawer = createDrawerNavigator();

const AppScreen = () => {
  const { getState } = useStore();
  const { is_push_notify } = getState();

  return (
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
      {is_push_notify ? (
        <Drawer.Screen 
          name="Experimental" 
          component={ExperimentalPushNotificationsScreen} 
        />
      ) : null}
    </Drawer.Navigator>
  );
};

const SecuredNavigationAppScreen = () => (
  <SecureNavigation 
    component={AppScreen} 
    name="AppMain" 
    options={{ title: 'OSFC Employee App' }} 
  />
);


export default SecuredNavigationAppScreen;
