import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';
import { SaranaPrint } from './SaranaPrint';
import axios from 'axios';
import {
SansSearch,
SansSpinnerOnTable,
SansButtonEdit,
SansButtonDelete,
SansSortableTable,
SansDeleteModal,
SansNothingOnTable,
SansNotify,
SansFormatDateFromStamp,
SansDivisiDropdown
} from '../ComponentCustom/SansComps';
import SaranaEdit from './SaranaEdit';

function SaranaTable() {
    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    const [loading, setLoading] = useState(false);

    //Fetch
    const [tableData, setTableData] = useState([]);
    const { sortedData, requestSort, getSortIcon } = SansSortableTable({
        data: tableData,
        defaultSort: 'formatted_updated_at',
        type: 'descending',
    });

    useEffect(() => {
        fetchTableData();
    }, []);

    const fetchTableData = async () => {
        setLoading(true);

        try {
            const response = await axios.get('http://localhost:8000/api/sarana', {
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                },
            });
            console.log('Data fetched: ', response.data);

            const formattedData = response.data.data.map(item => ({
                ...item,
                formatted_updated_at: SansFormatDateFromStamp(item.updated_at),
            }));
            setTableData(formattedData);
            console.log('format', formattedData);
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

    //Filter, Sort, Search
    const [filter, setFilter] = useState('');
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

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.divisi.toLowerCase().includes(lowerSearch) ||
                item.formatted_updated_at.toLowerCase().includes(lowerSearch) ||
                item.nama.toLowerCase().includes(lowerSearch) ||
                item.jumlah.toString().includes(searchTerm) ||
                item.satuan.toLowerCase().includes(lowerSearch) ||
                item.layak_pakai.toString().includes(searchTerm) ||
                item.tdk_layak_pakai.toString().includes(searchTerm) ||
                item.keterangan.toLowerCase().includes(lowerSearch)
            );
        }

        setFiltered(filteredData);
    }, [filter, searchTerm, sortedData, currentDivisi]);

    const handleClearAll = () => {
        setFilter('');
        setSearchTerm('');
        requestSort('');
    };

    // Edit
    const [isEditing, setIsEditing] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [formData, setFormData] = useState({
        divisi: "",
        nama: "",
        jumlah: 0,
        satuan: "",
        layak_pakai: 0,
        tdk_layak_pakai: 0,
        keterangan: "",
    });

    const handleEditClick = async (item) => {
        setEditingRowId(item.id);
        setFormData({
            divisi: item.divisi,
            nama: item.nama,
            jumlah: item.jumlah,
            satuan: item.satuan,
            layak_pakai: item.layak_pakai,
            tdk_layak_pakai: item.tdk_layak_pakai,
            keterangan: item.keterangan,
        });
        setIsEditing(true);
    };


    const handleCancelClick = () => {
        setIsEditing(false);
        setEditingRowId(null);
        setFormData({
            divisi: "",
            nama: "",
            jumlah: 0,
            satuan: "",
            layak_pakai: 0,
            tdk_layak_pakai: 0,
            keterangan: "",
        });
    };

    //Delete
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteFailed, setDeleteFailed] = useState(false);

    const handleDelete = async () => {
        if (deleteId) {
            setLoading(true);
            setDeleteFailed(false);
            try {
                await axios.delete(`http://localhost:8000/api/sarana/${deleteId}`, {
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
        const url = SaranaPrint(filtered, filter);
        setPdfUrl(url);
        setShowPreview(true);
    };

    const handleClosePerview = () => {
        setShowPreview(false);
        setPdfUrl(null);
    }


    return (
        <>
            <Container>
                <Form style={{ marginTop: '15px' }}>
                    <h2 style={{ marginBottom: '15px' }}>Daftar Sarana dan Prasarana</h2>
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
                            <Button onClick={handleShowPreview}>
                                Print
                                <Download style={{ marginLeft: '8px' }} />
                            </Button>
                        </Form.Group>
                    </Row>
                    <Table striped bordered hover>
                        <thead>
                            <tr className='text-center'>
                                <th>No</th>
                                <th onClick={() => requestSort('formatted_updated_at')}>
                                    Diperbaharui {getSortIcon('formatted_updated_at')}
                                </th>
                                <th onClick={() => requestSort('nama')}>
                                    Nama {getSortIcon('nama')}
                                </th>
                                <th onClick={() => requestSort('jumlah')}>
                                    Jumlah {getSortIcon('jumlah')}
                                </th>
                                <th onClick={() => requestSort('satuan')}>
                                    Satuan {getSortIcon('satuan')}
                                </th>
                                <th onClick={() => requestSort('layak_pakai')}>
                                    Layak {getSortIcon('layak_pakai')}
                                </th>
                                <th onClick={() => requestSort('tdk_layak_pakai')}>
                                    Tidak Layak {getSortIcon('tdk_layak_pakai')}
                                </th>
                                <th onClick={() => requestSort('keterangan')}>
                                    Keterangan {getSortIcon('keterangan')}
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
                                filtered.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-center'>{item.formatted_updated_at}</td>
                                        <td>{item.nama}</td>
                                        <td className='text-center'>{item.jumlah}</td>
                                        <td>{item.satuan}</td>
                                        <td className='text-center'>{item.layak_pakai}</td>
                                        <td className='text-center'>{item.tdk_layak_pakai}</td>
                                        <td>{item.keterangan}</td>
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

            <SaranaEdit
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
                bodyText="Hapus data ini?"
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

export default SaranaTable;