import React,{ useState,useRef,useEffect } from 'react';
import { FormControl } from 'react-bootstrap';

const TimePickerCustom = ({ format = '24h',value,onChange }) =>
{
    const [showOptions,setShowOptions] = useState(false);
    const [selectedHour,setSelectedHour] = useState(null);
    const [selectedMinute,setSelectedMinute] = useState(null);
    const [selectedAMPM,setSelectedAMPM] = useState('?');
    const timePickerRef = useRef();

    useEffect(() =>
    {
        if (value)
        {
            const [time,ampm] = value.split(' ');
            const [hour,minute] = time.split(':');
            setSelectedHour(parseInt(hour,10));
            setSelectedMinute(parseInt(minute,10));
            if (format === '12h')
            {
                setSelectedAMPM(ampm);
            }
        } else
        {
            setSelectedHour(null);
            setSelectedMinute(null);
            setSelectedAMPM('?');
        }
    },[value,format]);

    const handleToggleOptions = () =>
    {
        setShowOptions(!showOptions);
    };

    const handleHourSelect = (hour) =>
    {
        setSelectedHour(hour);
        if (format === '24h')
        {
            onChange(`${hour}:${selectedMinute !== null ? selectedMinute : '00'}`);
        } else if (format === '12h')
        {
            onChange(`${hour}:${selectedMinute !== null ? selectedMinute : '00'} ${selectedAMPM}`);
        }
    };

    const handleMinuteSelect = (minute) =>
    {
        setSelectedMinute(minute);
        if (format === '24h')
        {
            onChange(`${selectedHour !== null ? selectedHour : '00'}:${minute}`);
            setShowOptions(false);
        } else if (format === '12h')
        {
            onChange(`${selectedHour !== null ? selectedHour : '00'}:${minute} ${selectedAMPM}`);
        }
    };

    const handleAMPMSelect = (ampm) =>
    {
        if (format === '12h')
        {
            setSelectedAMPM(ampm);
            onChange(`${selectedHour !== null ? selectedHour : '00'}:${selectedMinute !== null ? selectedMinute : '00'} ${ampm}`);
            setShowOptions(false);
        }
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

    const hours = format === '12h' ? Array.from(Array(12).keys()).map(hour => hour + 1) : Array.from(Array(24).keys());
    const minutes = Array.from(Array(60).keys());

    return (
        <div style={{ position: 'relative',display: 'inline-block' }}>
            <FormControl
                onClick={handleToggleOptions}
                readOnly
                ref={timePickerRef}
                value={`${selectedHour !== null ? (selectedHour < 10 ? `0${selectedHour}` : selectedHour) : '--'}:${selectedMinute !== null ? (selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute) : '--'}${format === '12h' ? ` ${selectedAMPM}` : ''}`}
            />
            {showOptions && (
                <div
                    ref={timePickerRef}
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 5px)',
                        left: 0,
                        zIndex: 999,
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        padding: '5px 10px 10px 0'
                    }}>
                    <div className='time-scroll-down'
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            maxHeight: '150px'
                        }}>
                        <div>
                            <div className='hour-label' style={{marginLeft:'5px'}}>
                                <h7>Hour</h7>
                            </div>
                            <div className='hour-scroll-down'
                                style={{
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    maxHeight: '84%',
                                    padding: '0 8px 0 8px'
                                }}>
                                {hours.map((hour) => (
                                    <div key={hour} onClick={() => handleHourSelect(hour)}
                                        style={{
                                            background: selectedHour === hour ? '#007bff' : 'transparent',
                                            color: selectedHour === hour ? 'white' : 'black',
                                            padding: '5px',
                                            cursor: 'pointer'
                                        }}>
                                        {hour < 10 ? `0${hour}` : hour}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className='minute-label'>
                                <h7>Minute</h7>
                            </div>
                            <div className='minute-scroll-down'
                                style={{
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    maxHeight: '84%',
                                    padding: '0 8px 0 8px'
                                }}>
                                {minutes.map((minute) => (
                                    <div key={minute} onClick={() => handleMinuteSelect(minute)}
                                        style={{
                                            background: selectedMinute === minute ? '#007bff' : 'transparent',
                                            color: selectedMinute === minute ? 'white' : 'black',
                                            padding: '5px',
                                            cursor: 'pointer'
                                        }}>
                                        {minute < 10 ? `0${minute}` : minute}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {format === '12h' && (
                            <div>
                                <div className='am-pm-label'>
                                    <h7>Period</h7>
                                </div>
                                <div className='am-pm-scroll-down'
                                    style={{
                                        paddingLeft: '8px',
                                        paddingRight: '8px'
                                    }}>
                                    <div onClick={() => handleAMPMSelect('Am')}
                                        style={{
                                            background: selectedAMPM === 'Am' ? '#007bff' : 'transparent',
                                            color: selectedAMPM === 'Am' ? 'white' : 'black',
                                            padding: '5px',
                                            cursor: 'pointer'
                                        }}>
                                        Am
                                    </div>
                                    <div onClick={() => handleAMPMSelect('Pm')}
                                        style={{
                                            background: selectedAMPM === 'Pm' ? '#007bff' : 'transparent',
                                            color: selectedAMPM === 'Pm' ? 'white' : 'black',
                                            padding: '5px',
                                            cursor: 'pointer'
                                        }}>
                                        Pm
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePickerCustom;
