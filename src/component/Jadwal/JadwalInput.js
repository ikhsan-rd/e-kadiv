import React,{ useState } from 'react';
import { Container,Form,Button,Row,Col,InputGroup,Spinner,Modal } from 'react-bootstrap';
import axios from 'axios';
import
{
    SansCheckBox,
    SansRadioButton,
    SansDaysDropdown,
    SansTimePicker,
    SansDatePicker,
    SansDivisiDropdown,
    SansNotify,
    SansDateToSend,
    SansTimeToSend
} from '../ComponentCustom/SansComps';

function JadwalInput()
{
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    const [loading,setLoading] = useState(false);
    const [type,setType] = useState('OneSession');
    const [isAllDay,setIsAllDay] = useState(false);
    const [isIuran,setIsIuran] = useState(false);

    // Initialize form data state
    const [formData,setFormData] = useState({
        divisi: currentDivisi || "",
        kegiatan: "",
        tgl_mulai: null,
        tgl_selesai: null,
        hari: "",
        jam_mulai: null,
        jam_selesai: null,
        tempat: "",
        iuran: null,
        status: "N",
    });

    const handleChange = (e) =>
    {
        const { name,value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    //handle checkbox dan radio button
    const handleTypeChange = (event) =>
    {
        const type = event.target.value;
        setType(type);

        if (type === 'Repeat')
        {
            setFormData({
                ...formData,
                tgl_mulai: null,
                tgl_selesai: null,
            });
        } else if (type === 'OneSession')
        {
            setFormData({
                ...formData,
                tgl_selesai: formData.tgl_mulai,
            });
        }
    };

    const handleAllDayChange = (event) =>
    {
        const checked = event.target.checked;
        setIsAllDay(checked);
        if (checked)
        {
            setFormData({
                ...formData,
                jam_mulai: null,
                jam_selesai: null,
            });
        }
    };

    const handleIuranChange = (event) =>
    {
        const checked = event.target.checked;
        setIsIuran(checked);
        if (!checked)
        {
            setFormData(prevData => ({
                ...prevData,
                iuran: null
            }));
        }
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        let isValid = true;
        let errorMessage = '';

        if (!isAllDay)
        {
            if (!formData.jam_mulai || !formData.jam_selesai)
            {
                isValid = false;
                errorMessage = 'Lengkapi data';
            }
        }

        if (type === 'LongSession')
        {
            if (!formData.tgl_mulai || !formData.tgl_selesai)
            {
                isValid = false;
                errorMessage = 'Lengkapi data';
            }
        }
        else if (type === 'OneSession')
        {
            if (!formData.tgl_mulai)
            {
                isValid = false;
                errorMessage = 'Lengkapi data';
            }
        }

        if (!isValid)
        {
            setErrorMessage(errorMessage);
            setStatus('error');
            setShowNotify(true);
            setLoading(false);
            return;
        }

        const formattedData = {
            ...formData,
            jam_mulai: SansTimeToSend(formData.jam_mulai),
            jam_selesai: SansTimeToSend(formData.jam_selesai),
            tgl_mulai: SansDateToSend(formData.tgl_mulai),
            tgl_selesai: SansDateToSend(formData.tgl_selesai),
        };

        try
        {
            await axios.post("http://localhost:8000/api/jadwal",formattedData,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentToken}`,
                },
                withCredentials: true,
            });

            console.log(formattedData);
            setSuccessMessage("Data berhasil ditambahkan");
            setStatus('success');
            setShowNotify(true);

            setFormData({
                divisi: currentDivisi || "",
                kegiatan: "",
                tgl_mulai: null,
                tgl_selesai: null,
                hari: "",
                jam_mulai: null,
                jam_selesai: null,
                tempat: "",
                iuran: null,
                status: "N",
            });
            setIsIuran(false);
            setIsAllDay(false);
            setType('OneSession');
        } catch (err)
        {
            if (err.response && err.response.data.message)
            {
                setErrorMessage(err.response.data.message);
            } else
            {
                setErrorMessage("Terjadi Kesalahan");
                console.error("Response data:",err.response.data);
            }
            setStatus('error');
            setShowNotify(true);
        } finally
        {
            setLoading(false);
        }
    };

    // Notify state
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

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Col} md={12}
                    style={{
                        display: 'flex',
                        alignSelf: 'flex-end',
                        justifyContent: 'space-between',
                        height: 'fit-content',
                        marginBottom: '15px',
                        maxWidth: '100%',
                    }}>
                    <SansCheckBox
                        isChecked={isAllDay}
                        onChange={handleAllDayChange}
                        label='Seharian'
                    />
                    <SansCheckBox
                        isChecked={isIuran}
                        onChange={handleIuranChange}
                        label='Iuran'
                    />
                    |
                    <SansRadioButton
                        isChecked={type === 'OneSession'}
                        onChange={handleTypeChange}
                        label='Sekali'
                        value='OneSession'
                    />
                    <SansRadioButton
                        isChecked={type === 'Repeat'}
                        onChange={handleTypeChange}
                        label='Rutin'
                        value='Repeat'
                    />
                    <SansRadioButton
                        isChecked={type === 'LongSession'}
                        onChange={handleTypeChange}
                        label='Berlanjut'
                        value='LongSession'
                    />
                </Form.Group>

                <Row style={{ marginBottom: '15px' }}>
                    <Form.Group as={Col} md={3} controlId="divisi">
                        <Form.Label>Divisi</Form.Label>
                        <SansDivisiDropdown
                            required={true}
                            disabled={loading}
                            setLoading={setLoading}
                            value={formData.divisi}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="kegiatan">
                        <Form.Label>Jenis Kegiatan</Form.Label>
                        <Form.Select
                            name="kegiatan"
                            value={formData.kegiatan}
                            onChange={handleChange}
                            required={true}
                            disabled={loading}
                        >
                            <option value="">Pilih</option>
                            <option value="Latihan">Latihan</option>
                            <option value="Sparing">Sparing</option>
                            <option value="Fun Match">Fun Match</option>
                            <option value="Pertandingan">Pertandingan</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="tempat">
                        <Form.Label>Tempat</Form.Label>
                        <Form.Control
                            type="text"
                            name="tempat"
                            value={formData.tempat}
                            onChange={handleChange}
                            required={true}
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="iuran">
                        <Form.Label>Iuran</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>Rp</InputGroup.Text>
                            <Form.Control
                                type="number"
                                name="iuran"
                                value={formData.iuran}
                                onChange={handleChange}
                                disabled={loading || !isIuran}
                                required={true}
                            />
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Row style={{ marginBottom: '15px' }}>
                    <Form.Group as={Col} md={3} controlId="tglMulai">
                        <Form.Label>Tanggal Mulai</Form.Label>
                        <SansDatePicker
                            value={formData.tgl_mulai}
                            onChange={(date) => setFormData({ ...formData,tgl_mulai: date,})}
                            onClear={() => setFormData({ ...formData,tgl_mulai: null,})}
                            disabled={loading || type === 'Repeat' || !type === 'OneSession' || !type === 'LongSession'}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="tglSelesai">
                        <Form.Label>Tanggal Selesai</Form.Label>
                        <SansDatePicker
                            value={formData.tgl_selesai}
                            onChange={(date) => setFormData({ ...formData,tgl_selesai: date })}
                            onClear={() => setFormData({ ...formData,tgl_selesai: null })}
                            disabled={loading || type === 'Repeat' || type === 'OneSession' || !type === 'LongSession'}
                        />
                    </Form.Group>

                    <Form.Group as={Col} md={2} controlId="jamMulai">
                        <Form.Label>Jam Mulai</Form.Label>
                        <SansTimePicker
                            value={formData.jam_mulai}
                            disabled={loading || isAllDay || !type === 'Repeat'}
                            onChange={(time) => setFormData({ ...formData,jam_mulai: time })}
                            onClear={() => setFormData({ ...formData,jam_mulai: null })}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={2} controlId="jamSelesai">
                        <Form.Label>Jam Selesai</Form.Label>
                        <SansTimePicker
                            value={formData.jam_selesai}
                            disabled={loading || isAllDay || !type === 'Repeat'}
                            onChange={(time) => setFormData({ ...formData,jam_selesai: time })}
                            onClear={() => setFormData({ ...formData,jam_selesai: null })}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={2} controlId="hari">
                        <Form.Label>Hari</Form.Label>
                        <SansDaysDropdown
                            value={formData.hari}
                            required={true}
                            disabled={loading || !type === 'Repeat' || type === 'OneSession' || type === 'LongSession'}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Row>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        style={{ width: "30%",margin: "5px 35% 0 35%" }}
                    >
                        {loading ? (
                            <Spinner animation="border" size="sm" />
                        ) : 'Tambah'}
                    </Button>
                </Modal.Footer>
            </Form>

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

export default JadwalInput;
