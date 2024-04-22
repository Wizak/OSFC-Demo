import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens';
import { useAuth } from '../contexts/auth';


const Stack = createNativeStackNavigator();

const SecureNavigation = (screenProps) => {
  const { getState, checkAuth } = useAuth();
  const state = getState();
  const isLoggedIn = checkAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{
            animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            
          }}
        />
      ): (
          <Stack.Screen {...screenProps} />
      )}
    </Stack.Navigator>
  );
};


export default SecureNavigation;
