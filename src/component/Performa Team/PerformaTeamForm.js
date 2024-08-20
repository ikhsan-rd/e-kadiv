import React,{ useState,useEffect } from 'react';
import { Container,Nav } from 'react-bootstrap';
import { useLocation,useNavigate } from 'react-router-dom';

import DataTeam from './DataTeam';
import RiwayatTeam from './RiwayatTeam';

function PerformaTeamForm()
{
    const location = useLocation();
    const navigate = useNavigate();
    const [activeItem,setActiveItem] = useState('');
    const [loading,setLoading] = useState(false);

    const currentJabatan = localStorage.getItem('jabatan');

    useEffect(() =>
    {
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        setActiveItem(lastPart);
    },[location.pathname]);

    const handleNavItemClick = (path) =>
    {
        setActiveItem(path);
        navigate(`/performa/team/${path}`);
    };

    if (loading)
    {
        return <div>Loading...</div>;
    }

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
                        className={`nav-link ${activeItem === 'data' ? 'active' : ''}`}
                        onClick={() => handleNavItemClick('data')}
                    >
                        Performa
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        className={`nav-link ${activeItem === 'riwayat' ? 'active' : ''}`}
                        onClick={() => handleNavItemClick('riwayat')}
                    >
                        Riwayat
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Content Form Akun Table */}
            {activeItem === 'data' && (
                <DataTeam />
            )}

            {/* Content Form Akun Input */}
            {activeItem === 'riwayat' && (
                <RiwayatTeam />
            )}

        </Container>
    );
}
export default PerformaTeamForm;