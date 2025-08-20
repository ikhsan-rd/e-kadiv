import '../../css/inputdatabase.scss';
import React,{ useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container,Form,Row,Col,Table,Button,Modal,ModalBody, Spinner } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';
import { AtletPrint } from './AtletPrint';
import axios from 'axios';
import
{
    SansSpinnerOnTable,
    SansNothingOnTable,
    SansLoadOrNotImage,
    SansButtonEdit,
    SansButtonDelete,
    SansDeleteModal,
    SansSortableTable,
    SansFormatDate,
    SansFilter,
    SansSearch,
    SansDivisiDropdown,
    SansNotify,
    SansButtonAddData,
    SansButtonPrintAll,
} from '../ComponentCustom/SansComps';
import AtletEdit from './AtletEdit';
import AtletInput from './AtletInput';

function AtletTable()
{
    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentDivisi = sessionStorage.getItem('divisi');
    const currentToken = sessionStorage.getItem('token');


    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

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
        setLoading(true);

        try
        {
            const response = await axios.get('http://localhost:8000/api/atlet',{
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                },
            });
            console.log('Data fetched: ',response.data);

            const formattedData = response.data.data.map(item => ({
                ...item,
                formatted_tgl_lahir: SansFormatDate(item.tgl_lahir),

            }));

            setTableData(formattedData);
            console.log('format',formattedData);
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

    const formatted_status_anggota = (status_anggota) =>
    {
        if (status_anggota === 'Y')
        {
            return 'Yes';
        } else if (status_anggota === 'N')
        {
            return 'Non';
        } else
        {
            return '';
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

    //Filter, Sort, Search
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
                item.tempat_lahir.toLowerCase().includes(lowerSearch) ||
                item.tgl_lahir.toString().includes(searchTerm) ||
                item.jk.toLowerCase().includes(lowerSearch) ||
                item.jurusan.toLowerCase().includes(lowerSearch) ||
                calculateSemester(item.angkatan).toString().includes(searchTerm) ||
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
        npm: "",
        jk: "",
        tempat_lahir: "",
        tgl_lahir: "",
        angkatan: "",
        jurusan: "",
        wa: "",
        divisi: "",
        kategori: "",
        status_mhs: "",
        status_anggota: "",
        foto: null,
        ktm_sia: null,
    });

    const [selectedFile,setSelectedFile] = useState(null);
    const handleEditClick = (item) =>
    {
        setEditingRowId(item.id);
        setFormData({
            nama: item.nama,
            npm: item.npm,
            jk: item.jk,
            tempat_lahir: item.tempat_lahir,
            tgl_lahir: item.tgl_lahir,
            angkatan: item.angkatan,
            jurusan: item.jurusan,
            wa: item.wa,
            divisi: item.divisi,
            kategori: item.kategori,
            status_mhs: item.status_mhs,
            status_anggota: item.status_anggota,
            foto: item.foto,
            ktm_sia: item.ktm_sia,
        });
        setSelectedFile(item.ktm_sia);
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
            npm: "",
            jk: "",
            tempat_lahir: "",
            tgl_lahir: "",
            angkatan: "",
            jurusan: "",
            wa: "",
            divisi: "",
            kategori: "",
            status_mhs: "",
            status_anggota: "",
            ktm_sia: null,
            foto: null,
        });
        setSelectedFile(null);
        setIsEditingPhoto(false);
        setIsEditingFile(false);
        setDoneFile(false);
    };

    //Delete
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
                await axios.delete(`http://localhost:8000/api/atlet/${deleteId}`,{
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
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
        if (!filter || filter === '' || filter === '-')
        {
            setErrorMessage("Pilih divisi terlebih dahulu");
            setStatus('error');
            setShowNotify(true);
            return;
        }

        const processedData = filtered.map(item => ({
            ...item,
            semester: calculateSemester(item.angkatan)
        }));

        const url = AtletPrint(processedData,filter,calculateSemester);
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
                    <h2 style={{ marginBottom: '15px' }}>Daftar Atlet</h2>
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
                                        <td>{`${item.tempat_lahir} - ${item.formatted_tgl_lahir}`}</td>
                                        <td className='text-center'>{item.jk}</td>
                                        <td>{item.jurusan}</td>
                                        <td className='text-center'>{calculateSemester(item.angkatan)}</td>
                                        <td className='text-center'>{formatted_status_anggota(item.status_anggota)}</td>
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
                </Form>
            </Container>

            <Modal show={showAdd} onHide={handleCloseAdd} style={{ borderRadius: '5px' }} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Atlet</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    <AtletInput />
                </ModalBody>
            </Modal>

            <Modal show={isEditing} style={{ borderRadius: '5px' }} onHide={handleCancelClick} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Data Atlet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AtletEdit
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
                bodyText="Hapus data atlet ini?"
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

export default AtletTable;