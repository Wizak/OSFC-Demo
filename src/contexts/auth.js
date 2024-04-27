import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthReducer } from '../reducers/auth';
import { httpClient } from '../core/httpClient';
import { AllowedRolesToUseApp } from '../core/consts';


const AuthContext = React.createContext();


const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(AuthReducer, {
    isLoading: true,
    permissions: null,
    error: null,
  });

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let permissions;
      let error;

      try {
        permissions = JSON.parse(await AsyncStorage.getItem('permissions'));
      } catch (e) {
        error = 'Restore permissions Erorr';
      }

      dispatch({ type: 'RESTORE_PERMISSIONS', permissions, error });
    };

    bootstrapAsync();
  }, []);

  const authContextValue = {
    signIn: async (data) => {
      let permissions;
      let error;

      dispatch({ type: 'LOADING' });

      await httpClient('/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(async ({ json }) => {
        if (!AllowedRolesToUseApp.includes(json.permissions.role)) {
          error = 'Only OSFC is allowed to login'
          return;
        }
        try {
          await SecureStore.setItemAsync('token', json.token);
          await AsyncStorage.setItem('permissions', JSON.stringify(json.permissions));
          permissions = json.permissions;
        } catch (e) {
          error = 'Set permissions Erorr';
        }
      }).catch(e => {
        error = e?.message;
      }).finally(() => {
        dispatch({ type: 'SIGN_IN', permissions, error });
      });
    },
    signOut: async () => {
      dispatch({ type: 'LOADING' });
      await SecureStore.deleteItemAsync('token');
      await AsyncStorage.removeItem('permissions');
      dispatch({ type: 'SIGN_OUT' });
    },
    getState: () => state,
    checkAuth: () => !!SecureStore.getItem('token'),
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};


export { useAuth };
export default AuthContextProvider;
