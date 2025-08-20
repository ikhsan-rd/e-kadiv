import React,{ useState,useEffect } from 'react';
import { Container,Nav } from 'react-bootstrap';
import { useLocation,useNavigate } from 'react-router-dom';

import SaranaInput from './SaranaInput';
import SaranaTable from './SaranaTable';

function SaranaForm()
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
        if (nowPath === '/database/sarana')
        {
            navigate(`/database/sarana/table`);
        }
    },[nowPath,navigate]);

    const handleNavItemClick = (path) =>
    {
        setActiveItem(path);
        navigate(`/database/sarana/${path}`);
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
                        className={`nav-link ${activeItem === 'table' ? 'active' : ''}`}
                        onClick={() => handleNavItemClick('table')}
                    >
                        Table
                    </Nav.Link>
                </Nav.Item>
                {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                    <Nav.Item>
                        <Nav.Link
                            className={`nav-link ${activeItem === 'input' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('input')}
                        >
                            Tambah
                        </Nav.Link>
                    </Nav.Item>
                )}
            </Nav>

            {/* Content from Sarana Table */}
            {activeItem === 'table' && (
                <SaranaTable />
            )}

            {/* Content from Sarana Input */}
            {activeItem === 'input' && (
                <SaranaInput />
            )}
        </Container>
    );
}
export default SaranaForm;