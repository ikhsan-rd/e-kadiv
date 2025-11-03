import React,{ useState,useRef,useEffect } from 'react';
import { FormControl,Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import '../../../css/button.scss';

const SansTimePicker = ({
    format = '24h',
    value,
    onChange,
    onClear,
    readOnly,
    disabled,
    required,
    name,
    style = {} // Added style prop
}) =>
{
    const [showOptions,setShowOptions] = useState(false);
    const [selectedHour,setSelectedHour] = useState(null);
    const [selectedMinute,setSelectedMinute] = useState(null);
    const timePickerRef = useRef();

    useEffect(() =>
    {
        if (value)
        {
            const [time] = value.split(' ');
            const [hour,minute] = time.split(':');
            setSelectedHour(parseInt(hour,10));
            setSelectedMinute(parseInt(minute,10));
        } else
        {
            setSelectedHour(null);
            setSelectedMinute(null);
        }
    },[value]);

    const handleToggleOptions = () =>
    {
        if (!readOnly && !disabled)
        {
            setShowOptions(!showOptions);
        }
    };

    const handleHourSelect = (hour) =>
    {
        setSelectedHour(hour);
        onChange(`${hour < 10 ? `0${hour}` : hour}:${selectedMinute !== null ? (selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute) : '00'}`);
    };

    const handleMinuteSelect = (minute) =>
    {
        setSelectedMinute(minute);
        onChange(`${selectedHour !== null ? (selectedHour < 10 ? `0${selectedHour}` : selectedHour) : '00'}:${minute < 10 ? `0${minute}` : minute}`);
        setShowOptions(false);
    };

    const handleClickOutside = (event) =>
    {
        if (timePickerRef.current && !timePickerRef.current.contains(event.target))
        {
            setShowOptions(false);
        }
    };

    useEffect(() =>
    {
        document.addEventListener("mousedown",handleClickOutside);
        return () =>
        {
            document.removeEventListener("mousedown",handleClickOutside);
        };
    },[]);

    const hours = Array.from(Array(24).keys());
    const minutes = Array.from(Array(60).keys());

    const getCursorStyle = () =>
    {
        return readOnly || disabled ? 'default' : 'pointer';
    };

    return (
        <div style={{ position: 'relative',display: 'flex',...style }} ref={timePickerRef}>
            <FormControl
                onClick={handleToggleOptions}
                readOnly={readOnly}
                disabled={disabled}
                required={required}
                name={name}
                style={{
                    width: '100%',
                    cursor: getCursorStyle(),
                }}
                value={`${selectedHour !== null ? (selectedHour < 10 ? `0${selectedHour}` : selectedHour) : '--'}:${selectedMinute !== null ? (selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute) : '--'}`}
            />
            {showOptions && !readOnly && !disabled && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 5px)',
                        left: 0,
                        zIndex: 999,
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        padding: '5px 10px 10px 0',
                    }}>
                    <div className='time-scroll-down'
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            maxHeight: '150px',
                        }}>
                        <div style={{ flex: '50%' }}>
                            <div className='hour-label' style={{ marginLeft: '5px' }}>
                                <h7>Hour</h7>
                            </div>
                            <div className='hour-scroll-down'
                                style={{
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    maxHeight: '84%',
                                    padding: '0 8px 0 8px',
                                }}>
                                {hours.map((hour) => (
                                    <div key={hour} onClick={() => handleHourSelect(hour)}
                                        style={{
                                            background: selectedHour === hour ? '#007bff' : 'transparent',
                                            color: selectedHour === hour ? 'white' : 'black',
                                            padding: '5px',
                                            cursor: getCursorStyle(),
                                            ...style.hourItem // Apply custom styles from props
                                        }}>
                                        {hour < 10 ? `0${hour}` : hour}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ flex: '50%' }}>
                            <div className='minute-label'>
                                <h7>Minute</h7>
                            </div>
                            <div className='minute-scroll-down'
                                style={{
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    maxHeight: '84%',
                                    padding: '0 8px 0 8px',
                                    ...style.minuteScroll // Apply custom styles from props
                                }}>
                                {minutes.map((minute) => (
                                    <div key={minute} onClick={() => handleMinuteSelect(minute)}
                                        style={{
                                            background: selectedMinute === minute ? '#007bff' : 'transparent',
                                            color: selectedMinute === minute ? 'white' : 'black',
                                            padding: '5px',
                                            cursor: getCursorStyle(),
                                            ...style.minuteItem // Apply custom styles from props
                                        }}>
                                        {minute < 10 ? `0${minute}` : minute}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {(selectedHour !== null || selectedMinute !== null) && !readOnly && !disabled && (
                <Button
                    variant="danger"
                    onClick={onClear}
                    className='button-delete'
                    style={{ cursor: getCursorStyle(),...style.clearButton }} // Apply custom styles from props
                >
                    <Trash className='trash-custom' />
                </Button>
            )}
        </div>
    );
};

export default SansTimePicker;
