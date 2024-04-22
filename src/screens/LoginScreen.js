import React, { memo, useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/buttons/Button';
import TextInput from '../components/TextInput';
import FormInput from '../controllers/FormInput';
import DialogAlertMsg from '../components/dialogs/Alert';

import { useAuth } from '../contexts/auth';


const formSchema = z.object({
  email: z.string().min(1, "Required").max(50, "Email must be no more than 50 characters").email(),
  password: z.string().min(1, "Required").max(50, "Password must be no more than 50 characters"),
});


const LoginScreen = ({ navigation }) => {
  const { signIn, getState } = useAuth();
  const [ alertVisible, setAlertVisible ] = useState(false);
  const { isLoading, error, permissions } = getState();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setAlertVisible(!!error);
  }, [ permissions?.email, permissions?.password, error, onSubmit ]);

  const onSubmit = async ({ email, password }) => {
    await signIn({ email, password });
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
        disabled={isLoading}
        secureTextEntry
      />

      <Button 
        icon='login'
        mode="contained" 
        disabled={isLoading}
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
        visible={alertVisible}
        setVisible={setAlertVisible}
        message={error} 
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
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
