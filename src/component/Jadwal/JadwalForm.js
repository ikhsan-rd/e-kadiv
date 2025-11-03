import React,{ useState,useEffect } from 'react';
import { Container,Nav } from 'react-bootstrap';
import { useLocation,useNavigate } from 'react-router-dom';

import JadwalTable from './JadwalTable';
import JadwalInput from './JadwalInput';

function JadwalForm()
{
    const location = useLocation();
    const navigate = useNavigate();
    const [activeItem,setActiveItem] = useState('');
    const [loading,setLoading] = useState(false);

    const currentJabatan = sessionStorage.getItem('jabatan');

    useEffect(() =>
    {
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        setActiveItem(lastPart);
    },[location.pathname]);

    const nowPath = location.pathname;
    useEffect(() =>
    {
        if (nowPath === '/database/jadwal')
        {
            navigate(`/database/jadwal/table`);
        }
    },[nowPath,navigate]);

    const handleNavItemClick = (path) =>
    {
        setActiveItem(path);
        navigate(`/database/jadwal/${path}`);
    };

    return (
        <Container style={
            {
                backgroundColor: 'whitesmoke',
                padding: '2%',
                borderRadius: '10px'
            }
        }>
            <Nav variant="tabs" activeKey={activeItem}>
                <Nav.Item>
                    <Nav.Link
                        className={`nav-link ${activeItem === 'table' ? 'active' : ''}`}
                        onClick={() => handleNavItemClick('table')}
                    >
                        Table
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Content Form Jadwal Table */}
            {activeItem === 'table' && (
                <JadwalTable />
            )}
        </Container>
    );
}
export default JadwalForm;