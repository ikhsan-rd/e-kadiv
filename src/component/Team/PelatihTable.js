import '../../css/inputdatabase.scss';
import React,{ useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container,Button,Form,Row,Col,Table,Modal,ModalBody } from 'react-bootstrap';
import axios from 'axios';
import { Download } from 'react-bootstrap-icons';
import { PelatihPrint } from './PelatihPrint';
import
{
    SansFilter,
    SansSearch,
    SansSpinnerOnTable,
    SansLoadOrNotImage,
    SansButtonEdit,
    SansButtonDelete,
    SansSortableTable,
    SansDeleteModal,
    SansNothingOnTable,
    SansDivisiDropdown,
    SansNotify,
    SansButtonAddData,
    SansButtonPrintAll
} from '../ComponentCustom/SansComps';
import PelatihEdit from './PelatihEdit';
import PelatihInput from './PelatihInput';

function PelatihTable()
{

    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentDivisi = sessionStorage.getItem('divisi');
    const currentToken = sessionStorage.getItem('token');

    const [loading,setLoading] = useState(false);

    //Fetch
    const [tableData,setTableData] = useState([]);
    const { sortedData,requestSort,getSortIcon } = SansSortableTable({
        data: tableData,
        defaultSort: 'nama',
        type: 'ascending'
    });

    useEffect(() =>
    {
        fetchTableData();
    },[]);

    const fetchTableData = async () =>
    {
        const token = sessionStorage.getItem('token');
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

        } catch (error)
        {
            console.error('Error fetching data:',error);
            if (error.response)
            {
                console.log(error.response);
            } else
            {
                console.error('Error response not available');
            }
        } finally
        {
            setLoading(false);
        }
    };

    //filter, sort, search
    const [filter,setFilter] = useState('');
    const [searchTerm,setSearchTerm] = useState('');
    const [filtered,setFiltered] = useState([]);

    useEffect(() =>
    {
        let filteredData = sortedData;

        if (currentDivisi === '-')
        {
            if (filter !== '')
            {
                filteredData = filteredData.filter(item => item.divisi === filter);
            }
        } else
        {
            filteredData = filteredData.filter(item => item.divisi === currentDivisi);
        }

        if (searchTerm)
        {
            const lowerSearch = searchTerm.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.nama.toLowerCase().includes(lowerSearch) ||
                item.divisi.toLowerCase().includes(lowerSearch) ||
                item.jk.toLowerCase().includes(lowerSearch) ||
                item.wa.toString().includes(searchTerm) ||
                item.status_anggota.toLowerCase().includes(lowerSearch)
            );
        }

        setFiltered(filteredData);
    },[filter,searchTerm,sortedData,currentDivisi]);

    const handleClearAll = () =>
    {
        setFilter('');
        setSearchTerm('');
        requestSort('');
    };

    //Add
    const [showAdd,setShowAdd] = useState(false);

    const handleShowAdd = () =>
    {
        setShowAdd(true);
    }

    const handleCloseAdd = () =>
    {
        setShowAdd(false);
    }


    // Edit
    const [isEditing,setIsEditing] = useState(false);
    const [editingRowId,setEditingRowId] = useState(null);
    const [isEditingPhoto,setIsEditingPhoto] = useState(false);
    const [isEditingFile,setIsEditingFile] = useState(false);
    const [doneFile,setDoneFile] = useState(false);

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
        ktp: null,
    });

    const [selectedFile,setSelectedFile] = useState(null);
    const handleEditClick = async (item) =>
    {
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
            ktp: item.ktp,
        });
        setSelectedFile(item.ktp);
        setIsEditing(true);
        setIsEditingPhoto(false);
        setIsEditingFile(false);
        setDoneFile(false);
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
            ktp: null,
        });
        setSelectedFile(null);
        setIsEditingPhoto(false);
        setIsEditingFile(false);
        setDoneFile(false);
    };

    //delete
    const [deleteId,setDeleteId] = useState(null);
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [deleteFailed,setDeleteFailed] = useState(false);

    const handleDelete = async () =>
    {
        if (deleteId)
        {
            const token = sessionStorage.getItem('token');
            setLoading(true);
            setDeleteFailed(false);
            try
            {
                await axios.delete(`http://localhost:8000/api/pelatih/${deleteId}`,{
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });

                handleCloseModalDelete();
                setSuccessMessage("Data berhasil dihapus");
                setStatus('success');
                setShowNotify(true);
                fetchTableData();
            } catch (err)
            {
                setErrorMessage("Terjadi Kesalahan");
                setStatus('error');
                setShowNotify(true);
                setDeleteFailed(true);
                console.error("Delete failed:",err);
                if (err.response)
                {
                    console.error("Response data:",err.response.data);
                }
            } finally
            {
                setLoading(false);
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


    //notify
    const [status,setStatus] = useState(null);
    const [showNotify,setShowNotify] = useState(false);
    const [successMessage,setSuccessMessage] = useState("");
    const [errorMessage,setErrorMessage] = useState("");

    const handleCloseNotify = () =>
    {
        setShowNotify(false);
        setSuccessMessage("");
        setErrorMessage("");
        setTimeout(() =>
        {
            setStatus(null);
            setIsEditingPhoto(false);
            setIsEditingFile(false);
        },100);
    };

    // print
    const [showPreview,setShowPreview] = useState(false);
    const [pdfUrl,setPdfUrl] = useState(null);

    const handleShowPreview = () =>
    {
        const url = PelatihPrint(filtered,filter);
        setPdfUrl(url);
        setShowPreview(true);
    };

    const handleClosePerview = () =>
    {
        setShowPreview(false);
        setPdfUrl(null);
    }


    return (
        <>
            <Container>
                <Form style={{ marginTop: '15px' }}>
                    <h2 style={{ marginBottom: '15px' }}>Daftar Pelatih</h2>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} md={2}>
                            <SansDivisiDropdown
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                required
                                disabled={loading || currentDivisi !== '-'}
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
                        <Form.Group as={Col} className="d-flex justify-content-end">
                            <SansButtonPrintAll
                                onClick={handleShowPreview}
                            />
                            {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                                <SansButtonAddData
                                    onClick={handleShowAdd}
                                />
                            )}
                        </Form.Group>
                    </Row>
                    <div className='tableData'>
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
                                    <SansSpinnerOnTable />
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
                                    <SansNothingOnTable />
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Form>
            </Container >

            <Modal show={showAdd} onHide={handleCloseAdd} style={{borderRadius: '5px' }} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Pelatih</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    <PelatihInput />
                </ModalBody>
            </Modal>

            <Modal show={isEditing} style={{borderRadius: '5px' }} onHide={handleCancelClick} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Data Pelatih</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PelatihEdit
                        formData={formData}
                        setFormData={setFormData}
                        loading={loading}
                        setLoading={setLoading}
                        editingRowId={editingRowId}

                        isEditingPhoto={isEditingPhoto}
                        setIsEditingPhoto={setIsEditingPhoto}
                        isEditingFile={isEditingFile}
                        setIsEditingFile={setIsEditingFile}
                        doneFile={doneFile}
                        setDoneFile={setDoneFile}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}

                        handleCancelClick={handleCancelClick}

                        setStatus={setStatus}
                        setShowNotify={setShowNotify}
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                        fetchTableData={fetchTableData}
                    />
                </Modal.Body>
            </Modal>

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
                bodyText="Hapus data pelatih ini?"
                error={deleteFailed}
                loading={loading}
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

export default PelatihTable;