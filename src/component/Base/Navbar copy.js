// NavbarCustom.js
import '../../css/navbar.scss';
import '../../css/button.scss';
import { Button,Container,Form,Nav,Navbar,NavDropdown,Modal,Image } from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';
import { PersonCircle,Search } from 'react-bootstrap-icons';
import React,{ useState,useEffect } from 'react';

function NavigationBar()
{
  const currentJabatan = localStorage.getItem('jabatan');
  const currentId_akun = localStorage.getItem('id_akun');
  const currentFoto = localStorage.getItem('foto');

  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const [showLogoutModal,setShowLogoutModal] = useState(false);

  const handleLogout = () =>
  {
    setLoading(true);
    // Hapus data dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id_akun');
    localStorage.removeItem('jabatan');
    localStorage.removeItem('foto');
    localStorage.removeItem('lastSignIn');

    // Perbarui status login dan arahkan pengguna ke halaman login
    setLoading(false);
    navigate('/login');
  };

  // useEffect(() =>
  // {
  //   if (!localStorage.getItem('token'))
  //   {
  //     navigate('/login');
  //   }
  // },[navigate]);

  const handleLogoutConfirmation = () =>
  {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () =>
  {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () =>
  {
    handleLogout();
    handleCloseModal();
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Brand as={Link} to="/dashboard">E-Kadiv</Navbar.Brand>
          <Navbar.Collapse id="navbarScroll" >
            <Form className="d-flex me-auto my-lg-0 search-bar" style={{ maxHeight: '100px' }} navbarScroll>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-primary" className='button-search'>
                <Search className='search-custom'></Search>
              </Button>
            </Form>
            {currentId_akun && (
              <NavDropdown
                align={{ lg: 'end' }}
                id='dropdown-profil-sidebar'
                title={
                  currentFoto ? (
                    <img
                      src={currentFoto}
                      alt="User"
                      style={{ width: '36px',height: '36px',borderRadius: '50%' }}
                    />
                  ) : (
                    <PersonCircle style={{ width: '36px',height: '36px',color: '#dee2e6' }} />
                  )
                }
              >
                <NavDropdown.Item href="/pengaturan">Pengaturan</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogoutConfirmation}>Logout</NavDropdown.Item>
                <div>
                  {<span className="navbar-text">{currentJabatan}</span>}
                </div>
                <div>
                  {<span className="navbar-text">{currentId_akun}</span>}
                </div>
              </NavDropdown>
            )}
            {!currentId_akun && (
              < Nav className="d-flex">
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </Nav>
            )}
            {currentId_akun && (
              <Nav className="d-flex">
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                  <Nav.Link as={Link} to="/database/presensi/input">Presensi</Nav.Link>
                )}
                {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                  <Nav.Link as={Link} to="/keuangan/input">Keuangan</Nav.Link>
                )}
                <NavDropdown title="Performa" align={{ lg: 'end' }} id="dropdown-menu-align-responsive-2">
                  <NavDropdown.Item as={Link} to="/performa/divisi">Divisi</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/performa/team">Team</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/performa/individu">Individu</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Database" align={{ lg: 'end' }} id="dropdown-menu-align-responsive-3">
                  <NavDropdown.Item as={Link} to="/database/presensi/table">Presensi</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/database/team/table">Team</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/database/jadwal/table">Jadwal</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/database/sarana/table">Sarana</NavDropdown.Item>
                  {(currentJabatan !== 'Pelatih') && (
                    <NavDropdown.Item as={Link} to="/database/akun/table">Akun</NavDropdown.Item>
                  )}
                </NavDropdown>
                {(currentJabatan !== 'Pelatih') && (
                  <NavDropdown title="Report" align={{ lg: 'end' }} id="dropdown-menu-align-responsive-4">
                    <NavDropdown.Item as={Link} to="/report/laporan-pertanggungjawaban">Pertahun (LPJ)</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/report/laporan-pertiga-bulanan">Pertiga-Bulan</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/report/laporan-bulanan">Perbulan</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/report/custom">Custom</NavDropdown.Item>
                  </NavDropdown>
                )}
                {currentId_akun && (
                  <NavDropdown
                    align={{ lg: 'end' }}
                    id='dropdown-profil-navbar'
                    title={
                      currentFoto ? (
                        <img
                          src={currentFoto}
                          alt="User"
                          style={{ width: '36px',height: '36px',borderRadius: '50%' }}
                        />
                      ) : (
                        <PersonCircle style={{ width: '36px',height: '36px',color: '#dee2e6' }} />
                      )
                    }
                  >
                    <NavDropdown.Item href="/pengaturan">Pengaturan</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogoutConfirmation}>Logout</NavDropdown.Item>
                    <div>
                      {<span className="navbar-text">{currentJabatan}</span>}
                    </div>
                    <div>
                      {<span className="navbar-text">{currentId_akun}</span>}
                    </div>
                  </NavDropdown>
                )}
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar >

      <Modal show={showLogoutModal} onHide={handleCloseModal}
        style={{
          position: 'fixed',
          marginTop: '10vh',
          marginRight: '2px'
        }}>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin logout?</Modal.Body>
        <Modal.Footer
          style={
            {
              display: 'flex',
              justifyContent: 'center'
            }
          }>
          <Button variant="danger" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmLogout}>
            {loading ? 'Loading...' : 'Logout'}
          </Button>
        </Modal.Footer>
      </Modal >
    </>

  );
}

export default NavigationBar;
