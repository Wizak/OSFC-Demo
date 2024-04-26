import React, { memo }  from 'react';
import { Col } from "react-native-paper-grid";

import TextInput from './TextInput';
import { YesNoEnum } from '../../core/consts';


const formatValueToString = (value) => {
  let newValue = 'null';
  if (typeof value === 'boolean') {
    newValue = YesNoEnum[value];
  } else if ((typeof value === 'string' && value !== '') || 
    typeof value === 'number') {
      newValue = String(value);
  };
  return newValue.toUpperCase();
};

const GridField = ({ value, ...props }) => (
  <Col>
    <TextInput 
      {...props}
      value={formatValueToString(value)}
      readOnly 
    />
  </Col>
);


export default memo(GridField);
