import React from 'react';
import { Form } from 'react-bootstrap';
import '../../../css/button.scss'

export const SansCheckBox = ({ isChecked,onChange,label,style,checkStyle }) =>
{
    return (
        <Form.Group
            style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '0',
                ...style
            }}>
            <Form.Check
                type="checkbox"
                label={label}
                checked={isChecked}
                onChange={onChange}
                style={{
                    margin: '0',
                    ...checkStyle

                }} />
        </Form.Group>
    );
};

export const SansRadioButton = ({ isChecked,onChange,label,value,style,checkStyle }) =>
{
    return (
        <Form.Group
            style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '0',
                ...style
            }}>
            <Form.Check
                type="radio"
                label={label}
                name="type"
                value={value}
                checked={isChecked}
                onChange={onChange}
                style={{
                    margin: '0',
                    ...checkStyle

                }} />
        </Form.Group>
    );
};

export const SansCheckBoxTable = ({ isChecked,onChange,label,value}) =>
{
    return (
        <Form.Group
            className='button-checkbox'
            style={{
                margin: '0',
            }}
        >
            <Form.Check
                className='checkbox-custom'
                type="checkbox"
                label={label}
                name="type"
                value={value}
                checked={isChecked}
                onChange={onChange}
                style={{
                    margin: '0',
                }}
            />
        </Form.Group>
    )
}
