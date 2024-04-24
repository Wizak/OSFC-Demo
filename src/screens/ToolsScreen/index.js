import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';

import CameraScreen from './CameraScreen';
import LocationScreen from './LocationScreen';
import ScanScreen from './ScanScreen';


const ToolsScreen = ({ navigation }) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'camera', title: 'Camera', focusedIcon: 'camera', unfocusedIcon: 'camera-outline'},
    { key: 'location', title: 'Location', focusedIcon: 'map-marker', unfocusedIcon: 'map-marker-outline' },
    { key: 'scan', title: 'Scan', focusedIcon: 'credit-card-scan', unfocusedIcon: 'credit-card-scan-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    camera: CameraScreen,
    location: LocationScreen,
    scan: ScanScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};


export default React.memo(ToolsScreen);
