import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

import { useOrientation } from './useOrientation';


const useResponsibleViewStyle = ({ minHeight, aroundSpaceHeight }) => {
  const [ viewDemensions, setViewDemensions ] = useState(null);
  const [ dynamicStyles, setDynamicStyles ] = useState(null);
  const orientation = useOrientation();

  useEffect(() => {
    const approxTargetBarcodesViewHeight = Dimensions.get('window').height - aroundSpaceHeight;
    const calculatedHeightForScroll = approxTargetBarcodesViewHeight <= minHeight ? 
      minHeight : approxTargetBarcodesViewHeight;
    setDynamicStyles({ height: parseInt(calculatedHeightForScroll) });
  }, [ orientation, viewDemensions ]);

  const onViewLayout = ({ nativeEvent }) => {
    setViewDemensions(nativeEvent.layout);
  };

  return { 
    dynamicStyles, setDynamicStyles, 
    onViewLayout, setViewDemensions, 
  };
};


export { useResponsibleViewStyle };

