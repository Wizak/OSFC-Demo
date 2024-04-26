import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';

import TaskScreen from './TaskScreen';
// import DocsScreen from './DocsScreen';


const TasksScreen = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'task', title: 'Task', focusedIcon: 'calendar-check', unfocusedIcon: 'calendar-check-outline'},
    // { key: 'docs', title: 'Docs', focusedIcon: 'file-document', unfocusedIcon: 'file-document-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    task: TaskScreen,
    // docs: DocsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};


export default React.memo(TasksScreen);
