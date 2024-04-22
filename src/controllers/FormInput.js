import React from 'react'
import { Controller } from 'react-hook-form';


const FormInput = ({ control, name, component, ...rest }) => (
  <Controller
    control={control}
    name={name}
    render={
      ({ field: { value, onChange, onBlur }, fieldState: { error }}) => (
        <>
          {React.createElement(component, {
            ...rest,
            value, onBlur,
            onChangeText: onChange,
            error: error && error.message,
          })}
        </>
      )
    }
  />
);


export default FormInput;
