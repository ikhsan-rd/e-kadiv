import '../../css/inputdatabase.scss';
import React,{ useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container,Button,Form,Row,Col,Table,Modal,Spinner } from 'react-bootstrap';
import axios from 'axios';
import
{
    SansSearch,
    SansSpinnerOnTable,
    SansButtonEdit,
    SansSortableTable,
    SansNothingOnTable,
    SansDivisiDropdown,
    SansNotify,
    SansFormatDate,
    SansFormatMoney,
    SansButtonSee,
    SansFileInput,
    SansButtonAddData,
    SansCheckBoxTable,
    SansMoneyInput,
} from '../ComponentCustom/SansComps';
import DanaKeluarInput from '../Dana/DanaKeluarInput';
import DanaKeluarEdit from '../Dana/DanaKeluarEdit';

function PresensiDanaKeluar({
    adaDanaKeluar,
    setAdaDanaKeluar,
    totalDanaKeluar,
    setTotalDanaKeluar,
    checkedIds,
    setCheckedIds,
    handleCloseDanaKeluar,
    jadwalData,
    selectedDate,
})
{

    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentDivisi = sessionStorage.getItem('divisi');
    const currentToken = sessionStorage.getItem('token');

    const [loading,setLoading] = useState(false);

    // Fetch
    const [tableData,setTableData] = useState([]);
    const { sortedData,requestSort,getSortIcon } = SansSortableTable({
        data: tableData,
        defaultSort: 'tgl',
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
            const response = await axios.get('http://localhost:8000/api/dana-keluar',{
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                },
            });
            console.log('Data fetched: ',response.data);

            //Filter menampilkan data yang tidak terkoneksi pada ID Presensi manapun
            const filteredData = response.data.data.filter(item =>
                (item.other_id === null || item.other_id === undefined) && 
                item.divisi === jadwalData.divisi &&
                item.tgl === selectedDate
            );

            const formattedData = filteredData.map(item =>
            {
                return {
                    ...item,
                    formatted_tgl: SansFormatDate(item.tgl),
                    formatted_biaya: SansFormatMoney(item.biaya),
                    formatted_total: SansFormatMoney(item.total),
                };
            });
            setTableData(formattedData);

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
                item.sumber_dana.toLowerCase().includes(lowerSearch) ||
                item.tujuan.toLowerCase().includes(lowerSearch) ||
                item.tgl.includes(lowerSearch) ||
                item.biaya.toString().includes(searchTerm) ||
                item.total.toString().includes(searchTerm)
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

    // Show Nota
    const [showModalNota,setShowModalNota] = useState(false);
    const [showNota,setShowNota] = useState('');

    const handleShowClick = async (item) =>
    {
        setShowNota(item.nota_url);
        setShowModalNota(true);
    };

    // Edit
    const [isEditing,setIsEditing] = useState(false);
    const [editingRowId,setEditingRowId] = useState(null);
    const [formData,setFormData] = useState({
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

    const handleEditClick = async (item) =>
    {
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

    const handleCancelClick = () =>
    {
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

    // Add
    const [showAddDanaKeluar,setShowAddDanaKeluarDanaKeluar] = useState(false);

    const handleshowAddDanaKeluar = () =>
    {
        setShowAddDanaKeluarDanaKeluar(true);
    };

    const handleCloseAdd = () =>
    {
        setShowAddDanaKeluarDanaKeluar(false);
    };

    //submit
    useEffect(() =>
    {
        const total = tableData.reduce((acc,item) =>
        {
            if (checkedIds.includes(item.id))
            {
                return acc + (item.total || 0);
            }
            return acc;
        },0);
        setTotalDanaKeluar(total);

    },[checkedIds,tableData]);

    const handleCheckboxChange = (itemId,isChecked) =>
    {
        let updatedIds = [...checkedIds];

        if (isChecked)
        {
            updatedIds.push(itemId);
        } else
        {
            updatedIds = updatedIds.filter((id) => id !== itemId);
        }

        setCheckedIds(updatedIds);
    };

    const handleSubmit = () =>
    {
        if (totalDanaKeluar)
        {
            setAdaDanaKeluar(true);
            console.log(adaDanaKeluar);
        } else
        {
            setAdaDanaKeluar(false);
            console.log(adaDanaKeluar);
        }
        console.log(checkedIds);
        console.log(totalDanaKeluar);
        handleCloseDanaKeluar();
    }

    return (
        <>
            <Form>
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
                            filtered.map((item,index) => (
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
                                        <td className='text-center d-flex justify-content-center'>
                                            <SansButtonSee
                                                onClick={() => handleShowClick(item)}
                                            />
                                            <SansButtonEdit
                                                onClick={() => handleEditClick(item)}
                                            />
                                            <SansCheckBoxTable
                                                isChecked={checkedIds.includes(item.id)}
                                                onChange={(e) => handleCheckboxChange(item.id,e.target.checked)}
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
            <Modal.Footer className='d-flex'>
                <SansMoneyInput
                    type="number"
                    value={totalDanaKeluar}
                    disabled={true}
                    style={{
                        width: '30%',
                    }}
                />
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : 'Tambah'}
                </Button>
            </Modal.Footer>

            {/* Modal Edit */}
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

                        handleCancelClick={handleCancelClick}
                        setStatus={setStatus}
                        setShowNotify={setShowNotify}
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                        fetchTableData={fetchTableData}
                    />
                </Modal.Body>
            </Modal>

            <Modal show={showAddDanaKeluar} onHide={handleCloseAdd} style={{ borderRadius: '5px' }} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Dana Keluar</Modal.Title>
                </Modal.Header>
                <DanaKeluarInput
                    selectedDate={selectedDate}
                    setShowAddDanaKeluarDanaKeluar={setShowAddDanaKeluarDanaKeluar}
                    jadwalData={jadwalData}
                />
            </Modal>

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

export default PresensiDanaKeluar;
