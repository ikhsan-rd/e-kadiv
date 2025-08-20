import React,{ useState,useEffect } from 'react';
import { Container,Nav } from 'react-bootstrap';
import { useLocation,useNavigate } from 'react-router-dom';

import DanaKeluarInput from './DanaKeluarInput';
import DanaMasukInput from './DanaMasukInput';
import DanaRekap from './DanaRekap';
import DanaKeluarTable from './DanaKeluarTable';
import DanaMasukTable from './DanaMasukTable';

function DanaForm()
{
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem,setActiveItem] = useState('');
  const [loading,setLoading] = useState(true);

  const currentJabatan = sessionStorage.getItem('jabatan');

  useEffect(() =>
  {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    setActiveItem(lastPart);
  },[location.pathname]);

  // useEffect(() =>
  // {
  //   if (loading)
  //   {
  //     setLoading(false);
  //   }
  // },[loading]);

  const nowPath = location.pathname;
  useEffect(() =>
  {
    if (nowPath === '/database/keuangan')
    {
      navigate(`/database/keuangan/rekap`);
    }
  },[nowPath,navigate]);

  const handleNavItemClick = (path) =>
  {
    setActiveItem(path);
    navigate(`/database/keuangan/${path}`);
  };

  return (
    <Container
      style={{
        backgroundColor: 'whitesmoke',
        padding: '2%',
        borderRadius: '10px',
      }}
    >
      {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
        <Nav variant="tabs" activeKey={activeItem}>
          <Nav.Item>
            <Nav.Link
              className={`nav-link ${activeItem === 'rekap' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('rekap')}
            >
              Rekap
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`nav-link ${activeItem === 'dana-keluar' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('dana-keluar')}
            >
              Data Dana Keluar
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`nav-link ${activeItem === 'dana-masuk' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('dana-masuk')}
            >
              Data Dana Masuk
            </Nav.Link>
          </Nav.Item>

          {/* <Nav.Item>
            <Nav.Link disabled>
              |
            </Nav.Link>
          </Nav.Item> */}

          {/* <Nav.Item>
            <Nav.Link
              className={`nav-link ${activeItem === 'dana-keluar/input' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('dana-keluar/input')}
            >
              Tambah Dana Keluar
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`nav-link ${activeItem === 'dana-masuk/input' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('dana-masuk/input')}
            >
              Tambah Dana Masuk
            </Nav.Link>
          </Nav.Item> */}
        </Nav>
      )}

      {/* Content Form Dana Rekap */}
      {activeItem === 'rekap' && <DanaRekap />}

      {/* Content Dana Keluar Input */}
      {activeItem === 'dana-keluar' && <DanaKeluarTable />}

      {/* Content Dana Masuk Input */}
      {activeItem === 'dana-masuk' && <DanaMasukTable />}

      {/* Content Dana Keluar Input */}
      {/* {activeItem === 'dana-keluar/input' && <DanaKeluarInput />} */}

      {/* Content Dana Masuk Input */}
      {/* {activeItem === 'dana-masuk/input' && <DanaMasukInput />} */}
    </Container>
  );
}

export default DanaForm;
