import React, { memo } from 'react';

import Button from './Button';
import { useAuth } from '../../contexts/auth';
import { useStore } from '../../contexts/store';


const LogoutButton = (props) => {
  const { signOut } = useAuth();
  const { resetStore } = useStore();

  const handleLogout = async () => {
    await resetStore();
    await signOut();
  };

  return (
    <Button 
      {...props}
      icon='logout'
      onPress={handleLogout}
    >
      Logout
    </Button>
  );
};


export default memo(LogoutButton);
