import React, { memo, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

import Header from '../components/Header';
import Background from '../components/Background';
import SwitchButton from '../components/buttons/SwitchButton';
import LoaderMask from '../components/LoaderMask';
import SimpleDialogForm from '../components/dialogs/SimpleDialogForm';

import { ListItemText, ListAccordionText } from '../components/lists/ListText';

import { USER_SETTINGS_KEY } from '../core/consts';
import { HumanRole } from '../core/consts';
import { tryAsyncStorageValueByKey } from '../core/utils';
import { useAuth } from '../contexts/auth';
import { useStore } from '../contexts/store';


const setTaskIdFormSchema = z.object({
  hardcoded_task_id: z.string()
    .min(1, "Required")
    .max(10, "Value must be no longer than 10 characters")
    .transform((val) => val.trim())
    .refine((val) => !!val.match(/^\d+$/)?.[0], {message: "Value must be a valid number"}),
});

const makePersonalUserStorageKey = (permissions) => (
  `${USER_SETTINGS_KEY}-user:${permissions?.id}`
);

const showToastExperimentalFeatureEnabled = () => {
  Toast.show({
    type: 'success',
    text1: 'Push Notifications are Enabled 🔔',
    text2: 'Examine the sidebar menu',
    topOffset: 100,
  });
};

const ProfileScreen = () => {
  const [ userSettings, setUserSettings ] = useState({});
  const [ isTaskFormVisible, setIsTaskFormVisible ] = useState(false);
  const [ isHardcodedTaskId, setIsHardcodedTaskId ] = useState(false);

  const { getState } = useAuth();
  const { changeStore } = useStore();

  const { permissions } = getState();
  const userSettingsStorageKey = makePersonalUserStorageKey(permissions);

  useEffect(() => {
    const _restoreUserSettings = async () => {
      const userSettingsStorage = await tryAsyncStorageValueByKey({ 
        key: userSettingsStorageKey 
      }) || { };
      setUserSettings(userSettingsStorage);
      changeStore({ is_push_notify: userSettingsStorage?.is_push_notify });
      setIsHardcodedTaskId(!!userSettingsStorage?.hardcoded_task_id);
    };
    permissions && _restoreUserSettings();
  }, [ userSettingsStorageKey, tryAsyncStorageValueByKey ]);

  if (!permissions) return <LoaderMask />;

  const handleOnPushNotifyChange = async (isPushNotify) => {
    const newUserSettings = { ...userSettings, is_push_notify: isPushNotify };
    await tryAsyncStorageValueByKey({ 
      key: userSettingsStorageKey, 
      value: newUserSettings,
      action: 'set', 
    });
    setUserSettings(newUserSettings);
    changeStore({ is_push_notify: newUserSettings.is_push_notify });
    isPushNotify && showToastExperimentalFeatureEnabled();
  };

  const handleOnSetTaskId = async (isSetTaskId) => {
    if (!isSetTaskId) {
      const { hardcoded_task_id, ...newUserSettings } = userSettings;
      await tryAsyncStorageValueByKey({ 
        key: userSettingsStorageKey, 
        value: newUserSettings,
        action: 'set', 
      });
      setUserSettings(newUserSettings);
      setIsHardcodedTaskId(false);
    } else {
      setIsTaskFormVisible(true);
    };
  };

  const onApplyHardcodedTaskId = async ({ hardcoded_task_id}) => {
    const newUserSettings = { ...userSettings, hardcoded_task_id };
    await tryAsyncStorageValueByKey({ 
      key: userSettingsStorageKey, 
      value: newUserSettings,
      action: 'set', 
    });
    setUserSettings(newUserSettings);
    setIsTaskFormVisible(false);
    setIsHardcodedTaskId(true);
  };

  const onDismissHardcodedTaskId = () => {
    setIsTaskFormVisible(false);
  };

  return (
    <Background>
      <SafeAreaView edges={[ 'bottom', 'left', 'right' ]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.viewAvatar}>
            <Avatar.Image size={150} source={require('../assets/profile-default.png')} />
          </View>
          <Header>{permissions.fullName}</Header>
          <View style={styles.accordions}>
            <List.Section title='Details'>
              <List.AccordionGroup>
                <ListAccordionText title='General' icon='card-account-details'>
                    <ListItemText title='E-mail' description={permissions.email} icon='email-outline' />
                    <ListItemText title='Full Name' description={permissions.fullName} icon='account-box-outline' />
                    <ListItemText title='Role' description={HumanRole[permissions.role]} icon='briefcase-outline' />
                </ListAccordionText>
                <ListAccordionText title='Other' icon='text-account'>
                    <ListItemText title='ID' description={permissions.id} icon='identifier' />
                    <ListItemText title='Locale' description={permissions.locale} icon='translate' />
                    <ListItemText title='Time Refresh' description={permissions.time_refresh_order} icon='timer-cog-outline' />
                </ListAccordionText>
              </List.AccordionGroup>
            </List.Section>
            <List.Section title='Settings'>
              <List.AccordionGroup>
                <ListAccordionText title='Notifications' icon='bell'>
                  <ListItemText 
                    title='Push notifications' 
                    icon='message-badge-outline' 
                    description={() => (
                      <SwitchButton 
                        value={!!userSettings?.is_push_notify} 
                        label={(value) => value ? 'Enabled' : 'Disabled'}
                        onValueChange={handleOnPushNotifyChange} 
                      />
                    )}
                  />
                </ListAccordionText>
                <ListAccordionText title='Settings' icon='cog'>
                  <ListItemText 
                      title='Hardcoded Task ID' 
                      icon='id-card' 
                      description={() => (
                        <SwitchButton 
                          value={isHardcodedTaskId} 
                          label={(value) => (
                            value ? `Enabled (ID:${userSettings?.hardcoded_task_id})` : 'Disabled'
                          )}
                          onValueChange={handleOnSetTaskId} 
                        />
                      )}
                    />
                </ListAccordionText>
              </List.AccordionGroup>
            </List.Section>
          </View>
          <SimpleDialogForm 
            submitText='Apply'
            title='Set Task ID'
            inputProps={{
              name: 'hardcoded_task_id',
              inputMode: 'numeric',
            }}
            isVisible={isTaskFormVisible}
            formSchema={setTaskIdFormSchema}
            onSubmit={onApplyHardcodedTaskId}
            onCancel={onDismissHardcodedTaskId}
            onDismiss={onDismissHardcodedTaskId}
          />
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  viewAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  }, 
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordions: {
    width: '100%',
    elevation: 3,
  },
});


export default memo(ProfileScreen);
