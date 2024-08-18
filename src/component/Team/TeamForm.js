import React,{ useState,useEffect } from 'react';
import { Container,Nav } from 'react-bootstrap';
import { useLocation,useNavigate } from 'react-router-dom';

import AtletInput from './AtletInput';
import PelatihInput from './PelatihInput';
import TeamTable from './TeamTable';

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
        const lastPart = pathParts[pathParts.length - 1];
        setActiveItem(lastPart);
    },[location.pathname]);

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
            {/* {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && ( */}
                <Nav variant="tabs" activeKey={activeItem}>
                    <Nav.Item>
                        <Nav.Link
                            className={`nav-link ${activeItem === 'table' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('table')}
                        >
                            Data Team
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            className={`nav-link ${activeItem === 'atlet' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('atlet')}
                        >
                            Tambah Atlet
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            className={`nav-link ${activeItem === 'pelatih' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('pelatih')}
                        >
                            Tambah Pelatih
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            {/* // )}
            //  {(currentJabatan === 'Puspendiv' || currentJabatan === 'Pelatih') && ( */}
            {/* //     <Nav variant="tabs" activeKey={activeItem}>
            //         <Nav.Item>
            //             <Nav.Link
            //                 className={`nav-link ${activeItem === 'table' ? 'active' : ''}`}
            //                 onClick={() => handleNavItemClick('table')}
            //             >
            //                 Data Team
            //             </Nav.Link>
            //         </Nav.Item>
            //     </Nav> */}
            {/* // )} */}

            {/* Content Form data Atlet */}
            {activeItem === 'table' && (
                <TeamTable />
            )}

            {/* Content Form data Atlet */}
            {activeItem === 'atlet' && (
                <AtletInput />
            )}

            {/* Content Form data Atlet */}
            {activeItem === 'pelatih' && (
                <PelatihInput />
            )}
        </Container>
    );
}

export default TeamForm;