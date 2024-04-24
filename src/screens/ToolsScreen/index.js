import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';

import ImageTiles from './CameraScreen';
import Map from './LocationScreen';


const ToolsScreen = ({ navigation }) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'camera', title: 'Camera', focusedIcon: 'camera', unfocusedIcon: 'camera-outline'},
    { key: 'location', title: 'Location', focusedIcon: 'map-marker', unfocusedIcon: 'map-marker-outline' },
    // { key: 'scan', title: 'Scan', focusedIcon: 'credit-card-scan', unfocusedIcon: 'credit-card-scan-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    camera: ImageTiles,
    location: Map,
    // scan: RecentsRoute,
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
