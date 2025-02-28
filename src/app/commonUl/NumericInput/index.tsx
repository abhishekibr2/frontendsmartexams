import React from 'react';
import { Input } from 'antd';

interface NumericInputProps {
    style?: React.CSSProperties;
    value: string;
    onChange: (value: string) => void;
}

export default function NumericInput(props: NumericInputProps) {

    const { value, onChange } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
            onChange(inputValue);
        }
    };

    // '.' at the end or only '-' in the input box.
    const handleBlur = () => {
        let valueTemp = value;
        if (value.charAt(value.length - 1) === '.' || value === '-') {
            valueTemp = value.slice(0, -1);
        }
        onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    };

    return (
        <Input
            {...props}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your phone number"
            maxLength={12}
            type="number"
        />
    );
}
