import React, { memo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/Header';
import Background from '../components/Background';
import { ListItemText, ListAccordionText } from '../components/lists/ListText';

import { useAuth } from '../contexts/auth';
import { HumanRole } from '../core/consts';


const ProfileScreen = ({ navigation }) => {
  const { getState } = useAuth();
  const { permissions } = getState();

  if (!permissions) return null;

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
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
                      <ListItemText title='Local' description={permissions.locale} icon='translate' />
                      <ListItemText title='Time Refresh' description={permissions.time_refresh_order} icon='timer-cog-outline' />
                  </ListAccordionText>
                </List.AccordionGroup>
              </List.Section>
              <List.Section title='Settings'>
                <List.AccordionGroup>
                  <ListAccordionText title='Notifications' icon='bell'>
                    <ListItemText title='NOT IMPLEMENTED' />
                  </ListAccordionText>
                  <ListAccordionText title='Settings' icon='cog'>
                    <ListItemText title='NOT IMPLEMENTED' />
                  </ListAccordionText>
                </List.AccordionGroup>
              </List.Section>
            </View>
          </View>
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
    paddingTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordions: {
    width: '100%',
    elevation: 3,
  },
});


export default memo(ProfileScreen);
