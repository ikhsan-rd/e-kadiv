import React, { useState, useEffect } from 'react';
import { Modal, Table, Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import {
    SansFilter,
    SansNothingOnTable,
    SansSearch,
    SansSpinnerOnTable,
    SansSortableTable,
    SansFormatDate,
    SansFormatTime,
    SansDivisiDropdown,
    SansButtonAddData,
} from '../ComponentCustom/SansComps';

function PresensiCari({ show, handleClose, setJadwalData }) {
    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    const [loading, setLoading] = useState(false);

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        let filteredData = sortedData;

        filteredData = filteredData.filter(item => item.status === 'N');

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
    }, [filter, searchTerm, sortedData, currentDivisi]);

    const handleClearAll = () => {
        setFilter('');
        setSearchTerm('');
        requestSort('');
    };

    const handleSelectJadwal = (jadwal) => {
        setJadwalData(jadwal);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Cari Jadwal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
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
                            <Form.Group>
                                <SansButtonAddData
                                // onClick={handleshowAddDanaKeluar} 
                                />
                            </Form.Group>
                        </Form.Group>
                    </Row>
                </Form>
                <Table striped bordered hover>
                    <thead>
                        <tr className='text-center'>
                            <th>No</th>
                            <th onClick={() => requestSort('formatted_tgl_mulai')}>
                                Tanggal {getSortIcon('formatted_tgl_mulai')}
                            </th>
                            {currentJabatan === 'Admin' && (
                                <th onClick={() => requestSort('Divisi')}>
                                    Divisi {getSortIcon('Divisi')}
                                </th>
                            )}
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
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <SansSpinnerOnTable />
                        ) : filtered.length > 0 ? (
                            filtered.map((item, index) => (
                                <tr key={item.id} onClick={() => handleSelectJadwal(item)} style={{ cursor: 'pointer' }}>
                                    <td className='text-center'>{index + 1}</td>
                                    <td>
                                        {item.formatted_tgl_mulai}
                                        {item.formatted_tgl_selesai ? ` - ${item.formatted_tgl_selesai}` : ''}
                                    </td>
                                    {currentJabatan === 'Admin' && (
                                        <td>{item.divisi}</td>
                                    )}
                                    <td>{item.hari ? item.hari : '-'}</td>
                                    <td>{item.kegiatan}</td>
                                    <td className='text-center'>
                                        {item.formatted_jam_mulai}
                                        {item.formatted_jam_selesai ? ` - ${item.formatted_jam_selesai}` : ''}
                                    </td>
                                    <td>{item.tempat}</td>
                                    <td>Rp {item.iuran ? item.iuran : '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <SansNothingOnTable />
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Tutup
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PresensiCari;
