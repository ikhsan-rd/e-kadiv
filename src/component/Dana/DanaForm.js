import React, { useState, useEffect } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import DanaKeluarInput from './DanaKeluarInput';
import DanaMasukInput from './DanaMasukInput';
import DanaRekap from './DanaRekap';

function DanaForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('');
  const [loading,setLoading] = useState(false);

  const currentJabatan = localStorage.getItem('jabatan');

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    setActiveItem(lastPart);
  }, [location.pathname]);

  const handleNavItemClick = (path) => {
    setActiveItem(path);
    navigate(`/keuangan/${path}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      style={{
        backgroundColor: 'whitesmoke',
        padding: '2%',
        borderRadius: '10px',
      }}
    >
      {/* {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && ( */}
        <Nav variant="tabs" activeKey={activeItem}>
          <Nav.Item>
            <Nav.Link
              className={`nav-link ${activeItem === 'rekap' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('rekap')}
            >
              Rekapitulasi
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`nav-link ${activeItem === 'keluar' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('keluar')}
            >
              Tambah Dana Keluar
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`nav-link ${activeItem === 'masuk' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('masuk')}
            >
              Tambah Dana Masuk
            </Nav.Link>
          </Nav.Item>
        </Nav>
      {/* )} */}

      {/* Content Form Dana Rekap */}
      {activeItem === 'rekap' && <DanaRekap />}

      {/* Content Dana Keluar Input */}
      {activeItem === 'keluar' && <DanaKeluarInput />}

      {/* Content Dana Masuk Input */}
      {activeItem === 'masuk' && <DanaMasukInput />}
    </Container>
  );
}

export default DanaForm;
