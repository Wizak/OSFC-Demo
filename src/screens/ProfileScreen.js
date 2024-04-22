import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Title } from 'react-native-paper';

import Background from '../components/Background';
import Paragraph from '../components/Paragraph';

import { useAuth } from '../contexts/auth';


const ProfileScreen = ({ navigation }) => {
  const { getState } = useAuth();
  const { permissions } = getState();

  if (!permissions) return null;

  return (
    <Background>
      <View style={styles.container}>
        <Avatar.Image size={150} source={require('../assets/profile-default.png')} style={styles.avatar} />
        <Card style={styles.card}>
          <Card.Content>
            <Title>{permissions.name}</Title>
            <Paragraph>Email: {permissions.email}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // Фоновий колір
  },
  avatar: {
    marginBottom: 20,
  },
  card: {
    width: '80%',
    elevation: 3, // Тінь для картки
  },
});

export default memo(ProfileScreen);
