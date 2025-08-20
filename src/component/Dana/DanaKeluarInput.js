import React,{ useState,useEffect,useRef } from 'react';
import { Modal,Form,Button,Row,Col,InputGroup,Spinner,Container } from 'react-bootstrap';
import axios from 'axios';
import { SansButtonAddLine,SansDatePicker,SansDateToSend,SansDivisiDropdown,SansFileInput,SansFormatMoney,SansMoneyInput,SansMoneyToSend,SansNotify } from '../ComponentCustom/SansComps';
import { Eye,PlusLg,Trash } from 'react-bootstrap-icons';

function DanaKeluarInput({
    selectedDate,
    divisi,
    isDoneDanaKeluar,
    setShowAddDanaKeluar,
    presensiMode,
    jadwalData,
})
{
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    const [loading,setLoading] = useState(false);

    const [satuanList,setSatuanList] = useState([]);
    const [danaKeluar,setDanaKeluar] = useState(0);

    const [formDanaKeluar,setFormDanaKeluar] = useState({
        divisi: divisi || currentDivisi || "",
        tgl: selectedDate || null,
        sumber_dana: "",
        nota: null,
    });

    const [details,setDetails] = useState([{ tujuan: '',biaya: '',banyak: '',satuan: '',total: '' }]);

    //fetch
    useEffect(() =>
    {
        const fetchSatuanList = async () =>
        {
            setLoading(true);
            try
            {
                const response = await axios.get("http://localhost:8000/api/dana-keluar",{
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                const satuanListData = [...new Set(response.data.data.map(item => item.satuan))];
                setSatuanList(satuanListData);
            } catch (error)
            {
                console.error("Error fetching satuan list:",error);
            } finally
            {
                setLoading(false);
            }
        };

        fetchSatuanList();
    },[currentToken]);

    const handleAddDetail = () =>
    {
        setDetails([...details,{ tujuan: '',biaya: '',banyak: '',satuan: '',total: '' }]);
    };

    //MapDetail
    const handleDetailChange = (index,field,value) =>
    {
        const newDetails = [...details];
        newDetails[index][field] = value;

        if (field === 'biaya' || field === 'banyak')
        {
            const biaya = SansMoneyToSend(String(newDetails[index].biaya)) || 0;
            const banyak = parseFloat(newDetails[index].banyak) || 0;
            newDetails[index].total = biaya * banyak;
        }

        setDetails(newDetails);
        updateDanaKeluar(newDetails);
    };

    const handleRemoveDetail = () =>
    {
        if (details.length > 1)
        {
            setDetails(details.slice(0,-1));
        }
    };

    //Nota
    const notaInputRef = useRef(null);
    const [showModalNota,setShowModalNota] = useState(false);

    const handleNotaChange = (e) =>
    {
        const file = e.target.files[0];
        if (file)
        {
            setFormDanaKeluar((prevData) => ({
                ...prevData,
                nota: file,
            }));
        }
    };

    const handleCekNota = () =>
    {
        setShowModalNota(true);
    };

    const handleHapusNota = () =>
    {
        setFormDanaKeluar((prevData) => ({
            ...prevData,
            nota: null,
        }));
        setShowModalNota(false);
        if (notaInputRef.current)
        {
            notaInputRef.current.value = '';
        }
    };

    const updateDanaKeluar = (details) =>
    {
        const totalDanaKeluar = details.reduce((sum,detail) => sum + (detail.total || 0),0);
        setDanaKeluar(totalDanaKeluar);
    };

    const handleSumberDanaChange = (e) =>
    {
        setFormDanaKeluar(prevState => ({
            ...prevState,
            sumber_dana: e.target.value
        }));
    };

    // // Update fungsi handleFileChange untuk mengelola file nota
    // const handleFileChange = (event) =>
    // {
    //     const file = event.target.files[0];
    //     setFormDanaKeluar(prevState => ({
    //         ...prevState,
    //         nota: file
    //     }));
    // };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        if (details.some(detail => !detail.biaya || !detail.banyak || !detail.total))
        {
            setErrorMessage('Lengkapi data');
            setStatus('error');
            setShowNotify(true);
            setLoading(false);
            return;
        }

        if (!formDanaKeluar.tgl)
        {
            setErrorMessage('Tanggal harus dipilih');
            setStatus('error');
            setShowNotify(true);
            setLoading(false);
            return;
        }

        const data = new FormData();
        Object.keys(formDanaKeluar).forEach((key) =>
        {
            data.append(key,formDanaKeluar[key]);
        });

        if (formDanaKeluar.nota)
        {
            data.append("nota",formDanaKeluar.nota);
        }

        const formattedData = details.map(detail => ({
            ...formDanaKeluar,
            tgl: SansDateToSend(formDanaKeluar.tgl),
            tujuan: detail.tujuan,
            biaya: SansMoneyToSend(detail.biaya),
            banyak: detail.banyak,
            satuan: detail.satuan,
            total: SansMoneyToSend(detail.total),
        }));

        console.log('Formatted data:',formattedData);

        try
        {
            for (let i = 0; i < formattedData.length; i++)
            {
                await axios.get("http://localhost:8000/sanctum/csrf-cookie",{
                    withCredentials: true,
                });

                const response = await axios.post("http://localhost:8000/api/dana-keluar",formattedData[i],{
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${currentToken}`,
                    },
                    withCredentials: true,
                });
                console.log('Response for item',i,response.data);
            }
            setSuccessMessage('Dana Keluar berhasil ditambahkan');
            setStatus('success');
            setShowNotify(true);
            resetForm();
            setShowAddDanaKeluar(false);
        } catch (error)
        {
            if (error.response && error.response.data.message)
            {
                setErrorMessage(error.response.data.message);
            } else
            {
                setErrorMessage("Terjadi Kesalahan");
            }
            setStatus('error');
            setShowNotify(true);
        } finally
        {
            setLoading(false);
        }
    };

    const resetForm = () =>
    {
        setDetails([{ tujuan: '',biaya: '',banyak: '',satuan: '',total: '' }]);
        setFormDanaKeluar({
            divisi: divisi || currentDivisi || "",
            tgl: selectedDate || null,
            sumber_dana: "",
            nota: null,
        });
        setDanaKeluar('');

        if (notaInputRef.current)
        {
            notaInputRef.current.value = "";
        }
    };

    //Notify
    const [showNotify,setShowNotify] = useState(false);
    const [status,setStatus] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
    const [successMessage,setSuccessMessage] = useState('');

    return (
        <>
            <Form onSubmit={handleSubmit} style={{ margin: '15px' }}>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} md={3}>
                        <Form.Label>Divisi</Form.Label>
                        <SansDivisiDropdown
                            value={formDanaKeluar.divisi}
                            onChange={(e) => setFormDanaKeluar({ ...formDanaKeluar,divisi: e.target.value })}
                            required
                            disabled={loading || divisi || currentDivisi}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3}>
                        <Form.Label>Tanggal</Form.Label>
                        <SansDatePicker
                            value={formDanaKeluar.tgl}
                            onChange={(date) => setFormDanaKeluar({ ...formDanaKeluar,tgl: date })}
                            onClear={() => setFormDanaKeluar({ ...formDanaKeluar,tgl: null })}
                            disabled={loading || selectedDate}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3}>
                        <Form.Label>Sumber Dana</Form.Label>
                        <Form.Control
                            type="text"
                            value={formDanaKeluar.sumber_dana}
                            onChange={handleSumberDanaChange}
                            disabled={loading || presensiMode}
                            required
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3}>
                        <Form.Label>Nota (pdf/image)</Form.Label>
                        <Form.Group style={{ display: 'flex' }}>
                            <Form.Control
                                type="file"
                                name="nota"
                                onChange={handleNotaChange}
                                ref={notaInputRef}
                                disabled={loading}
                            />
                            {formDanaKeluar.nota && (
                                <Button variant="primary" onClick={handleCekNota} className='button-see'>
                                    <Eye className='eye-custom' />
                                </Button>
                            )}
                        </Form.Group>
                    </Form.Group>
                </Row>
                {/* Details Section */}
                <Row>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Tujuan</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={3}>
                        <Form.Label>Biaya</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Qty</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Satuan</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={3}>
                        <Form.Label>Total</Form.Label>
                    </Form.Group>
                </Row>
                {details.map((detail,index) => (
                    <Row key={index} style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} md={2}>
                            <Form.Control
                                type="text"
                                value={detail.tujuan}
                                onChange={e => handleDetailChange(index,'tujuan',e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <SansMoneyInput
                                value={detail.biaya || null}
                                onChange={e => handleDetailChange(index,'biaya',e.target.value)}
                                disabled={loading}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={2}>
                            <Form.Control
                                type="number"
                                value={detail.banyak}
                                onChange={e => handleDetailChange(index,'banyak',e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={2}>
                            <Form.Control
                                list="satuanOptions"
                                type='text'
                                value={detail.satuan}
                                onChange={e => handleDetailChange(index,'satuan',e.target.value)}
                                disabled={loading}
                                required
                            />
                            <datalist id="satuanOptions">
                                {satuanList.map((satuan,i) => (
                                    <option key={i} value={satuan}>{satuan}</option>
                                ))}
                            </datalist>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <SansMoneyInput
                                value={detail.total || ''}
                                disabled={loading}
                            />
                        </Form.Group>

                    </Row>
                ))}
                <Row as={Col} style={{ marginBottom: '15px' }} className="justify-content-end">
                    {!isDoneDanaKeluar && (
                        <Form.Group as={Col} md={6} style={{ display: 'flex' }}>
                            <SansButtonAddLine
                                onClick={handleAddDetail}
                                disabled={loading || isDoneDanaKeluar}
                            />
                            {details.length > 1 && (
                                <Button
                                    variant="danger"
                                    onClick={handleRemoveDetail}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '9px',
                                        width: '38px',
                                        height: '38px',
                                        marginLeft: '5px'
                                    }}
                                >
                                    <Trash style={{ width: '20px',height: '20px' }} />
                                </Button>
                            )}
                        </Form.Group>
                    )}
                    <Form.Group as={Col} md={3} style={{ marginTop: '15px' }}>
                        <Form.Label
                            style={{ marginTop: '5px' }}
                        >
                            Total Pengeluaran :
                        </Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={3} style={{ marginTop: '15px' }}>
                        <SansMoneyInput
                            value={danaKeluar}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading || isDoneDanaKeluar}
                        style={{ width: "30%",margin: "5px 35% 0 35%" }}
                    >
                        {loading ? (
                            <Spinner animation="border" size="sm" />
                        ) : 'Tambah'}
                    </Button>
                </Modal.Footer>
            </Form>

            {formDanaKeluar.nota && (
                <SansFileInput
                    show={showModalNota}
                    onHide={() => setShowModalNota(false)}
                    fileSrc={formDanaKeluar.nota}
                    onDelete={handleHapusNota}
                />
            )}

            < SansNotify
                show={showNotify}
                onHide={() => setShowNotify(false)
                }
                status={status}
                onSuccess={successMessage}
                onError={errorMessage}
            />
        </>
    );
}

export default DanaKeluarInput;
