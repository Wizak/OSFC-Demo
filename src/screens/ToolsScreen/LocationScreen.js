import React, { memo, useState, useEffect }  from 'react';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Card, Paragraph, Caption, Headline } from 'react-native-paper';

import LoaderMask from '../../components/LoaderMask';
import Background from '../../components/Background';

import { useResponsibleViewStyle } from '../../hooks/useResponsibleViewStyle';


const LocationScreen = () => {
  const [ position, setPosition ] = useState(null);
  const [ address, setAdress ] = useState(null);

  const { dynamicStyles, onViewLayout } = useResponsibleViewStyle({ 
    minHeight: 300, aroundSpaceHeight: 370, 
  });

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

      const currentAdress = await Location.reverseGeocodeAsync(coords);
      setAdress(currentAdress[0]);
    };
    getCurrentPosition();
  }, []);

  if (!position || address == null || dynamicStyles == null) {
    return <LoaderMask />;
  }

  return (
    <Background>
      <SafeAreaView edges={[ 'bottom', 'left', 'right' ]} style={{ flex: 1 }}>
        <ScrollView>
          <Card style={styles.card}>
            <View style={styles.cardTitle}>
              <Headline>
                Current geolocation
              </Headline>
              <Caption style={styles.address}>{address.formattedAddress}</Caption>
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

          <View 
            style={[ styles.mapView, dynamicStyles ]}
            onLayout={onViewLayout}
          >
            <MapView
              style={styles.map}
              region={position}
              showsUserLocation={true}
              showsMyLocationButton={true}
              followsUserLocation={true}
              showsCompass={true}
              scrollEnabled={true}
              // zoomEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
            >
              <Marker
                coordinate={position}
              />
            </MapView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  address: {
    width: '60%',
    textAlign: 'center'
  },
  card: {
    margin: 20,
    borderRadius: 15,
  },
  cardTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: '100%',
    width: '100%',
  },
});


export default memo(LocationScreen);
