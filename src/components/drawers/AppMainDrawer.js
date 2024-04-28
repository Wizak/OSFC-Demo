import React, { memo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Drawer as PaperDrawer } from 'react-native-paper';
import Constants from "expo-constants";

import LogoutButton from '../buttons/LogoutButton';
import { useStore } from '../../contexts/store';


const MenuDrawerContent = (props) => {
  const [ activeScreen, setActiveScreen ] = React.useState('Profile');
  const { getState } = useStore();

  const { is_push_notify } = getState();

  return (
    <PaperDrawer.Section title="Menu" style={styles.menu}>
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
        style={styles.menuItem}
        onPress={() => {
          setActiveScreen('Tasks');
          props.navigation.navigate('Tasks');
        }}
      />
      <PaperDrawer.Item
        label='Tools'
        icon='tools'
        active={activeScreen === 'Tools'}
        style={styles.menuItem}
        onPress={() => {
          setActiveScreen('Tools');
          props.navigation.navigate('Tools');
        }}
      />
      {is_push_notify ? (
        <PaperDrawer.Item
          label="Experimental"
          icon='star-circle-outline'
          active={activeScreen === 'Experimental'}
          onPress={() => {
            setActiveScreen('Experimental');
            props.navigation.navigate('Experimental');
          }}
        />
      ): null}
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
  menu: {
    paddingBottom: 10,
    paddingTop: Constants.statusBarHeight
  },
  menuItem: {
    marginTop: 10,
    marginBottom: 10,
  },
  safeArea: { 
    top: 'always', 
    horizontal: 'never',
  },
  scrollView: {
    flex: 1, 
    paddingTop: 20,
    flexDirection: 'column', 
    justifyContent: 'space-between',
  },
});


export default memo(AppMainSideMenuContent);
