import '../../css/inputdatabase.scss';
import React,{ useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container,Form,Row,Col,Table,Button } from 'react-bootstrap';
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

function AtletTable()
{
    const currentJabatan = localStorage.getItem('jabatan');

    const [tableData,setTableData] = useState([]);
    const [divisiList,setDivisiList] = useState([]);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

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
            const response = await axios.get('http://localhost:8000/api/atlet',{
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

    const calculateSemester = (angkatan) =>
    {
        const currentYear = new Date().getFullYear();
        const yearsElapsed = currentYear - angkatan;
        const currentSemester = yearsElapsed * 2 + 1;

        const isFirstHalfOfYear = new Date().getMonth() < 6;
        return isFirstHalfOfYear ? currentSemester : currentSemester + 1;
    };

    const { sortedData,requestSort,getSortIcon } = SansSortableTable(tableData);

    const [filter,setFilter] = useState('');
    const [searchTerm,setSearchTerm] = useState('');
    const [filtered,setFiltered] = useState([]);

    useEffect(() =>
    {
        const filtered = sortedData
            .filter(item =>
                (filter ? item.divisi === filter : true) &&
                (searchTerm ?
                    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.tempat_lahir.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.tgl_lahir.toString().includes(searchTerm) ||
                    item.jk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.jurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    calculateSemester(item.angkatan).toString().includes(searchTerm) ||
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

    const [deleteId,setDeleteId] = useState(null);
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const handleDelete = async () =>
    {
        if (deleteId)
        {
            handleCloseModalDelete();
            try
            {
                await axios.delete(`http://localhost:8000/api/atlet/${deleteId}`,{
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setTimeout(() =>
                {
                    navigate("/database/team/atlet/table");
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
                <h2 style={{ marginBottom: '15px' }}>Daftar Atlet</h2>
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
                            <th onClick={() => requestSort('tempat_lahir')}>
                                TTL {getSortIcon('tempat_lahir')}
                            </th>
                            <th onClick={() => requestSort('jk')}>
                                L/P {getSortIcon('jk')}
                            </th>
                            <th onClick={() => requestSort('jurusan')}>
                                Jurusan {getSortIcon('jurusan')}
                            </th>
                            <th onClick={() => requestSort('angkatan')}>
                                Semester {getSortIcon('angkatan')}
                            </th>
                            <th onClick={() => requestSort('status_anggota')}>
                                Anggota {getSortIcon('status_anggota')}
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
                                    <td>{`${item.tempat_lahir} - ${item.tgl_lahir}`}</td>
                                    <td className='text-center'>{item.jk}</td>
                                    <td>{item.jurusan}</td>
                                    <td className='text-center'>{calculateSemester(item.angkatan)}</td>
                                    <td className='text-center'>{item.status_anggota}</td>
                                    {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                                        <td className='text-center'>
                                            <SansButtonEdit
                                            //onClick={() => handleEditClick(item)}
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
                                <td colSpan="9" className="text-center">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Form>

            <SansDeleteModal
                show={showDeleteModal}
                onHide={handleCloseModalDelete}
                onDelete={handleDelete}
                loading={loading}
                bodyText="Hapus data atlet ini?"
            />
        </Container >
    );
}

export default AtletTable;