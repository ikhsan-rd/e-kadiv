import React from 'react';
import { Form,Button } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import { Trash } from 'react-bootstrap-icons';
import './../../../css/SansDatePicker.scss';
import './../../../css/button.scss';
import './../../../css/DateTimePicker.scss';
 // Import the custom CSS file

const SansDatePicker = ({ value,onChange,onClear,readOnly,disabled,style,minDate,maxDate }) =>
{
    // Determine the class name based on the props
    const inputClassName = `date-time-picker-input ${disabled ? 'disabled' : readOnly ? 'read-only' : ''}`;

    return (
        <Form.Group className="date-time-picker-container"
        style={style}
        >
            <DateTimePicker
                format="dd/MM/yy"
                clearIcon={null}
                calendarIcon={null}
                disableClock={true}
                onChange={onChange}
                value={value}
                disabled={readOnly || disabled}
                className={inputClassName}
                maxDate={maxDate}
                minDate={minDate}
            />
            {value !== null && !readOnly && !disabled && (
                <Button
                    variant="danger"
                    onClick={onClear}
                    className="button-delete"
                >
                    <Trash className='trash-custom' />
                </Button>
            )}
        </Form.Group>
    );
};

export default SansDatePicker;
