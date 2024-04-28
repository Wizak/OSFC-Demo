import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StoreReducer, StoreActions } from '../reducers/store';
import { USER_STORE_KEY } from '../core/consts';


const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StoreReducer, {});

  useEffect(() => {
    const bootstrapAsync = async () => {
      let store;

      try {
        store = JSON.parse(await AsyncStorage.getItem(USER_STORE_KEY)) || {};
      } catch (e) {
        throw new Error('Restore store Erorr');
      }

      dispatch({ type: StoreActions.RestoreStore, payload: store });
    };

    bootstrapAsync();
  }, []);

  const storeContextValue = {
    changeStore: async (payload) => {
      await AsyncStorage.setItem(USER_STORE_KEY, JSON.stringify(payload));
      dispatch({ type: StoreActions.ChangeStore, payload });
    },
    resetStore: async () => {
      await AsyncStorage.removeItem(USER_STORE_KEY);
      dispatch({ type: StoreActions.ResetStore });
    },
    removeFromStore: async (payload) => {
      const newStoreState = Object.keys(state)
        .filter(stateKey => !payload.includes(stateKey))
        .reduce((newState, key) => {
          newState[key] = state[key];
          return newState;
        }, {});
      await AsyncStorage.setItem(USER_STORE_KEY, JSON.stringify(newStoreState));
      dispatch({ type: StoreActions.RemoveFromStore, payload });
    },
    getState: () => state,
  };

  return (
    <StoreContext.Provider value={storeContextValue}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within an StoreProvider');
  }

  return context;
};


export { useStore };
export default StoreProvider;
