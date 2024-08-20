import React,{ useState,useEffect } from 'react';
import { Container,Nav } from 'react-bootstrap';
import { useLocation,useNavigate } from 'react-router-dom';

import AtletInput from './AtletInput';
import AtletTable from './AtletTable';
import PelatihInput from './PelatihInput';
import PelatihTable from './PelatihTable';

function TeamForm()
{
    const location = useLocation();
    const navigate = useNavigate();
    const [activeItem,setActiveItem] = useState('');
    const [loading,setLoading] = useState(false);

    const currentJabatan = localStorage.getItem('jabatan');

    useEffect(() =>
    {
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts.slice(-2).join('/');
        setActiveItem(lastPart);
    },[location.pathname]);

    const nowPath = location.pathname;
    useEffect(() =>
        {
        if (nowPath === '/database/team')
        {
            navigate(`/database/team/atlet/table`);
        }
    },[nowPath, navigate]);

    const handleNavItemClick = (path) =>
    {
        setActiveItem(path);
        navigate(`/database/team/${path}`);
    };

    if (loading)
    {
        return <div>Loading...</div>;
    }

    return (
        <Container style={{
            backgroundColor: 'whitesmoke',
            padding: '2%',
            borderRadius: '10px'
        }}>
            <Nav variant="tabs" activeKey={activeItem}>
                <Nav.Item>
                    <Nav.Link
                        className={`nav-link ${activeItem === 'atlet/table' ? 'active' : ''}`}
                        onClick={() => handleNavItemClick('atlet/table')}
                    >
                        Data Atlet
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item style={{ marginRight: '10px' }}>
                    <Nav.Link
                        className={`nav-link ${activeItem === 'pelatih/table' ? 'active' : ''}`}
                        onClick={() => handleNavItemClick('pelatih/table')}
                    >
                        Data Pelatih
                    </Nav.Link>
                </Nav.Item>
                {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                    <>
                        <Nav.Item>
                            <Nav.Link disabled='true' >
                                |
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                className={`nav-link ${activeItem === 'atlet/input' ? 'active' : ''}`}
                                onClick={() => handleNavItemClick('atlet/input')}
                            >
                                Tambah Atlet
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                className={`nav-link ${activeItem === 'pelatih/input' ? 'active' : ''}`}
                                onClick={() => handleNavItemClick('pelatih/input')}
                            >
                                Tambah Pelatih
                            </Nav.Link>
                        </Nav.Item>
                    </>
                )}
            </Nav>


            {activeItem === 'atlet/table' && (
                <AtletTable />
            )}

            {activeItem === 'pelatih/table' && (
                <PelatihTable />
            )}

            {activeItem === 'atlet/input' && (
                <AtletInput />
            )}

            {activeItem === 'pelatih/input' && (
                <PelatihInput />
            )}
        </Container>
    );
}

export default TeamForm;