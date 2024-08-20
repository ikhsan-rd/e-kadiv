import React,{ useState,useEffect } from 'react';
import { Container,Nav } from 'react-bootstrap';
import { useLocation,useNavigate } from 'react-router-dom';

import AkunTable from './AkunTable';
import AkunInput from './AkunInput';

function AkunForm()
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

    const nowPath = location.pathname;
    useEffect(() =>
    {
        if (nowPath === '/database/akun')
        {
            navigate(`/database/akun/table`);
        }
    },[nowPath,navigate]);

    const handleNavItemClick = (path) =>
    {
        setActiveItem(path);
        navigate(`/database/akun/${path}`);
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
            {(currentJabatan === 'Puspendiv' || currentJabatan === 'Admin') && (
                <Nav variant="tabs" activeKey={activeItem}>
                    <Nav.Item>
                        <Nav.Link
                            className={`nav-link ${activeItem === 'table' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('table')}
                        >
                            Table
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            className={`nav-link ${activeItem === 'input' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('input')}
                        >
                            Input
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            )}

            {(currentJabatan === 'Kadiv') && (
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
            )}

            {/* Content Form Akun Table */}
            {activeItem === 'table' && (
                <AkunTable />
            )}

            {/* Content Form Akun Input */}
            {activeItem === 'input' && (
                <AkunInput />
            )}

        </Container>
    );
}
export default AkunForm;