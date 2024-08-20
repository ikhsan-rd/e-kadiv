import '../../css/inputdatabase.scss';
import React,{ useState,useEffect } from 'react';
import { Container,Form,Button,Row,Col,Table,Spinner } from 'react-bootstrap';
import { PencilSquare,Trash,ShieldLock,PersonCircle } from 'react-bootstrap-icons';
import '../../css/button.scss'
import axios from 'axios';

function TeamTable()
{
    const currentJabatan = localStorage.getItem('jabatan');
    const currentNomor = localStorage.getItem('nomor_anggota');

    const [atletData,setAtletData] = useState([]);
    const [loading,setLoading] = useState(false);
    useEffect(() =>
    {
        fetchAtletData();
    },[]);

    const fetchAtletData = async () =>
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
            setAtletData(response.data.data);
            const itemFoto = (response.data.item.foto);
        } catch (error)
        {
            console.error('Error fetching data:',error);
            console.log(error.response);
        } finally
        {
            setLoading(false);
        }
    };

    const [isImageLoaded,setIsImageLoaded] = useState(true);

    const handleImageError = ({ itemFoto }) =>
    {
        setIsImageLoaded(false);
    };

    const [filterDivisi,setFilterDivisi] = useState('');
    const [searchTerm,setSearchTerm] = useState('');
    const [filteredAkuns,setFilteredAtlets] = useState([]);
    useEffect(() =>
    {
        const filtered = atletData
            .filter(item => (filterDivisi ? item.divisi === filterDivisi : true))

        setFilteredAtlets(filtered);
    },[filterDivisi,atletData]);


    const handleClearFilter = () =>
    {
        setFilterDivisi('');
        // setSearchTerm('');
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
                    <Form.Group as={Col} md={3} controlId="searchTerm">
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                        // onChange={e => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Button
                            onClick={handleClearFilter}
                            disabled={!filterDivisi && !searchTerm}
                        >
                            Clear All
                        </Button>
                    </Form.Group>
                </Row>
                <Table striped bordered hover>
                    <thead>
                        <tr className='text-center'>
                            <th>No</th>
                            <th>Foto</th>
                            <th>Nama</th>
                            <th>TTL</th>
                            <th>L/P</th>
                            <th>Jurusan</th>
                            <th>Semester</th>
                            <th>Anggota</th>
                            {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                                <th>Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    <Spinner animation="border" />
                                </td>
                            </tr>
                        ) : filteredAkuns.length > 0 ? (
                            filteredAkuns.map((item,index) => (
                                <tr key={item.id}>
                                    <td className='text-center'>{index + 1}</td>
                                    <td className='text-center'>
                                        {
                                            isImageLoaded ? (
                                                item.foto ? (
                                                    <img
                                                        src={item.foto}
                                                        alt="User"
                                                        style={{ width: '30px',height: '30px',borderRadius: '50%' }}
                                                        onError={handleImageError}
                                                    />
                                                ) : (
                                                    <PersonCircle style={{ width: '30px',height: '30px',color: '#dee2e6' }} />
                                                )
                                            ) : (
                                                <PersonCircle style={{ width: '30px',height: '30px',color: '#dee2e6' }} />
                                            )
                                        }
                                    </td>
                                    <td>{item.nama}</td>
                                    <td>{`${item.tempat_lahir} - ${item.tgl_lahir}`}</td>
                                    <td>{item.jk}</td>
                                    <td>{item.jurusan}</td>
                                    <td>{item.angkatan}</td>
                                    <td>{item.status_anggota}</td>
                                    {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                                        <td className='text-center'>
                                            <Button
                                                className='button-edit'
                                                variant='success'
                                            // onClick={() => handleEditClick(item)}
                                            >
                                                <PencilSquare className='edit-custom' />
                                            </Button>
                                            {(item.nomor_anggota !== currentNomor) && (
                                                <Button
                                                    className='button-delete-1'
                                                    variant='danger'
                                                // onClick={() => handleDeleteConfirmation(item.id)}
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
                                <td colSpan="9" className="text-center">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Form>
        </Container >
    );
}

export default TeamTable;