import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';

import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Card, Paragraph, Caption, Headline } from 'react-native-paper';

import Background from '../../components/Background';


const App = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const getCurrentPosition = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();
      setPosition({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    };
    getCurrentPosition();
  }, []);

  if (!position) return null;

  return (
    <Background>
      <Card style={styles.card}>
        <View style={styles.cardTitle}>
          <Headline>
            Current geolocation
          </Headline>
        </View>
        <Card.Content style={styles.cardContent}>
          <View>
            <Paragraph>Latitude</Paragraph>
            <Caption>{position.latitude}</Caption>
          </View>
          <View>
            <Paragraph>Longitude</Paragraph>
            <Caption>{position.longitude}</Caption>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.mapView}>
        <MapView
          style={styles.map}
          initialRegion={position}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
        >
          <Marker
            coordinate={position}
          />
        </MapView>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 20,
    borderRadius: 15,
  },
  cardTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mapView: {
    margin: 20,
    marginTop: 0,
    height: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: '100%',
    width: '100%',
  },
});


export default App;