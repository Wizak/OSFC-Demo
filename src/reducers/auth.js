const AuthActions = {
  Loading: 'LOADING',
  RestorePermissions: 'RESTORE_PERMISSIONS',
  SignIn: 'SIGN_IN',
  SignOut: 'SIGN_OUT',
};

const AuthReducer = (prevState, action) => {
  switch (action.type) {
    case AuthActions.Loading:
      return {
        ...prevState,
        error: null,
        isLoading: true,
      };
    case AuthActions.RestorePermissions:
      return {
        ...prevState,
        permissions: action.permissions,
        isLoading: false,
      };
    case AuthActions.SignIn:
      return {
        ...prevState,
        permissions: action.permissions,
        error: action.error,
        isLoading: false,
      };
    case AuthActions.SignOut:
      return {
        ...prevState,
        permissions: null,
        error: null,
        isLoading: false,
      };
  }
};


export { AuthReducer, AuthActions };
