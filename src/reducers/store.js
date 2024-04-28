const StoreActions = {
  RestoreStore: 'RESTORE_STORE',
  ChangeStore: 'CHANGE_STORE',
  RemoveFromStore: 'REMOVE_FROM_STORE',
  ResetStore: 'RESET_STORE',
};

const StoreReducer = (prevState, action) => {
  switch (action.type) {
    case StoreActions.RestoreStore:
      return action.payload;
    case StoreActions.ChangeStore:
      return {
        ...prevState,
        ...action.payload,
      };
    case StoreActions.RemoveFromStore:
      return Object.keys(prevState)
        .filter(stateKey => !action.payload.includes(stateKey))
        .reduce((newState, key) => {
          newState[key] = prevState[key];
          return newState;
        }, {});
    case StoreActions.ResetStore:
      return {};
  }
};


export { StoreReducer, StoreActions };
