import React,{ useState,useRef,useEffect } from 'react';
import { FormControl,Form } from 'react-bootstrap';

const SansDayCheckBox = ({ value,onChange }) =>
{
    const [showOptions,setShowOptions] = useState(false);
    const [selectedDays,setSelectedDays] = useState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false
    });
    const dayPickerRef = useRef();

    useEffect(() =>
    {
        if (value)
        {
            setSelectedDays(value);
        } else
        {
            setSelectedDays({
                Monday: false,
                Tuesday: false,
                Wednesday: false,
                Thursday: false,
                Friday: false,
                Saturday: false,
                Sunday: false
            });
        }
    },[value]);

    const handleToggleOptions = () =>
    {
        setShowOptions(!showOptions);
    };

    const handleDayChange = (day) =>
    {
        const updatedDays = {
            ...selectedDays,
            [day]: !selectedDays[day]
        };
        setSelectedDays(updatedDays);
        onChange(updatedDays);
    };

    const handleClickOutside = (event) =>
    {
        if (dayPickerRef.current && !dayPickerRef.current.contains(event.target))
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

    const daysOfWeek = [
        { key: 'Monday',label: 'Senin' },
        { key: 'Tuesday',label: 'Selasa' },
        { key: 'Wednesday',label: 'Rabu' },
        { key: 'Thursday',label: 'Kamis' },
        { key: 'Friday',label: 'Jumat' },
        { key: 'Saturday',label: 'Sabtu' },
        { key: 'Sunday',label: 'Minggu' },
    ];

    return (
        <div style={{ position: 'relative',display: 'inline-block' }}>
            <FormControl
                onClick={handleToggleOptions}
                readOnly
                ref={dayPickerRef}
                value={Object.keys(selectedDays).filter(day => selectedDays[day]).map(day => daysOfWeek.find(d => d.key === day).label).join(', ')}
                placeholder="Pilih Hari"
            />
            {showOptions && (
                <div
                    ref={dayPickerRef}
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 5px)',
                        left: 0,
                        zIndex: 999,
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        padding: '10px'
                    }}>
                    <div style={{ maxHeight: '150px',overflowY: 'auto' }}>
                        {daysOfWeek.map((day) => (
                            <Form.Check
                                key={day.key}
                                type="checkbox"
                                label={day.label}
                                checked={selectedDays[day.key]}
                                onChange={() => handleDayChange(day.key)}
                                style={{ marginBottom: '5px' }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SansDayCheckBox;
