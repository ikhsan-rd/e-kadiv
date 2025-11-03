import '../../css/inputdatabase.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, Row, Col, Table, Modal } from 'react-bootstrap';
import { Download, PlusLg } from 'react-bootstrap-icons';
import { DanaKeluarPrint } from './DanaKeluarPrint';
import axios from 'axios';
import {
SansSearch,
SansSpinnerOnTable,
SansButtonEdit,
SansButtonDelete,
SansSortableTable,
SansDeleteModal,
SansNothingOnTable,
SansDivisiDropdown,
SansNotify,
SansFormatDate,
SansFormatMoney,
SansButtonSee,
SansFileInput,
SansButtonAddData,
SansButtonPrint,
} from '../ComponentCustom/SansComps';
import DanaKeluarEdit from './DanaKeluarEdit';
import { SansButtonPrintAll } from '../ComponentCustom/Component/SansButton';
import DanaKeluarInput from './DanaKeluarInput';

function DanaKeluarTable() {

    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentDivisi = sessionStorage.getItem('divisi');
    const currentToken = sessionStorage.getItem('token');
    console.log(currentToken);


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
            const response = await axios.get('http://localhost:8000/api/dana-keluar', {
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                },
            });
            console.log('Data fetched: ', response.data);

            const formattedData = response.data.data.map(item => {
                return {
                    ...item,
                    formatted_tgl: SansFormatDate(item.tgl),
                    formatted_biaya: SansFormatMoney(item.biaya),
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
        divisi: "",
        tgl: "",
        sumber_dana: "",
        nota: null,
        tujuan: "",
        biaya: "",
        banyak: "",
        satuan: "",
        total: ""
    });

    const handleEditClick = async (item) => {
        setEditingRowId(item.id);
        setFormData({
            divisi: item.divisi,
            tgl: item.tgl,
            sumber_dana: item.sumber_dana,
            nota: item.nota_url,
            tujuan: item.tujuan,
            biaya: item.biaya,
            banyak: item.banyak,
            satuan: item.satuan,
            total: item.total
        });
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditingRowId(null);
        setFormData({
            divisi: "",
            tgl: "",
            sumber_dana: "",
            nota: null,
            tujuan: "",
            biaya: "",
            banyak: "",
            satuan: "",
            total: ""
        });
    };

    // Delete
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        if (deleteId) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:8000/api/dana-keluar/${deleteId}`, {
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

    // Add
    const [showAddDanaKeluar, setShowAddDanaKeluarDanaKeluar] = useState(false);

    const handleshowAddDanaKeluar = () => {
        setShowAddDanaKeluarDanaKeluar(true);
    };

    const handleCloseAdd = () => {
        setShowAddDanaKeluarDanaKeluar(false);
    };


    // print
    const [showPreview, setShowPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleShowPreview = () => {
        if (!filter || filter === '' || filter === '-') {
            setErrorMessage("Pilih divisi terlebih dahulu");
            setStatus('error');
            setShowNotify(true);
            return;
        }
        const url = DanaKeluarPrint(filtered, filter);
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
                    <h2 style={{ marginBottom: '15px' }}>Data Dana Keluar</h2>
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
                            <Form.Group>
                                <SansButtonPrintAll
                                    onClick={handleShowPreview}
                                />
                                <SansButtonAddData
                                    onClick={handleshowAddDanaKeluar} />
                            </Form.Group>
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
                                <th onClick={() => requestSort('tujuan')}>
                                    Tujuan {getSortIcon('tujuan')}
                                </th>
                                <th onClick={() => requestSort('biaya')}>
                                    Biaya {getSortIcon('biaya')}
                                </th>
                                <th onClick={() => requestSort('banyak')}>
                                    Banyak {getSortIcon('banyak')}
                                </th>
                                <th onClick={() => requestSort('satuan')}>
                                    Satuan {getSortIcon('satuan')}
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
                                        <td>{item.tujuan}</td>
                                        <td>Rp{item.formatted_biaya}</td>
                                        <td className='text-center'>{item.banyak}</td>
                                        <td>{item.satuan}</td>
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

            <Modal show={isEditing} onHide={handleCancelClick} size='md' centered >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Dana Keluar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DanaKeluarEdit
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

            <Modal show={showAddDanaKeluar} onHide={handleCloseAdd} style={{ borderRadius: '5px' }} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Dana Keluar</Modal.Title>
                </Modal.Header>
                <DanaKeluarInput
                    setShowAddDanaKeluarDanaKeluar={setShowAddDanaKeluarDanaKeluar}
                />
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

export default DanaKeluarTable;
