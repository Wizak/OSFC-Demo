import React, { memo }  from 'react';
import { Col } from "react-native-paper-grid";

import MUITextFieldFocused from './MUITextFieldFocused';

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

const GridField = ({ value, label, ...props }) => (
  <Col {...props}>
    <MUITextFieldFocused value={formatValueToString(value)} label={label} />
  </Col>
);


export default memo(GridField);
