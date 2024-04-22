import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Drawer as PaperDrawer } from 'react-native-paper';

import LogoutButton from '../buttons/LogoutButton';


const MenuDrawerContent = (props) => {
  const [ activeScreen, setActiveScreen ] = React.useState('Profile');

  return (
    <PaperDrawer.Section title="Menu">
      <PaperDrawer.Item
        label='Profile'
        active={activeScreen === 'Profile'}
        icon='account-box'
        onPress={() => {
          setActiveScreen('Profile');
          props.navigation.navigate('Profile');
        }}
      />
      <PaperDrawer.Item
        label='Tasks'
        icon='clipboard-list'
        active={activeScreen === 'Tasks'}
        onPress={() => {
          setActiveScreen('Tasks');
          props.navigation.navigate('Tasks');
        }}
      />
      <PaperDrawer.Item
        label='Tools'
        icon='tools'
        active={activeScreen === 'Tools'}
        onPress={() => {
          setActiveScreen('Tools');
          props.navigation.navigate('Tools');
        }}
      />
    </PaperDrawer.Section>
  );
};


const AppMainSideMenuContent = (props) => (
  <ScrollView contentContainerStyle={styles.scrollView}>
    <SafeAreaView forceInset={styles.safeArea}>
      <MenuDrawerContent {...props} />
    </SafeAreaView>
    <LogoutButton {...props} />
  </ScrollView>
);

const styles = StyleSheet.create({
  safeArea: { 
    top: 'always', 
    horizontal: 'never',
  },
  scrollView: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'space-between',
  },
});


export default AppMainSideMenuContent;