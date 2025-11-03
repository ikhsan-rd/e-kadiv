import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Row, Col, Button, Modal, ModalBody } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';
import axios from 'axios';
import { JadwalPrint } from './JadwalPrint';
import JadwalEdit from './JadwalEdit';
import {
    SansSearch,
    SansSpinnerOnTable,
    SansButtonEdit,
    SansButtonDelete,
    SansSortableTable,
    SansDeleteModal,
    SansNothingOnTable,
    SansFormatDate,
    SansFormatTime,
    SansDivisiDropdown,
    SansNotify,
    SansButtonAddData,
    SansButtonPrintAll,
} from '../ComponentCustom/SansComps';
import JadwalInput from './JadwalInput';

function JadwalTable() {
    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    const [loading, setLoading] = useState(false);

    //Fetch
    const [tableData, setTableData] = useState([]);
    const { sortedData, requestSort, getSortIcon } = SansSortableTable({
        data: tableData,
        defaultSort: 'formatted_tgl_mulai',
        type: 'descending',
    });

    useEffect(() => {
        fetchTableData();
    }, []);

    const fetchTableData = async () => {
        setLoading(true);

        try {
            const response = await axios.get('http://localhost:8000/api/jadwal', {
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                },
            });
            console.log('Data fetched: ', response.data);

            const formattedData = response.data.data.map(item => {
                return {
                    ...item,
                    formatted_tgl_mulai: SansFormatDate(item.tgl_mulai),
                    formatted_tgl_selesai: SansFormatDate(item.tgl_selesai),
                    formatted_jam_mulai: SansFormatTime(item.jam_mulai),
                    formatted_jam_selesai: SansFormatTime(item.jam_selesai),
                };
            });

            setTableData(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response) {
                console.log(error.response);
            } else {
                console.error('Error response not available');
            }
        } finally {
            setLoading(false);
        }
    };

    //filter, sort, search
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('N');
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        let filteredData = sortedData;

        if (currentDivisi === '-') {
            if (filter !== '') {
                filteredData = filteredData.filter(item => item.divisi === filter);
            }
        } else {
            filteredData = filteredData.filter(item => item.divisi === currentDivisi);
        }

        if (statusFilter) {
            filteredData = filteredData.filter(item => item.status === statusFilter);
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.divisi.toLowerCase().includes(lowerSearch) ||
                item.kegiatan.toLowerCase().includes(lowerSearch) ||
                item.formatted_tgl_mulai.toString().includes(searchTerm) ||
                item.formatted_tgl_selesai.toString().includes(searchTerm) ||
                item.hari.toLowerCase().includes(lowerSearch) ||
                item.formatted_jam_mulai.toString().includes(searchTerm) ||
                item.formatted_jam_selesai.toString().includes(searchTerm) ||
                item.tempat.toLowerCase().includes(lowerSearch) ||
                item.iuran.toString().includes(searchTerm)
            );
        }

        setFiltered(filteredData);
    }, [filter, statusFilter, searchTerm, sortedData, currentDivisi]);

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
    const [formData, setFormData] = useState({
        kegiatan: "",
        divisi: "",
        tgl_mulai: null,
        tgl_selesai: null,
        hari: "",
        jam_mulai: null,
        jam_selesai: null,
        tempat: "",
        iuran: null,
        status: "",
    });

    const [type, setType] = useState(null);
    const [isAllDay, setIsAllDay] = useState(false);
    const [isIuran, setIsIuran] = useState(false);
    const [isSelesai, setIsSelesai] = useState(false);

    const handleEditClick = (item) => {
        setEditingRowId(item.id);
        setFormData({
            divisi: item.divisi,
            kegiatan: item.kegiatan,
            tgl_mulai: item.tgl_mulai,
            tgl_selesai: item.tgl_selesai,
            hari: item.hari,
            jam_mulai: item.jam_mulai,
            jam_selesai: item.jam_selesai,
            tempat: item.tempat,
            iuran: item.iuran,
            status: item.status,
        });

        if (item.hari) {
            setType('Repeat');
        } else if (!item.tgl_selesai) {
            setType('OneSession');
        } else if (item.tgl_mulai && item.tgl_selesai) {
            setType('LongSession');
        }

        if (item.iuran) {
            setIsIuran(true)
        } else {
            setIsIuran(false)
        }

        if (!item.jam_mulai && !item.jam_selesai) {
            setIsAllDay(true);
        } else {
            setIsAllDay(false);
        }

        if (item.status === 'Y') {
            setIsSelesai(true)
        } else {
            setIsSelesai(false)
        }

        setIsEditing(true);
    };


    const handleCancelClick = () => {
        setIsEditing(false);
        setEditingRowId(null);
        setFormData({
            divisi: "",
            kegiatan: "",
            tgl_mulai: null,
            tgl_selesai: null,
            hari: "",
            jam_mulai: null,
            jam_selesai: null,
            tempat: "",
            iuran: null,
            status: "",
        });
    };

    //delete
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteFailed, setDeleteFailed] = useState(false);

    const handleDelete = async () => {
        if (deleteId) {
            setLoading(true);
            setDeleteFailed(false);
            try {
                await axios.delete(`http://localhost:8000/api/jadwal/${deleteId}`, {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                    },
                });

                handleCloseModalDelete();
                setSuccessMessage("Data berhasil dihapus");
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
        setTimeout(() => {
            setStatus(null);
        }, 100);
    };

    // print
    const [showPreview, setShowPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleShowPreview = () => {
        if (currentDivisi === '-' && (!filter || filter === '' || filter === '-')) {
            setErrorMessage("Pilih divisi terlebih dahulu");
            setStatus('error');
            setShowNotify(true);
            return;
        }
        const url = JadwalPrint(filtered, filter);
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
                    <h2 style={{ marginBottom: '15px' }}>Daftar Jadwal</h2>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} md={2}>
                            <SansDivisiDropdown
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                required
                                disabled={loading || currentDivisi !== '-'}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={2}>
                            <Form.Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">Semua Status</option>
                                <option value="Y">Selesai</option>
                                <option value="N">Berjalan</option>
                            </Form.Select>
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
                                <th onClick={() => requestSort('formatted_tgl_mulai')}>
                                    Tanggal {getSortIcon('formatted_tgl_mulai')}
                                </th>
                                <th onClick={() => requestSort('hari')}>
                                    Hari {getSortIcon('hari')}
                                </th>
                                <th onClick={() => requestSort('kegiatan')}>
                                    Kegiatan {getSortIcon('kegiatan')}
                                </th>
                                <th onClick={() => requestSort('formatted_jam_mulai')}>
                                    Jam {getSortIcon('formatted_jam_mulai')}
                                </th>
                                <th onClick={() => requestSort('tempat')}>
                                    Tempat {getSortIcon('tempat')}
                                </th>
                                <th onClick={() => requestSort('iuran')}>
                                    Iuran {getSortIcon('iuran')}
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
                                filtered.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-center'>
                                            {item.formatted_tgl_mulai}
                                            {item.formatted_tgl_selesai ? ` - ${item.formatted_tgl_selesai}` : ''}
                                        </td>
                                        <td className='text-center'>{item.hari ? item.hari : '-'}</td>
                                        <td className='text-center'>{item.kegiatan}</td>
                                        <td className='text-center'>
                                            {`${item.formatted_jam_mulai} - ${item.formatted_jam_selesai}`}
                                        </td>
                                        <td>{item.tempat}</td>
                                        <td>Rp{item.iuran ? item.iuran : '0'}</td>
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
                    <Modal.Title>Tambah Jadwal</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    <JadwalInput />
                </ModalBody>
            </Modal>

            <JadwalEdit
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                setLoading={setLoading}

                editingRowId={editingRowId}
                isEditing={isEditing}

                type={type}
                setType={setType}
                isAllDay={isAllDay}
                setIsAllDay={setIsAllDay}
                isIuran={isIuran}
                setIsIuran={setIsIuran}
                isSelesai={isSelesai}
                setIsSelesai={setIsSelesai}

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
                bodyText="Hapus jadwal ini?"
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

export default JadwalTable;
