import React,{ useState,useEffect } from 'react';
import { Container,Table,Form,Row,Col,Button,Modal } from 'react-bootstrap';
import { PresensiDetailPrint } from './PresensiDetailPrint.js';
import axios from 'axios';
import
{
    SansSearch,
    SansSpinnerOnTable,
    SansButtonEdit,
    SansButtonDelete,
    SansSortableTable,
    SansDeleteModal,
    SansNothingOnTable,
    SansNotify,
    SansDivisiDropdown,
    SansFormatDate,
    SansFormatTime,
    SansButtonPrint,
    SansButtonSee,
} from '../ComponentCustom/SansComps';
import PresensiEdit from './PresensiEdit';

function PresensiTable()
{

    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    const [loading,setLoading] = useState(false);
    const [tableData,setTableData] = useState([]);
    const { sortedData,requestSort,getSortIcon } = SansSortableTable({
        data: tableData,
        defaultSort: 'tanggal_mulai',
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
            const response = await axios.get('http://localhost:8000/api/presensi',{
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                },
            });
            console.log('Data fetched: ',response.data);

            const formattedData = response.data.data.map(item =>
            {
                return {
                    ...item,
                    formatted_tgl: SansFormatDate(item.tgl),
                    formatted_tgl_mulai: SansFormatDate(item.tgl_mulai),
                    formatted_tgl_selesai: SansFormatDate(item.tgl_selesai),
                    formatted_jam_mulai: SansFormatTime(item.jam_mulai),
                    formatted_jam_selesai: SansFormatTime(item.jam_selesai),
                };
            });

            setTableData(formattedData);
            console.log(formattedData);
        } catch (error)
        {
            console.error('Error fetching data:',error);
            console.log(error.response);
        } finally
        {
            setLoading(false);
        }
    };

    // Filter, sort, search
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
                item.divisi.toLowerCase().includes(lowerSearch) ||
                item.kegiatan.toLowerCase().includes(lowerSearch) ||
                item.tgl.toString().includes(searchTerm) ||
                item.tgl_mulai.toString().includes(searchTerm) ||
                item.tgl_selesai.toString().includes(searchTerm) ||
                item.hari.toLowerCase().includes(lowerSearch) ||
                item.jam_mulai.toString().includes(searchTerm) ||
                item.jam_selesai.toString().includes(searchTerm) ||
                item.tempat.toLowerCase().includes(lowerSearch) ||
                item.iuran.toString().includes(searchTerm)
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

    // Edit
    const [isEditing,setIsEditing] = useState(false);
    const [editingRowId,setEditingRowId] = useState(null);

    const [presensiData,setPresensiData] = useState(null);
    const [jadwalData,setJadwalData] = useState(null);
    const [danaKeluarData,setDanaKeluarData] = useState(null);
    const [danaMasukData,setDanaMasukData] = useState(null);

    // State form data
    const [formData,setFormData] = useState({
        divisi: currentDivisi || "",
        id: "",
        tgl: null,
        jadwal_id: "",
        dana_keluar_id: "",
        dana_masuk_id: "",
    });

    // const handleEditClick = async (item) =>
    // {
    //     setEditingRowId(item.id);

    //     setFormData({
    //         divisi: currentDivisi || "",
    //         id: item.id,
    //         tgl: item.tgl,
    //         jadwal_id: item.jadwal_id,
    //         dana_keluar_id: item.dana_keluar_id,
    //         dana_masuk_id: item.dana_masuk_id,
    //     })

        // try
        // {
        //     // Fetch data dari endpoint presensi, jadwal, dana-keluar, dan dana-masuk secara paralel
        //     const [presensiResponse,jadwalResponse,danaKeluarResponse,danaMasukResponse] = await Promise.all([
        //         axios.get(`http://localhost:8000/api/presensi-atlet`,{
        //             headers: {
        //                 'Authorization': `Bearer ${currentToken}`,
        //             },
        //             params: {
        //                 presensi_id: item.id
        //             }
        //         }),
        //         axios.get(`http://localhost:8000/api/jadwal/${item.jadwal_id}`,{
        //             headers: {
        //                 'Authorization': `Bearer ${currentToken}`,
        //             },
        //         }),
        //         axios.get(`http://localhost:8000/api/dana-keluar/${item.dana_keluar_id}`,{
        //             headers: {
        //                 'Authorization': `Bearer ${currentToken}`,
        //             }
        //         }),
        //         axios.get(`http://localhost:8000/api/dana-masuk/${item.dana_masuk_id}`,{
        //             headers: {
        //                 'Authorization': `Bearer ${currentToken}`,
        //             }
        //         })
        //     ]);

        //     // Simpan data ke dalam state
        //     setPresensiData(presensiResponse.data.data);
        //     setJadwalData(jadwalResponse.data.data);
        //     setDanaKeluarData(danaKeluarResponse.data.data);
        //     setDanaMasukData(danaMasukResponse.data.data);

        //     // Update formData dengan data yang baru di-fetch
        //     setFormData({
        //         divisi: currentDivisi || "",
        //         tgl: item.tgl,
        //         jadwal_id: item.jadwal_id,
        //         dana_keluar_id: item.dana_keluar_id,
        //         dana_masuk_id: item.dana_masuk_id,

        //         atlet: presensiResponse.data.data,
        //         jadwal: jadwalResponse.data.data,
        //         danaKeluar: danaKeluarResponse.data.data,
        //         danaMasuk: danaMasukResponse.data.data,
        //     });

        //     console.log(danaKeluarData);

        //     setIsEditing(true);
        // } catch (error)
        // {
        //     console.error('Error fetching data:',error);
        // }
    // };


    const handleCancelClick = () =>
    {
        setIsEditing(false);
        setEditingRowId(null);
        setFormData({
            divisi: currentDivisi || "",
            id: "",
            tgl: null,
            jadwal_id: "",
            dana_keluar_id: "",
            dana_masuk_id: "",
        });
    };

    // Delete
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
                await axios.delete(`http://localhost:8000/api/presensi/${deleteId}`,{
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                    },
                });

                handleCloseModalDelete();
                setSuccessMessage("Data akun berhasil dihapus");
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

    // Notify
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
        },100);
    };


    // print
    const [showPreview,setShowPreview] = useState(false);
    const [pdfUrl,setPdfUrl] = useState(null);
    const [presensiIdPrint,setPresensiIdPrint] = useState("");

    const handleShowPreview = async (item) =>
    {
        setPresensiIdPrint(item.id);

        // if (!filter || filter === '' || filter === '-')
        // {
        //     setErrorMessage("Pilih divisi terlebih dahulu");
        //     setStatus('error');
        //     setShowNotify(true);
        //     return;
        // }
        const url = await PresensiDetailPrint(item.id);
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
                    <h2 style={{ marginBottom: '15px' }}>Daftar Presensi</h2>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} md={2}>
                            <SansDivisiDropdown
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                required
                                disabled={loading}
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
                                <th onClick={() => requestSort('tanggal_mulai')}>
                                    Tanggal {getSortIcon('tanggal_mulai')}
                                </th>
                                <th onClick={() => requestSort('hari')}>
                                    Hari {getSortIcon('hari')}
                                </th>
                                <th onClick={() => requestSort('kegiatan')}>
                                    Kegiatan {getSortIcon('kegiatan')}
                                </th>
                                <th onClick={() => requestSort('jam_mulai')}>
                                    Jam {getSortIcon('jam_mulai')}
                                </th>
                                <th onClick={() => requestSort('tempat')}>
                                    Tempat {getSortIcon('tempat')}
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
                                        <td>
                                            {item.formatted_tgl}
                                            {/* {item.formatted_tgl_selesai ? ` - ${item.formatted_tgl_selesai}` : ''} */}
                                        </td>
                                        <td>{item.hari}</td>
                                        <td>{item.kegiatan}</td>
                                        <td>
                                            {item.formatted_jam_mulai}
                                            {item.formatted_jam_selesai ? ` - ${item.formatted_jam_selesai}` : ''}
                                        </td>
                                        <td>{item.tempat}</td>
                                        {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                                            <td className='text-center'>
                                                {/* <SansButtonEdit
                                                    onClick={() => handleEditClick(item)}
                                                /> */}
                                                <SansButtonSee
                                                    onClick={() => handleShowPreview(item)}
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

            {/* <PresensiEdit
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                setLoading={setLoading}
                editingRowId={editingRowId}
                isEditing={isEditing}

                handleCancelClick={handleCancelClick}

                setStatus={setStatus}
                setShowNotify={setShowNotify}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
                fetchTableData={fetchTableData}
            /> */}

            <SansDeleteModal
                show={showDeleteModal}
                onHide={handleCloseModalDelete}
                onDelete={handleDelete}
                bodyText="Hapus Data Presensi ini?"
                error={deleteFailed}
                loading={loading}
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

export default PresensiTable;
