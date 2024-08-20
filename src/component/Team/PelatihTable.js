import '../../css/inputdatabase.scss';
import React,{ useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container,Button,Form,Row,Col,Table,Modal } from 'react-bootstrap';
import axios from 'axios';
import
{
    SansFilter,
    SansSearch,
    SansSpinnerOnTable,
    SansLoadOrNotImage,
    SansButtonEdit,
    SansButtonDelete,
    SansSortableTable,
    SansDeleteModal
} from '../ComponentCustom/SansComps';
import PelatihEdit from './PelatihEdit';

function PelatihTable()
{
    const currentJabatan = localStorage.getItem('jabatan');
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    //Fetch
    const [tableData,setTableData] = useState([]);
    const { sortedData,requestSort,getSortIcon } = SansSortableTable(tableData);

    useEffect(() =>
    {
        fetchTableData();
    },[]);

    const fetchTableData = async () =>
    {
        const token = localStorage.getItem('token');
        setLoading(true);

        try
        {
            const response = await axios.get('http://localhost:8000/api/pelatih',{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Data fetched: ',response.data);
            setTableData(response.data.data);

            const uniqueDivisi = [...new Set(response.data.data.map(item => item.divisi))];
            setDivisiList(uniqueDivisi);

        } catch (error)
        {
            console.error('Error fetching data:',error);
            console.log(error.response);
        } finally
        {
            setLoading(false);
        }
    };

    //filter, sort, search
    const [divisiList,setDivisiList] = useState([]);
    const [filter,setFilter] = useState('');
    const [searchTerm,setSearchTerm] = useState('');
    const [filtered,setFiltered] = useState([]);

    useEffect(() =>
    {
        const filtered = sortedData
            .filter(item => (filter ? item.divisi === filter : true) &&
                (searchTerm ?
                    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.divisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.jk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.wa.toString().includes(searchTerm) ||
                    item.status_anggota.toLowerCase().includes(searchTerm.toLowerCase())
                    : true)
            );

        setFiltered(filtered);
    },[filter,searchTerm,sortedData]);

    const handleClearAll = () =>
    {
        setFilter('');
        setSearchTerm('');
        requestSort('');
    };

    // Edit
    const [isEditing,setIsEditing] = useState(false);
    const [editingRowId,setEditingRowId] = useState(null);
    const [fotoFile,setFotoFile] = useState(null);
    const [formData,setFormData] = useState({
        nama: "",
        jk: "",
        tempat_lahir: "",
        tgl_lahir: "",
        wa: "",
        divisi: "",
        kategori: "",
        status_anggota: "",
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
            jk: item.jk,
            tempat_lahir: item.tempat_lahir,
            tgl_lahir: item.tgl_lahir,
            wa: item.wa,
            divisi: item.divisi,
            kategori: item.kategori,
            status_anggota: item.status_anggota,
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
            jk: "",
            tempat_lahir: "",
            tgl_lahir: "",
            wa: "",
            divisi: "",
            kategori: "",
            status_anggota: "",
            foto: null,
        });
    };

    //delete
    const [deleteId,setDeleteId] = useState(null);
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const handleDelete = async () =>
    {
        if (deleteId)
        {
            handleCloseModalDelete();
            try
            {
                await axios.delete(`http://localhost:8000/api/pelatih/${deleteId}`,{
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setTimeout(() =>
                {
                    navigate("/database/team/pelatih/table");
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
                <h2 style={{ marginBottom: '15px' }}>Daftar Pelatih</h2>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} md={2}>
                        <SansFilter
                            filterOptions={divisiList.map(divisi => ({ value: divisi,label: divisi }))}
                            selectedFilter={filter}
                            onFilterChange={setFilter}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} >
                        <SansSearch
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={2} controlId="filter">
                        <Button onClick={handleClearAll}>
                            Clear All
                        </Button>
                    </Form.Group>
                </Row>
                <Table striped bordered hover>
                    <thead>
                        <tr className='text-center'>
                            <th>No</th>
                            <th>Foto</th>
                            <th onClick={() => requestSort('nama')}>
                                Nama {getSortIcon('nama')}
                            </th>
                            <th onClick={() => requestSort('divisi')}>
                                Divisi {getSortIcon('divisi')}
                            </th>
                            <th className='text-center'
                                onClick={() => requestSort('jk')}>
                                L/P {getSortIcon('jk')}
                            </th>
                            <th className='text-center'
                                onClick={() => requestSort('status_anggota')}>
                                Anggota {getSortIcon('status_anggota')}
                            </th>
                            <th onClick={() => requestSort('wa')}>
                                Wa {getSortIcon('wa')}
                            </th>
                            {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                                <th>Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <SansSpinnerOnTable></SansSpinnerOnTable>
                        ) : filtered.length > 0 ? (
                            filtered.map((item,index) => (
                                <tr key={item.id}>
                                    <td className='text-center'>{index + 1}</td>
                                    <td className='text-center'>
                                        <SansLoadOrNotImage
                                            src={item.foto}
                                            width="30px"
                                            height="30px"
                                            shape="circle"
                                            onError={() => console.log('Gambar gagal dimuat')}
                                        />
                                    </td>
                                    <td>{item.nama}</td>
                                    <td>{item.divisi}</td>
                                    <td className='text-center'>{item.jk}</td>
                                    <td className='text-center'>{item.status_anggota}</td>
                                    <td>{item.wa}</td>
                                    {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                                        <td className='text-center'>
                                            <SansButtonEdit
                                                onClick={() => handleEditClick(item)}
                                            />
                                            <SansButtonDelete
                                                onClick={() => handleDeleteConfirmation(item.id)}
                                            />
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
                <PelatihEdit
                    formData={formData}
                    setFormData={setFormData}
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
                bodyText="Hapus data pelatih ini?"
            />
        </Container >
    );
}

export default PelatihTable;