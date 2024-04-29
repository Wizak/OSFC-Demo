import { memo, useState, useEffect } from 'react';
import { 
  Text, Platform, SafeAreaView, 
  View, ScrollView, StyleSheet,
} from 'react-native';
import { Grid, Row, Col } from "react-native-paper-grid";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import Header from '../components/Header';
import Divider from '../components/Divider';
import Button from '../components/buttons/Button';
import TextInput from '../components/inputs/TextInput';
import FormInput from '../controllers/FormInput';
import DialogAlertMsg from '../components/dialogs/DialogAlertMsg';
import Background from '../components/Background';
import SwitchButton from '../components/buttons/SwitchButton';

import { DEAFAULT_PUSH_NOTIFY_SERVER } from '../core/consts';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const formSchema = z.object({
  notify_server: z.string().min(1, "Required").max(200, "Server URL must be no more than 200 characters"),
  notify_title: z.string().min(1, "Required").max(40, "Title must be no more than 50 characters"),
  notify_body: z.string().min(1, "Required").max(100, "Body must be no more than 100 characters"),
});

const sendPushNotification = async ({ expoPushToken, handleError, ...notifyData }) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: notifyData.notify_title,
    body: notifyData.notify_body,
  };

  await fetch(notifyData.notify_server, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  }).catch(e => {
    handleError({ 
      title: 'Push notifications Error',
      message: e.message,
    });
  });
};

const registerForPushNotificationsAsync = async ({ handleError }) => {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      handleError({
        title: 'Permissions Error',
        message: 'Permission not granted to get push token for push notification!',
      });
      return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      handleError({
        title: 'Id Error',
        message: 'Project ID not found',
      });
    }
 
    try {
      const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
      return data;
    } catch (e) {
      handleError({
        title: 'Token Error',
        message: JSON.stringify(e),
      });
    };
  } else {
    handleError({
      title: 'Device Error',
      message: 'Must use physical device for push notifications',
    });
  };
};

const ExperimentalPushNotificationsScreen = () => {
  const [ expoPushToken, setExpoPushToken ] = useState('');
  const [ isDefaultNotifyServer, setIsDefaultNotifyServer ] = useState(true);
  const [ error, setError ] = useState(null);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: { notify_server: DEAFAULT_PUSH_NOTIFY_SERVER },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    registerForPushNotificationsAsync({ handleError: setError })
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error) => setError({ title: 'Unexcepted Error', message: JSON.stringify(error) }));
  }, []);

  const onPushSubmit = async (data) => {
    await sendPushNotification({ 
      expoPushToken, 
      handleError: setError, 
      ...data 
    });
  };

  const handleOnDefaultNotifyServerChange = (value) => {
    setIsDefaultNotifyServer((prevState) => !prevState);
    setValue('notify_server', value ? DEAFAULT_PUSH_NOTIFY_SERVER : '');
  };

  return (
    <Background>
      <SafeAreaView edges={[ 'bottom', 'left', 'right' ]} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Header>Push Notifications</Header>
          <Grid style={styles.grid}>
            <Row>
              <Col>
                <FormInput
                  control={control}
                  component={TextInput}
                  name="notify_server"
                  label="Notify Server"
                  returnKeyType="next"
                  autoCapitalize="none"
                  disabled={isDefaultNotifyServer}
                />
              </Col>
            </Row>
            <Row>
              <Col style={styles.defaultServerSwitch}>
                <SwitchButton 
                  value={isDefaultNotifyServer} 
                  label={(value) => value ? 'Use custom' : 'Use default'}
                  onValueChange={handleOnDefaultNotifyServerChange} 
                />
              </Col>
            </Row>
            <Row>
              <Divider width={1} color='black' />
            </Row>
            <Row>
              <Col>
                <FormInput
                  control={control}
                  component={TextInput}
                  name="notify_title"
                  label="Title"
                  returnKeyType="next"
                  autoCapitalize="none"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <FormInput
                  control={control}
                  component={TextInput}
                  name="notify_body"
                  label="Body"
                  returnKeyType="next"
                  autoCapitalize="none"
                  multiline
                />
              </Col>
            </Row>
          </Grid>

          <View style={styles.pushButton}>
            <Button 
              mode="contained" 
              onPress={handleSubmit(onPushSubmit)}
            >
              <Text>PUSH</Text>
            </Button>
          </View>

          <DialogAlertMsg 
            title={error?.title} 
            message={error?.message} 
            isVisible={!!error}
            onClose={() => setError(null)}
          />
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  pushButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#F7F3F9',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    elevation: 2,
    height: '75%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultServerSwitch: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});


export default memo(ExperimentalPushNotificationsScreen);
