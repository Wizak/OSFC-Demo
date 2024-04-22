import * as React from 'react';

import Button from './Button';
import { useAuth } from '../../contexts/auth';


const LogoutButton = (props) => {
  const { signOut } = useAuth();

  return (
    <Button 
      {...props}
      icon='logout'
      onPress={async () => await signOut()}
    >
      Logout
    </Button>
  );
};


export default LogoutButton;
