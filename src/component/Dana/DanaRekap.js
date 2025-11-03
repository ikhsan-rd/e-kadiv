import React, { useState, useEffect } from 'react';
import axios from 'axios';
import terbilang from 'terbilang';
import { Row, Form, Button, Container, Col, Modal, Spinner } from 'react-bootstrap';
import { SansDivisiDropdown, SansNotify } from '../ComponentCustom/SansComps';
import { Download } from 'react-bootstrap-icons';
import { DanaRekapPrint } from './DanaRekapPrint';

function DanaRekap() {
  const [pemasukan, setPemasukan] = useState(0);
  const [pengeluaran, setPengeluaran] = useState(0);
  const [sisa, setSisa] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const currentToken = sessionStorage.getItem('token');

  //periode
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const periode = `${currentYear}/${nextYear}`;

  // Notify
  const [status, setStatus] = useState(null);
  const [showNotify, setShowNotify] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseNotify = () => {
    setShowNotify(false);
    setSuccessMessage("");
    setErrorMessage("");
    setTimeout(() => {
      setStatus(null);
    }, 100);
  };

  // print
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleShowPreview = () => {
    if (!filter || filter === '' || filter === '-') {
      setErrorMessage("Pilih divisi terlebih dahulu");
      setStatus('error');
      setShowNotify(true);
      return;
    }

    const url = DanaRekapPrint(filter, periode, pemasukan, pengeluaran, sisa, terbilangSisaCapitalized);
    setPdfUrl(url);
    setShowPreview(true);
  };


  const handleClosePerview = () => {
    setShowPreview(false);
    setPdfUrl(null);
  }

  useEffect(() => {
    if (filter) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const pemasukanResponse = await axios.get('http://localhost:8000/api/dana-masuk', {
            headers: {
              'Authorization': `Bearer ${currentToken}`,
            },
          });
          const totalPemasukan = pemasukanResponse.data.data
            .filter(item => item.divisi === filter)
            .reduce((sum, item) => sum + (item.total || 0), 0);

          const pengeluaranResponse = await axios.get('http://localhost:8000/api/dana-keluar', {
            headers: {
              'Authorization': `Bearer ${currentToken}`,
            },
          });

          const totalPengeluaran = pengeluaranResponse.data.data
            .filter(item => item.divisi === filter)
            .reduce((sum, item) => sum + (item.total || 0), 0);

          setPemasukan(totalPemasukan);
          setPengeluaran(totalPengeluaran);
          setSisa(totalPemasukan - totalPengeluaran);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [filter, currentToken]);

  //terbilang
  const terbilangSisa = terbilang(sisa, { currency: 'Rupiah' });

  function capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  const terbilangSisaCapitalized = capitalizeWords(terbilangSisa);

  return (
    <>
      <Container>
        <Form style={{ marginTop: '15px' }}>
          <h2>Rekapitulasi Dana</h2>
          <Row>
            <Form.Group as={Col} md={2}>
              <SansDivisiDropdown
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>
            {loading && (
              <Form.Group as={Col}>
                <Spinner style={{ marginTop: '10px' }} animation="border" size="sm" />
              </Form.Group>
            )}
            <Form.Group as={Col} className="d-flex justify-content-end">
              <Button onClick={handleShowPreview} disabled={loading}>
                Print
                <Download style={{ marginLeft: '8px' }} />
              </Button>
            </Form.Group>
          </Row>
          <div style={{ padding: '20px', backgroundColor: 'whitesmoke', borderRadius: '10px' }}>
            <p><strong>Pemasukan:</strong> Rp {pemasukan.toLocaleString()}</p>
            <p><strong>Pengeluaran:</strong> Rp {pengeluaran.toLocaleString()}</p>
            <p><strong>Sisa:</strong> Rp {sisa.toLocaleString()}</p>
            <p><strong>Jadi, sisa dana Divisi {filter} yang digunakan pada Kepengurusan UKM SPORT Periode {periode}, Sebesar Rp</strong> {sisa.toLocaleString()}</p>
            <p><strong>Terbilang:</strong> {terbilangSisaCapitalized} Rupiah</p>
          </div>
        </Form>
      </Container>


      <Modal show={showPreview} onHide={handleClosePerview} style={{ borderRadius: '5px' }} size='lg'>
        <Modal.Header closeButton>Pratinjau PDF</Modal.Header>
        <Modal.Body>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              style={{
                minHeight: '70vh',
                maxHeight: '70vh',
                maxWidth: '100%',
                width: '100%',
                borderBottom: '1px solid grey',
                objectFit: 'contain'
              }}
            ></iframe>
          )}
        </Modal.Body>
      </Modal>

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

export default DanaRekap;
