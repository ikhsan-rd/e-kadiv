<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Table, Container, Form, Row, Col, Button, Modal, ModalBody } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AkunPrint } from './AkunPrint';
import axios from 'axios';
import {
=======
import React,{ useEffect,useState } from 'react';
import { Table,Container,Form,Row,Col,Button,Modal, ModalBody } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AkunPrint } from './AkunPrint';
import axios from 'axios';
import 
{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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

<<<<<<< HEAD
function AkunTable() {
=======
function AkunTable()
{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
  const currentJabatan = sessionStorage.getItem('jabatan');
  const currentNomor = sessionStorage.getItem('nomor_anggota');
  const currentToken = sessionStorage.getItem('token');

<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //fetch
  const [tableData, setTableData] = useState([]);
  const { sortedData, requestSort, getSortIcon } = SansSortableTable({
=======
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  //fetch
  const [tableData,setTableData] = useState([]);
  const { sortedData,requestSort,getSortIcon } = SansSortableTable({
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    data: tableData,
    defaultSort: 'nomor_anggota',
    type: 'ascending'
  });

<<<<<<< HEAD
  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
=======
  useEffect(() =>
  {
    fetchTableData();
  },[]);

  const fetchTableData = async () =>
  {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },

      });
<<<<<<< HEAD
      console.log('Data fetched: ', response.data);
=======
      console.log('Data fetched: ',response.data);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a

      const formattedData = response.data.data.map(item => ({
        ...item,
        formatted_last_sign_in: SansFormatDateAndTime(item.last_sign_in),
      }));

      setTableData(formattedData);

      const uniqueListData = [...new Set(response.data.data.map(item => item.jabatan))];
      setUniqueList(uniqueListData);

<<<<<<< HEAD
    } catch (error) {
      console.error('Error fetching data:', error);
=======
    } catch (error)
    {
      console.error('Error fetching data:',error);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
<<<<<<< HEAD
  const [uniqueList, setUniqueList] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
=======
  const [uniqueList,setUniqueList] = useState([]);
  const [filter,setFilter] = useState('');
  const [searchTerm,setSearchTerm] = useState('');
  const [filtered,setFiltered] = useState([]);

  useEffect(() =>
  {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
<<<<<<< HEAD
  }, [filter, searchTerm, sortedData]);

  const handleClearAll = () => {
=======
  },[filter,searchTerm,sortedData]);

  const handleClearAll = () =>
  {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    setFilter('');
    setSearchTerm('');
    requestSort('');
  };

  //Add
<<<<<<< HEAD
  const [showAdd, setShowAdd] = useState(false);

  const handleShowAdd = () => {
    setShowAdd(true);
  }

  const handleCloseAdd = () => {
=======
  const [showAdd,setShowAdd] = useState(false);

  const handleShowAdd = () =>
  {
    setShowAdd(true);
  }

  const handleCloseAdd = () =>
  {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    setShowAdd(false);
  }

  // Edit
<<<<<<< HEAD
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [formData, setFormData] = useState({
=======
  const [isEditing,setIsEditing] = useState(false);
  const [editingRowId,setEditingRowId] = useState(null);
  const [isEditingPhoto,setIsEditingPhoto] = useState(false);
  const [formData,setFormData] = useState({
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    nama: "",
    nomor_anggota: "",
    fe_password: "",
    divisi: "",
    jabatan: "",
    foto: null,
  });

<<<<<<< HEAD
  const handleEditClick = async (item) => {
=======
  const handleEditClick = async (item) =>
  {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
<<<<<<< HEAD
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);

  const handleDelete = async () => {
    if (deleteId) {
      setLoading(true);
      setDeleteFailed(false);
      try {
        await axios.delete(`http://localhost:8000/api/user/${deleteId}`, {
=======
  const [deleteId,setDeleteId] = useState(null);
  const [showDeleteModal,setShowDeleteModal] = useState(false);
  const [deleteFailed,setDeleteFailed] = useState(false);

  const handleDelete = async () =>
  {
    if (deleteId)
    {
      setLoading(true);
      setDeleteFailed(false);
      try
      {
        await axios.delete(`http://localhost:8000/api/user/${deleteId}`,{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
        });

        handleCloseModalDelete();
        setSuccessMessage("Data akun berhasil dihapus");
        setStatus('success');
        setShowNotify(true);
        fetchTableData();
<<<<<<< HEAD
      } catch (err) {
=======
      } catch (err)
      {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        setErrorMessage("Terjadi Kesalahan");
        setStatus('error');
        setShowNotify(true);
        setDeleteFailed(true);
<<<<<<< HEAD
        console.error("Delete failed:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
        }
      } finally {
=======
        console.error("Delete failed:",err);
        if (err.response)
        {
          console.error("Response data:",err.response.data);
        }
      } finally
      {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
<<<<<<< HEAD
  const [status, setStatus] = useState(null);
  const [showNotify, setShowNotify] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseNotify = () => {
=======
  const [status,setStatus] = useState(null);
  const [showNotify,setShowNotify] = useState(false);
  const [successMessage,setSuccessMessage] = useState("");
  const [errorMessage,setErrorMessage] = useState("");

  const handleCloseNotify = () =>
  {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    setShowNotify(false);
    setSuccessMessage("");
    setErrorMessage("");

<<<<<<< HEAD
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
=======
    if (status === 'success')
    {
      handleCancelClick();
    }

    setTimeout(() =>
    {
      setStatus(null);
      setIsEditingPhoto(false);
    },100);
  };

  // print
  const [showPreview,setShowPreview] = useState(false);
  const [pdfUrl,setPdfUrl] = useState(null);

  const handleShowPreview = () =>
  {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    const url = AkunPrint(filtered);
    setPdfUrl(url);
    setShowPreview(true);
  }

<<<<<<< HEAD
  const handleClosePerview = () => {
=======
  const handleClosePerview = () =>
  {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
<<<<<<< HEAD
                filterOptions={uniqueList.map(jabatan => ({ value: jabatan, label: jabatan }))}
                selectedFilter={filter}
                text='Semua'
=======
                filterOptions={uniqueList.map(jabatan => ({ value: jabatan,label: jabatan }))}
                selectedFilter={filter}
                text='Jabatan'
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
<<<<<<< HEAD
                filtered.map((item, index) => (
=======
                filtered.map((item,index) => (
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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

<<<<<<< HEAD
      <Modal show={showAdd} onHide={handleCloseAdd} style={{ borderRadius: '5px' }} size='xl' centered>
=======
      <Modal show={showAdd} onHide={handleCloseAdd} style={{borderRadius: '5px' }} size='xl' centered>
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
