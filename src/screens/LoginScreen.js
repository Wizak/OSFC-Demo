import React, { memo, useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/buttons/Button';
import TextInput from '../components/inputs/TextInput';
import FormInput from '../controllers/FormInput';
import DialogAlertMsg from '../components/dialogs/DialogAlertMsg';
import Divider from '../components/Divider';

import { useAuth } from '../contexts/auth';
import { useStore } from '../contexts/store';
import { ApisServersList } from '../core/consts';


const formSchema = z.object({
  email: z.string().min(1, "Required").max(50, "Email must be no more than 50 characters").email(),
  password: z.string().min(1, "Required").max(50, "Password must be no more than 50 characters"),
});


const LoginScreen = () => {
  const [ alertVisible, setAlertVisible ] = useState(false);
  const [ isApiListOpen, setIsApiListOpen ] = useState(false);
  const [ apiServer, setApiServer ] = useState(null);

  const { signIn, getState } = useAuth();
  const { changeStore, getState: getStoreState } = useStore();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
  });

  const { isLoading, error, permissions } = getState();
  const { apiUrl } = getStoreState();

  useEffect(() => {
    setAlertVisible(!!error);
  }, [ permissions?.email, permissions?.password, error, onSubmit ]);

  const onSubmit = async ({ email, password }) => {
    await signIn({ apiUrl: apiUrl, email, password });
  };

  const handleSelectApiServer = async (apiServerItem) => {
    await changeStore({ apiUrl: apiServerItem.value });
    setApiServer(apiServerItem);
  };

  return (
    <Background extraStyle={styles.container}>
      <Logo />

      <Header>OSFC Employee App</Header>

      <FormInput
        control={control}
        component={TextInput}
        name="email"
        label="Email"
        returnKeyType="next"
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        disabled={isLoading}
      />

      <FormInput
        control={control}
        component={TextInput}
        name="password"
        label="Password"
        returnKeyType="done"
        style={{ marginBottom: 20 }}
        disabled={isLoading}
        secureTextEntry
      />

      <Divider width={1} color={'black'} />

      <DropDownPicker
        placeholder='Choose the API server'
        dropDownDirection='TOP'
        style={styles.dropDownPicker}
        open={isApiListOpen}
        value={apiServer?.value}
        items={ApisServersList}
        setOpen={setIsApiListOpen}
        onSelectItem={handleSelectApiServer}
      />

      <Button 
        icon='login'
        mode="contained" 
        disabled={isLoading || !apiServer}
        onPress={handleSubmit(onSubmit)}
      >
        {isLoading ? (
          <ActivityIndicator animating color={styles.text.color} />
        ) : (
          <Text style={styles.text}>Login</Text>
        )}
      </Button>

      <DialogAlertMsg 
        icon='alert'
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={error} 
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  dropDownPicker: {
    marginTop: 10,
    marginBottom: 20,
  },
  container: {
    padding: 20,
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default memo(LoginScreen);
