import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthReducer, AuthActions } from '../reducers/auth';
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

      dispatch({ type: AuthActions.RestorePermissions, permissions, error });
    };

    bootstrapAsync();
  }, []);

  const authContextValue = {
    signIn: async ({ apiUrl, ...body }) => {
      let permissions;
      let error;

      dispatch({ type: AuthActions.Loading });

      await httpClient(`${apiUrl}/login`, {
        method: 'POST',
        body: JSON.stringify(body),
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
        dispatch({ type: AuthActions.SignIn, permissions, error });
      });
    },
    signOut: async () => {
      dispatch({ type: AuthActions.Loading });
      await SecureStore.deleteItemAsync('token');
      await AsyncStorage.removeItem('permissions');
      dispatch({ type: AuthActions.SignOut });
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
