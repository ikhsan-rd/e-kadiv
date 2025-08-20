import React from 'react';
import { Form,InputGroup } from 'react-bootstrap';

function SansMoneyInput({ value,onChange,disabled,required,name,style,formatEvent = true })
{
    // Fungsi untuk menambahkan titik otomatis sebagai pemisah ribuan
    const formatNumberWithDots = (number) =>
    {
        // Handle null, undefined, or empty string
        if (number === null || number === undefined || number === '') return '';
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
    };

    const handleInputChange = (e) =>
    {
        // Hapus semua titik
        const rawValue = e.target.value.replace(/\./g,'');
        if (formatEvent)
        {
            // Format objek event jika diperlukan
            const event = {
                target: {
                    name: name,
                    value: rawValue
                }
            };
            onChange(event); // Kembalikan objek event ke fungsi onChange
        } else
        {
            // Format nilai langsung jika tidak perlu objek event
            onChange(rawValue); // Kembalikan nilai mentah
        }
    };

    return (
        <InputGroup style={{
            ...style
        }}
        >
            <InputGroup.Text>Rp</InputGroup.Text>
            <Form.Control
                type="text"
                name={name}
                value={formatNumberWithDots(value)}
                onChange={handleInputChange}
                disabled={disabled}
                required={required}
            />
        </InputGroup>
    );
}

export default SansMoneyInput;
