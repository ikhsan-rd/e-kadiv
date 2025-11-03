import React, { useEffect, useState } from 'react';
import { Table, Container, Form, Row, Col, Button, Modal, ModalBody } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AkunPrint } from './AkunPrint';
import axios from 'axios';
import {
SansLoadOrNotImage,
SansDeleteModal,
SansSpinnerOnTable,
SansNothingOnTable,
SansButtonEdit,
SansButtonProtect,
SansButtonDelete,
SansFilter,
SansSearch,
SansSortableTable,
SansNotify,
SansFormatDateAndTime,
SansButtonAddData,
SansButtonPrintAll,
} from '../ComponentCustom/SansComps';
import AkunEdit from './AkunEdit';
import { Download } from 'react-bootstrap-icons';
import AkunInput from './AkunInput';

function AkunTable() {
  const currentJabatan = sessionStorage.getItem('jabatan');
  const currentNomor = sessionStorage.getItem('nomor_anggota');
  const currentToken = sessionStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //fetch
  const [tableData, setTableData] = useState([]);
  const { sortedData, requestSort, getSortIcon } = SansSortableTable({
    data: tableData,
    defaultSort: 'nomor_anggota',
    type: 'ascending'
  });

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },

      });
      console.log('Data fetched: ', response.data);

      const formattedData = response.data.data.map(item => ({
        ...item,
        formatted_last_sign_in: SansFormatDateAndTime(item.last_sign_in),
      }));

      setTableData(formattedData);

      const uniqueListData = [...new Set(response.data.data.map(item => item.jabatan))];
      setUniqueList(uniqueListData);

    } catch (error) {
      console.error('Error fetching data:', error);
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const maskPassword = (password) => {
    if (typeof password !== 'string') {
      console.error('Invalid password type:', typeof password);
      return '';
    }
    if (password.length > 4) {
      const numberOfStars = password.length - 2;
      return password.slice(0, 1) + '*'.repeat(numberOfStars) + password.slice(-1);
    }
    return '*'.repeat(password.length);
  };

  //filter, sort, search
  const [uniqueList, setUniqueList] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const filtered = sortedData
      .filter(item =>
        (filter ? item.jabatan === filter : true) &&
        (searchTerm ?
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nomor_anggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.divisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.last_sign_in.toString().includes(searchTerm)
          : true)
      );

    setFiltered(filtered);
  }, [filter, searchTerm, sortedData]);

  const handleClearAll = () => {
    setFilter('');
    setSearchTerm('');
    requestSort('');
  };

  //Add
  const [showAdd, setShowAdd] = useState(false);

  const handleShowAdd = () => {
    setShowAdd(true);
  }

  const handleCloseAdd = () => {
    setShowAdd(false);
  }

  // Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nomor_anggota: "",
    fe_password: "",
    divisi: "",
    jabatan: "",
    foto: null,
  });

  const handleEditClick = async (item) => {
    setEditingRowId(item.id);
    setFormData({
      nama: item.nama,
      nomor_anggota: item.nomor_anggota,
      fe_password: item.fe_password,
      divisi: item.divisi,
      jabatan: item.jabatan,
      foto: item.foto,
    });
    setIsEditing(true);
    setIsEditingPhoto(false);
  };


  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingRowId(null);
    setFormData({
      nama: "",
      nomor_anggota: "",
      fe_password: "",
      divisi: "",
      jabatan: "",
      foto: null,
    });
  };

  // Delete
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);

  const handleDelete = async () => {
    if (deleteId) {
      setLoading(true);
      setDeleteFailed(false);
      try {
        await axios.delete(`http://localhost:8000/api/user/${deleteId}`, {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
        });

        handleCloseModalDelete();
        setSuccessMessage("Data akun berhasil dihapus");
        setStatus('success');
        setShowNotify(true);
        fetchTableData();
      } catch (err) {
        setErrorMessage("Terjadi Kesalahan");
        setStatus('error');
        setShowNotify(true);
        setDeleteFailed(true);
        console.error("Delete failed:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleCloseModalDelete = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  //notify
  const [status, setStatus] = useState(null);
  const [showNotify, setShowNotify] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseNotify = () => {
    setShowNotify(false);
    setSuccessMessage("");
    setErrorMessage("");

    if (status === 'success') {
      handleCancelClick();
    }

    setTimeout(() => {
      setStatus(null);
      setIsEditingPhoto(false);
    }, 100);
  };

  // print
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleShowPreview = () => {
    const url = AkunPrint(filtered);
    setPdfUrl(url);
    setShowPreview(true);
  }

  const handleClosePerview = () => {
    setShowPreview(false);
    setPdfUrl(null);
  }

  return (
    <>
      <Container>
        <Form style={{ marginTop: '15px' }}>
          <h2 style={{ marginBottom: '15px' }}>Daftar Akun</h2>
          <Row style={{ marginBottom: '10px' }}>
            <Form.Group as={Col} md={2}>
              <SansFilter
                filterOptions={uniqueList.map(jabatan => ({ value: jabatan, label: jabatan }))}
                selectedFilter={filter}
                text='Jabatan'
                onFilterChange={setFilter}
              />
            </Form.Group>
            <Form.Group as={Col} md={3}>
              <SansSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </Form.Group>
            <Form.Group as={Col} md={2}>
              <Button onClick={handleClearAll}>
                Clear All
              </Button>
            </Form.Group>
            <Form.Group as={Col} className="d-flex justify-content-end">
              <SansButtonPrintAll
                onClick={handleShowPreview}
              />
              {currentJabatan !== 'Kadiv' && (
                <SansButtonAddData
                  onClick={handleShowAdd}
                />
              )}
            </Form.Group>
          </Row>
          <Table striped bordered hover>
            <thead>
              <tr className='text-center'>
                <th>No</th>
                <th>Foto</th>
                <th onClick={() => requestSort('nomor_anggota')}>
                  Username {getSortIcon('nomor_anggota')}
                </th>
                <th onClick={() => requestSort('nama')}>
                  Nama {getSortIcon('nama')}
                </th>
                <th>Password</th>
                <th onClick={() => requestSort('jabatan')}>
                  Jabatan {getSortIcon('jabatan')}
                </th>
                <th onClick={() => requestSort('divisi')}>
                  Divisi {getSortIcon('divisi')}
                </th>
                <th onClick={() => requestSort('last_sign_in')}>
                  Terakhir Login {getSortIcon('last_sign_in')}
                </th>
                {(currentJabatan === 'Admin' || currentJabatan === 'Puspendiv') && (
                  <th>Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SansSpinnerOnTable />
              ) : filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <tr key={item.id}>
                    <td className='text-center'>{index + 1}</td>
                    <td className='text-center'>
                      <SansLoadOrNotImage
                        src={item.foto}
                        width="50px"
                        height="50px"
                        shape="square"
                        onError={() => console.log('Gambar gagal dimuat')}
                      />
                    </td>
                    <td>{item.nomor_anggota}</td>
                    <td>{item.nama}</td>
                    <td>{maskPassword(item.fe_password)}</td>
                    <td>{item.jabatan}</td>
                    <td>{item.divisi}</td>
                    <td>{item.formatted_last_sign_in ? item.formatted_last_sign_in : 'Belum Login'}</td>
                    {(currentJabatan === 'Admin' || currentJabatan === 'Puspendiv') ? (
                      <td className='text-center'>
                        {item.jabatan === 'Admin' && currentJabatan !== 'Admin' ? (
                          <SansButtonProtect />
                        ) : (
                          <>
                            <SansButtonEdit onClick={() => handleEditClick(item)} />
                            {currentNomor === item.nomor_anggota ? (
                              <SansButtonProtect />
                            ) : (
                              <SansButtonDelete onClick={() => handleDeleteConfirmation(item.id)} />
                            )}
                          </>
                        )}
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <SansNothingOnTable />
              )}
            </tbody>
          </Table>
        </Form>

      </Container>

      <Modal show={showAdd} onHide={handleCloseAdd} style={{ borderRadius: '5px' }} size='xl' centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Akun</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <AkunInput />
        </ModalBody>
      </Modal>


      <AkunEdit
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        setLoading={setLoading}
        editingRowId={editingRowId}
        isEditing={isEditing}
        isEditingPhoto={isEditingPhoto}
        setIsEditingPhoto={setIsEditingPhoto}
        handleCancelClick={handleCancelClick}
        setStatus={setStatus}
        setShowNotify={setShowNotify}
        setErrorMessage={setErrorMessage}
        setSuccessMessage={setSuccessMessage}
        fetchTableData={fetchTableData}

      />

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

      <SansDeleteModal
        show={showDeleteModal}
        onHide={handleCloseModalDelete}
        onDelete={handleDelete}
        loading={loading}
        bodyText="Hapus data akun ini?"
        error={deleteFailed}
      />

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

export default AkunTable;
