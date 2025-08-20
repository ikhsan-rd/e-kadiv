import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

export const SansDivisiDropdown = ({ value,onChange,disabled,required }) =>
{
    const [divisiList,setDivisiList] = useState([]);
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');
    const [loading,setLoading] = useState(false);

    useEffect(() =>
    {
        const fetchDivisiList = async () =>
        {
            setLoading(true);
            try
            {
                const response = await axios.get('http://localhost:8000/api/divisi',{
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });

                // Get all divisi from API
                const allDivisi = response.data.data.map(item => item.divisi);

                // Filter divisi list based on the user's division
                const uniqueDivisiList = [...new Set(allDivisi)]; // Remove duplicates

                if (currentDivisi === '-' || currentDivisi === null)
                {
                    // If the user has access to all divisions, use the full list
                    setDivisiList(uniqueDivisiList);
                } else
                {
                    // If the user has a specific division, filter the list
                    setDivisiList(uniqueDivisiList.filter(divisi => divisi === currentDivisi));
                }

            } catch (error)
            {
                console.error('Error fetching divisi list:',error);
            } finally
            {
                setLoading(false);
            }
        };

        fetchDivisiList();
    },[currentToken,currentDivisi]);

    return (
        <Form.Select
            name="divisi"
            value={currentDivisi !== '-' ? currentDivisi : value}
            onChange={onChange}
            disabled={disabled}
            required={required}
        >
            <option value="">Semua Divisi</option>
            {divisiList.map((divisi,index) => (
                <option key={index} value={divisi}>{divisi}</option>
            ))}
        </Form.Select>
    );
};


export const SansDaysDropdown = ({ value,onChange,disabled,required }) =>
{
    return (

        <Form.Select
            name='hari'
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
        >
            <option value="">Hari</option>
            <option value="Senin">Senin</option>
            <option value="Selasa">Selasa</option>
            <option value="Rabu">Rabu</option>
            <option value="Kamis">Kamis</option>
            <option value="Jumat">Jumat</option>
            <option value="Sabtu">Sabtu</option>
            <option value="Minggu">Minggu</option>
        </Form.Select>
    );
};

