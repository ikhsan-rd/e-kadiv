// NavbarCustom.js
import '../../css/navbar.scss';
import '../../css/button.scss';
<<<<<<< HEAD
import { Button, Container, Form, Nav, Navbar, NavDropdown, Modal, Image, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { clearToken } from './../../utils/tokenConfig';
import { SansLoadOrNotImage, SansNotify } from '../ComponentCustom/SansComps';

function NavigationBar() {
=======
import { Button,Container,Form,Nav,Navbar,NavDropdown,Modal,Image,Spinner } from 'react-bootstrap';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';
import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { clearToken } from './../../utils/tokenConfig';
import { SansLoadOrNotImage,SansNotify } from '../ComponentCustom/SansComps';

function NavigationBar()
{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
  const currentJabatan = sessionStorage.getItem("jabatan")
  const currentNomor = sessionStorage.getItem("nomor_anggota")
  const currentFoto = sessionStorage.getItem("foto");
  const currentToken = sessionStorage.getItem("token");

  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
<<<<<<< HEAD
  const isDropdownActive = (basePath) => {
    return window.location.pathname.startsWith(basePath);
  };

  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [status, setStatus] = useState(null);
  const [showNotify, setShowNotify] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    setLoading(true);

    if (!currentToken) {
=======
  const isDropdownActive = (basePath) =>
  {
    return window.location.pathname.startsWith(basePath);
  };

  const [loading,setLoading] = useState(false);
  const [showLogoutModal,setShowLogoutModal] = useState(false);
  const [status,setStatus] = useState(null);
  const [showNotify,setShowNotify] = useState(false);
  const [successMessage,setSuccessMessage] = useState("");
  const [errorMessage,setErrorMessage] = useState("");

  const handleLogout = async () =>
  {
    setLoading(true);

    if (!currentToken)
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
      console.error("No token found, redirecting to login");
      setLoading(false);
      navigate("/login");
      return;
    }

<<<<<<< HEAD
    try {
=======
    try
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );
      setSuccessMessage("Logout successful!");
      setStatus('success');
<<<<<<< HEAD
    } catch (error) {
      setErrorMessage(error);
      setStatus('error');
    } finally {
=======
    } catch (error)
    {
      setErrorMessage(error);
      setStatus('error');
    } finally
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
      clearToken();
      sessionStorage.removeItem("nomor_anggota");
      sessionStorage.removeItem("jabatan");
      sessionStorage.removeItem("foto");

      navigate("/login");

<<<<<<< HEAD
      setTimeout(() => {
        setLoading(false);
        setShowNotify(true);
      }, 100);
    }
  };

  const handleCloseNotify = () => {
    setShowNotify(false);

    setTimeout(() => {
      setStatus(null);
    }, 100);
=======
      setTimeout(() =>
      {
        setLoading(false);
        setShowNotify(true);
      },100);
    }
  };

  const handleCloseNotify = () =>
  {
    setShowNotify(false);

    setTimeout(() =>
    {
      setStatus(null);
    },100);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
  };

  const handleLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
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
            {currentToken && (
              <NavDropdown
                align={{ lg: 'end' }}
                id='dropdown-profil-sidebar'
                title={
                  <SansLoadOrNotImage
                    src={currentFoto}
                    width="30px"
                    height="30px"
                    shape="circle"
                    onError={() => console.log('Gambar gagal dimuat')}
                  />
                }
              >
                <NavDropdown.Item href="/pengaturan">Pengaturan</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogoutConfirmation}>Logout</NavDropdown.Item>
                <div>
                  {<span className="navbar-text">{currentJabatan}</span>}
                </div>
                <div>
                  {<span className="navbar-text">{currentNomor}</span>}
                </div>
              </NavDropdown>
            )}
            {!currentToken && (
              < Nav className="d-flex">
                <Nav.Link as={Link}
                  className={`link-underline ${isActive("/dashboard") ? "active" : ""}`}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link}
                  className={`link-underline ${isActive("/login") ? "active" : ""}`}
                >
                  Login
                </Nav.Link>
              </Nav>
            )}
            {currentToken && (
              <Nav className="d-flex">
                <Nav.Link as={Link}
                  className={`link-underline ${isActive("/dashboard") ? "active" : ""}`}
                  to="/dashboard"
                >
                  Dashboard
                </Nav.Link>

                {/* {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                  <Nav.Link as={Link}
                    className={`link-underline ${isActive("/database/presensi/input") ? "active" : ""}`}
                    to="/database/presensi/input"
                  >
                    Presensi
                  </Nav.Link>
                )} */}
                {/* {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                  <Nav.Link as={Link}
                    className={`link-underline ${isActive("/keuangan/rekap/data") ? "active" : ""}`}
                    to="/keuangan/rekap/data"
                  >
                    Keuangan
                  </Nav.Link>
                )} */}
                <NavDropdown
                  title="Performa"
                  align={{ lg: 'end' }}
                  id="dropdown-menu-align-responsive-2"
                  className={`nav-item-underline ${isDropdownActive("/performa") ? "active" : ""}`}
                >
                  <NavDropdown.Item as={Link} to="/performa/divisi">Divisi</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/performa/team/data">Team</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/performa/atlet">Performa Atlet</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown
                  title="Database"
                  align={{ lg: 'end' }}
                  id="dropdown-menu-align-responsive-3"
                  className={`nav-item-underline ${isDropdownActive("/database") ? "active" : ""}`}
                >
                  <NavDropdown.Item as={Link} to="/database/presensi/table">Presensi</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/database/keuangan/rekap">Keuangan</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/database/team/atlet/table">Team</NavDropdown.Item>
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
                {currentToken && (
                  <NavDropdown
                    align={{ lg: 'end' }}
                    id='dropdown-profil-navbar'
                    title={
                      <SansLoadOrNotImage
                        src={currentFoto}
                        width="30px"
                        height="30px"
                        shape="circle"
                        onError={() => console.log('Gambar gagal dimuat')}
                      />
                    }
                  >
                    <NavDropdown.Item href="/pengaturan">Pengaturan</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogoutConfirmation}>Logout</NavDropdown.Item>
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
          marginRight: '2px'
        }} centered >
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
            {loading ? <Spinner animation="border" size="sm" /> : 'Logout'}
          </Button>
        </Modal.Footer>
      </Modal >

      <SansNotify
        show={showNotify}
        onHide={handleCloseNotify}
        status={status}
        onSuccess={successMessage}
        onError={errorMessage}
      />

    </>

  );
}

export default NavigationBar;
