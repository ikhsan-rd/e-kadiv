import '../../css/inputdatabase.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, Row, Col, Table, Modal, ModalBody } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';
import { DanaMasukPrint } from './DanaMasukPrint';
import axios from 'axios';
import {
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
SansFormatMoney,
SansFormatDate,
SansButtonSee,
SansFileInput,
SansButtonPrintAll,
SansButtonAddData
} from '../ComponentCustom/SansComps';
import DanaMasukEdit from './DanaMasukEdit';
import DanaMasukInput from './DanaMasukInput';

function DanaMasukTable() {

    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentDivisi = sessionStorage.getItem('divisi');
    const currentToken = sessionStorage.getItem('token');

    const [loading, setLoading] = useState(false);

    // Fetch
    const [tableData, setTableData] = useState([]);
    const { sortedData, requestSort, getSortIcon } = SansSortableTable({
        data: tableData,
        defaultSort: 'tgl',
        type: 'ascending'
    });

    useEffect(() => {
        fetchTableData();
    }, []);

    const fetchTableData = async () => {
        setLoading(true);

        try {
            const response = await axios.get('http://localhost:8000/api/dana-masuk', {
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                },
            });
            console.log('Data fetched: ', response.data);

            const formattedData = response.data.data.map(item => {
                return {
                    ...item,
                    formatted_tgl: SansFormatDate(item.tgl),
                    formatted_total: SansFormatMoney(item.total),
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

    // Filter, sort, search
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
                item.sumber_dana.toLowerCase().includes(lowerSearch) ||
                item.tujuan.toLowerCase().includes(lowerSearch) ||
                item.tgl.includes(lowerSearch) ||
                item.biaya.toString().includes(searchTerm) ||
                item.total.toString().includes(searchTerm)
            );
        }

        setFiltered(filteredData);
    }, [filter, searchTerm, sortedData, currentDivisi]);

    const handleClearAll = () => {
        setFilter('');
        setSearchTerm('');
        requestSort('');
    };

    // Show Nota
    const [showModalNota, setShowModalNota] = useState(false);
    const [showNota, setShowNota] = useState('');

    const handleShowClick = async (item) => {
        setShowNota(item.nota_url);
        setShowModalNota(true);
    };

    // Edit
    const [isEditing, setIsEditing] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [formData, setFormData] = useState({
        divisi: currentDivisi || "",
        tgl: "",
        sumber_dana: "",
        total: "",
        nota: null,
    });

    const handleEditClick = async (item) => {
        setEditingRowId(item.id);
        setFormData({
            divisi: item.divisi,
            tgl: item.tgl,
            sumber_dana: item.sumber_dana,
            total: item.total,
            nota: item.nota_url,
        });
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditingRowId(null);
        setFormData({
            divisi: currentDivisi || "",
            tgl: "",
            sumber_dana: "",
            total: "",
            nota: null,
        });
    };

    // Delete
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        if (deleteId) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:8000/api/dana-masuk/${deleteId}`, {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                    },
                });

                setSuccessMessage("Data berhasil dihapus");
                setStatus('success');
                setShowNotify(true);
                fetchTableData();
            } catch (err) {
                setErrorMessage("Terjadi Kesalahan");
                setStatus('error');
                setShowNotify(true);
                console.error("Delete failed:", err);
                if (err.response) {
                    console.error("Response data:", err.response.data);
                }
            } finally {
                handleCloseModalDelete();
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

    //Add
    const [showAdd, setShowAdd] = useState(false);

    const handleShowAdd = () => {
        setShowAdd(true);
    }

    const handleCloseAdd = () => {
        setShowAdd(false);
    }

    // Notify
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
        const url = DanaMasukPrint(filtered, filter);
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
                    <h2 style={{ marginBottom: '15px' }}>Data Dana Masuk</h2>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} md={2}>
                            <SansDivisiDropdown
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
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
                                <th onClick={() => requestSort('tgl')}>
                                    Tanggal {getSortIcon('tgl')}
                                </th>
                                <th onClick={() => requestSort('sumber_dana')}>
                                    Sumber Dana {getSortIcon('sumber_dana')}
                                </th>
                                <th onClick={() => requestSort('total')}>
                                    Total {getSortIcon('total')}
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
                                        <td>{item.formatted_tgl}</td>
                                        <td>{item.sumber_dana}</td>
                                        <td>Rp{item.formatted_total}</td>
                                        {(currentJabatan === 'Admin' || currentJabatan === 'Kadiv') && (
                                            <td className='text-center'>
                                                <SansButtonSee
                                                    onClick={() => handleShowClick(item)}
                                                />
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

            <Modal show={showAdd} onHide={handleCloseAdd} style={{ borderRadius: '5px' }} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Dana Masuk</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    <DanaMasukInput />
                </ModalBody>
            </Modal>

            {/* Modal Edit */}
            <DanaMasukEdit
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

            {/* Modal Delete Confirmation */}
            <SansDeleteModal
                show={showDeleteModal}
                onHide={handleCloseModalDelete}
                onDelete={handleDelete}
                bodyText="Hapus Data ini?"
                loading={loading}
            />

            <SansFileInput
                show={showModalNota}
                title='Nota'
                onHide={() => setShowModalNota(false)}
                fileSrc={showNota}
                buttonDelete={false}
            />

            {/* Notification */}
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

export default DanaMasukTable;
