import React,{ useEffect,useState } from 'react';
import { Table,Container,Form,Row,Col,Button,Spinner,Modal } from 'react-bootstrap';
import { ShieldLock,Trash,PencilSquare } from 'react-bootstrap-icons';
import '../../css/button.scss';
import axios from 'axios';
import AkunEdit from './AkunEdit';
import { useNavigate } from 'react-router-dom';
import { SansLoadOrNotImage,SansDeleteModal } from '../ComponentCustom/SansComps';

function AkunTable()
{
  const currentJabatan = localStorage.getItem('jabatan');
  const currentNomor = localStorage.getItem('nomor_anggota');
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  //fetch
  const [akunData,setAkunData] = useState([]);

  useEffect(() =>
  {
    fetchAkunData();
  },[]);

  const fetchAkunData = async () =>
  {
    const token = localStorage.getItem('token');
    setLoading(true);

    try
    {
      const response = await axios.get('http://localhost:8000/api/user',{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Data fetched: ',response.data);
      setAkunData(response.data.data);
    } catch (error)
    {
      console.error('Error fetching data:',error);
      console.log(error.response);
    } finally
    {
      setLoading(false);
    }
  };

  const maskPassword = (password) =>
  {
    if (typeof password !== 'string')
    {
      console.error('Invalid password type:',typeof password);
      return '';
    }
    if (password.length > 4)
    {
      const numberOfStars = password.length - 2;
      return password.slice(0,1) + '*'.repeat(numberOfStars) + password.slice(-1);
    }
    return '*'.repeat(password.length);
  };

  //Filter, Search
  const [filterDivisi,setFilterDivisi] = useState('');
  const [filterJabatan,setFilterJabatan] = useState('');
  const [filteredAkuns,setFilteredAkuns] = useState([]);
  const [searchTerm,setSearchTerm] = useState('');

  useEffect(() =>
  {
    const filtered = akunData
      .filter(item => (filterDivisi ? item.divisi === filterDivisi : true))
      .filter(item => (filterJabatan ? item.jabatan === filterJabatan : true))
      .filter(item => (searchTerm ? item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.nomor_anggota.toLowerCase().includes(searchTerm.toLowerCase()) : true));

    setFilteredAkuns(filtered);
  },[filterDivisi,filterJabatan,searchTerm,akunData]);

  const handleClearFilter = () =>
  {
    setFilterDivisi('');
    setFilterJabatan('');
    setSearchTerm('');
  };

  // Edit
  const [isEditing,setIsEditing] = useState(false);
  const [editingRowId,setEditingRowId] = useState(null);
  const [fotoFile,setFotoFile] = useState(null);
  const [formData,setFormData] = useState({
    nama: "",
    nomor_anggota: "",
    fe_password: "",
    divisi: "",
    jabatan: "",
    foto: null,
  });

  const handleEditClick = async (item) =>
  {
    if (item.foto)
    {
      try
      {
        const response = await axios.get(item.foto,{
          responseType: 'blob'
        });

        // Ambil tipe MIME dari response
        const mimeType = response.data.type;

        // Dapatkan ekstensi file berdasarkan tipe MIME
        const extension = mimeType.split('/')[1]; // Ekstensi diambil dari bagian setelah slash, contoh: 'jpeg', 'png'

        // Buat nama file dengan ekstensi yang sesuai
        const fileName = `image.${extension}`;

        // Buat objek File
        const file = new File([response.data],fileName,{ type: mimeType });
        setFotoFile(file);
      } catch (error)
      {
        console.error('Error fetching the image file:',error);
      }
    } else
    {
      setFotoFile(null);
    }
    console.log(typeof (fotoFile));

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
    console.log(typeof (fotoFile));
  };


  const handleCancelClick = () =>
  {
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
  const [deleteId,setDeleteId] = useState(null);
  const [showDeleteModal,setShowDeleteModal] = useState(false);

  const handleDelete = async () =>
  {
    if (deleteId)
    {
      handleCloseModalDelete();
      try
      {
        await axios.delete(`http://localhost:8000/api/user/${deleteId}`,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setTimeout(() =>
        {
          navigate("/database/akun/table");
        },100);
      } catch (err)
      {
        console.error("Delete failed:",err);
      }
    }
  };

  const handleDeleteConfirmation = (id) =>
  {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleCloseModalDelete = () =>
  {
    setDeleteId(null);
    setShowDeleteModal(false);
  };


  return (
    <Container>
      <Form style={{ marginTop: '15px' }}>
        <h2 style={{ marginBottom: '15px' }}>Daftar Akun</h2>
        <Row style={{ marginBottom: '10px' }}>
          <Form.Group as={Col} md={2} controlId="filterDivisi">
            <Form.Select
              value={filterDivisi}
              onChange={e => setFilterDivisi(e.target.value)}
            >
              <option value="">Divisi</option>
              <option value="Sepak Bola">Sepak Bola</option>
              <option value="Bulu Tangkis">Bulu Tangkis</option>
              <option value="Bola Voli">Bola Voli</option>
              <option value="Futsal">Futsal</option>
              <option value="Beladiri">Bela Diri (Silat)</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={2} controlId="filterJabatan">
            <Form.Select
              value={filterJabatan}
              onChange={e => setFilterJabatan(e.target.value)}
            >
              <option value="">Jabatan</option>
              <option value="Puspendiv">Puspendiv</option>
              <option value="Kadiv">Kadiv</option>
              <option value="Pelatih">Pelatih</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="searchTerm">
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} md={2}>
            <Button
              onClick={handleClearFilter}
              disabled={!filterDivisi && !filterJabatan && !searchTerm}
            >
              Clear All
            </Button>
          </Form.Group>
        </Row>
        <Table striped bordered hover>
          <thead>
            <tr className='text-center'>
              <th>No</th>
              <th>Nama</th>
              <th>Username</th>
              <th>Password</th>
              <th>Divisi</th>
              <th>Jabatan</th>
              <th>Foto</th>
              <th>Last Sign In</th>
              {(currentJabatan === 'Admin' || currentJabatan === 'Puspendiv') && (
                <th>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : filteredAkuns.length > 0 ? (
              filteredAkuns.map((item,index) => (
                <tr key={item.id}>
                  <td className='text-center'>{index + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.nomor_anggota}</td>
                  <td>{maskPassword(item.fe_password)}</td>
                  <td>{item.divisi}</td>
                  <td>{item.jabatan}</td>
                  <td>
                    <SansLoadOrNotImage
                      src={item.foto}
                      width="50px"
                      height="50px"
                      shape="square"
                      onError={() => console.log('Gambar gagal dimuat')}
                    />
                  </td>
                  <td>{item.last_sign_in ? item.last_sign_in : 'N/A'}</td>
                  {(currentJabatan === 'Admin' || currentJabatan === 'Puspendiv') && (
                    <td className='text-center'>
                      <Button
                        className='button-edit'
                        variant='success'
                        onClick={() => handleEditClick(item)}
                      >
                        <PencilSquare className='edit-custom' />
                      </Button>
                      {(item.nomor_anggota !== currentNomor) && (
                        <Button
                          className='button-delete-1'
                          variant='danger'
                          onClick={() => handleDeleteConfirmation(item.id)}
                        >
                          <Trash className='trash-custom-1' />
                        </Button>
                      )}
                      {(item.nomor_anggota === currentNomor) && (
                        <Button
                          className='button-shield'
                          variant='warning'
                          style={{ cursor: 'not-allowed' }}
                        >
                          <ShieldLock className='shield-custom' />
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Form>

      <Modal show={isEditing} onHide={handleCancelClick}>
        <AkunEdit
          formData={formData}
          setFormData={setFormData}
          handleCancelClick={handleCancelClick}
          loading={loading}
          setLoading={setLoading}
          editingRowId={editingRowId}
        />
      </Modal>

      <SansDeleteModal
        show={showDeleteModal}
        onHide={handleCloseModalDelete}
        onDelete={handleDelete}
        loading={loading}
        bodyText="Hapus data akun ini?"
      />
    </Container>
  );
}

export default AkunTable;
