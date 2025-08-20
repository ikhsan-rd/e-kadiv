import React,{ useState,useEffect } from 'react';
import { Form,Button,Spinner,Modal,Col,Row,InputGroup,NavItem } from 'react-bootstrap';
import '../../css/button.scss';
import axios from 'axios';
import
{
    SansCheckBox,
    SansRadioButton,
    SansTimePicker,
    SansDatePicker,
    SansDivisiDropdown,
    SansDaysDropdown,
    SansDateToSend,
    SansTimeToSend,
} from '../ComponentCustom/SansComps';

function JadwalEdit({
    formData,
    setFormData,
    loading,
    setLoading,
    editingRowId,
    isEditing,
    type,
    setType,
    isAllDay,
    setIsAllDay,
    isIuran,
    setIsIuran,
    isSelesai,
    setIsSelesai,
    handleCancelClick,
    setStatus,
    setShowNotify,
    setErrorMessage,
    setSuccessMessage,
    fetchTableData,
})
{
    const currentToken = sessionStorage.getItem('token');

    //handle Data Change
    const handleChange = (e) =>
    {
        const { name,value } = e.target;
        setFormData(prevData => ({ ...prevData,[name]: value }));
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

        setFormData(prevData => ({
            ...prevData,
            iuran: checked ? prevData.iuran : null
        }));
    };

    const handleStatusChange = (event) =>
    {
        const checked = event.target.checked;
        setIsSelesai(checked);

        setFormData(prevData => ({
            ...prevData,
            status: checked ? 'Y' : 'N'
        }));
    };

    //handle Submit
    const handleEditSubmit = async (e) =>
    {
        e.preventDefault();

        console.log(formData);
        setLoading(true);

        let isValid = true;
        let errorMessage = '';

        // Validasi
        if (!isAllDay && (!formData.jam_mulai || !formData.jam_selesai))
        {
            isValid = false;
            errorMessage = 'Lengkapi data jam mulai dan jam selesai';
        }

        if (type === 'LongSession' && (!formData.tgl_mulai || !formData.tgl_selesai))
        {
            isValid = false;
            errorMessage = 'Lengkapi data tanggal mulai dan tanggal selesai';
        } else if (type === 'OneSession' && !formData.tgl_mulai)
        {
            isValid = false;
            errorMessage = 'Lengkapi data tanggal mulai';
        }

        if (!isValid)
        {
            setErrorMessage(errorMessage);
            setStatus('error');
            setShowNotify(true);
            setLoading(false);
            return;
        }

        // Membentuk formattedData sesuai kondisi checkbox
        let formattedData = { ...formData };

        // Jika tipe sesi adalah "OneSession", hapus tgl_selesai
        if (type === 'OneSession')
        {
            delete formattedData.tgl_selesai;
        }

        // Jika tipe sesi adalah "Repeat", hapus tgl_mulai dan tgl_selesai
        if (type === 'Repeat')
        {
            delete formattedData.tgl_mulai;
            delete formattedData.tgl_selesai;
        }

        // Jika isIuran tidak aktif, hapus iuran
        if (!isIuran)
        {
            delete formattedData.iuran;
        }

        // Jika isAllDay aktif, hapus jam_mulai dan jam_selesai
        if (isAllDay)
        {
            delete formattedData.jam_mulai;
            delete formattedData.jam_selesai;
        }

        // Mengonversi tanggal dan jam sesuai format
        formattedData = {
            ...formattedData,
            tgl_mulai: formattedData.tgl_mulai ? SansDateToSend(formattedData.tgl_mulai) : null,
            tgl_selesai: formattedData.tgl_selesai ? SansDateToSend(formattedData.tgl_selesai) : null,
            jam_mulai: formattedData.jam_mulai ? SansTimeToSend(formattedData.jam_mulai) : null,
            jam_selesai: formattedData.jam_selesai ? SansTimeToSend(formattedData.jam_selesai) : null,
        };

        console.log(formattedData);

        try
        {
            await axios.put(`http://localhost:8000/api/jadwal/${editingRowId}`,formattedData,{
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            setSuccessMessage("Data berhasil diubah");
            setStatus('success');
            setShowNotify(true);
            fetchTableData();
            handleCancelClick();
        } catch (error)
        {
            setErrorMessage("Terjadi Kesalahan");
            setStatus('error');
            setShowNotify(true);
            console.error("Error updating data:",error);
            if (error.response)
            {
                console.error("Response data:",error.response.data);
            }
        } finally
        {
            setLoading(false);
        }
    };


    return (
        <>
            <Modal show={isEditing} onHide={handleCancelClick} size='md'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Jadwal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Row style={{ marginBottom: '10px' }}>
                            <Form.Group as={Col}
                                style={{
                                    display: 'flex',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'space-between',
                                    height: 'fit-content',
                                    marginBottom: '15px',
                                    maxWidth: '100%'
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
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Form.Group as={Col}>
                                <Form.Label>Divisi</Form.Label>
                                <SansDivisiDropdown
                                    value={formData.divisi}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    setLoading={setLoading}
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Kegiatan</Form.Label>
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
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            {type === 'OneSession' && (
                                <Form.Group as={Col} controlId="tanggalMulai">
                                    <Form.Label>Tanggal Mulai</Form.Label>
                                    <SansDatePicker
                                        value={formData.tgl_mulai}
                                        onChange={(date) => setFormData({ ...formData,tgl_mulai: date,})}
                                        onClear={() => setFormData({ ...formData,tgl_mulai: null,})}
                                        disabled={loading}
                                    />
                                </Form.Group>
                            )}
                            {type === 'LongSession' && (
                                <>
                                    <Form.Group as={Col} controlId="tanggalMulai">
                                        <Form.Label>Tanggal Mulai</Form.Label>
                                        <SansDatePicker
                                            value={formData.tgl_mulai}
                                            onChange={(date) => setFormData({ ...formData,tgl_mulai: date })}
                                            onClear={() => setFormData({ ...formData,tgl_mulai: null })}
                                            disabled={loading}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="tanggalSelesai">
                                        <Form.Label>Tanggal Selesai</Form.Label>
                                        <SansDatePicker
                                            value={formData.tgl_selesai}
                                            onChange={(date) => setFormData({ ...formData,tgl_selesai: date })}
                                            onClear={() => setFormData({ ...formData,tgl_selesai: null })}
                                            disabled={loading}
                                        />
                                    </Form.Group>
                                </>
                            )}
                            {type === 'Repeat' && (
                                <Form.Group as={Col} >
                                    <Form.Label>Hari</Form.Label>
                                    <SansDaysDropdown
                                        value={formData.hari}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>
                            )}
                        </Row>
                        {!isAllDay && (
                            <Row style={{ marginBottom: '10px' }}>
                                <Form.Group as={Col}>
                                    <Form.Label>Jam Mulai</Form.Label>
                                    <SansTimePicker
                                        value={formData.jam_mulai}
                                        format="24h"
                                        name='jam_mulai'
                                        onChange={(time) => setFormData({ ...formData,jam_mulai: time })}
                                        onClear={() => setFormData({ ...formData,jam_mulai: null })}
                                        disabled={loading}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Jam Selesai</Form.Label>
                                    <SansTimePicker
                                        value={formData.jam_selesai}
                                        format="24h"
                                        name='jam_selesai'
                                        onChange={(time) => setFormData({ ...formData,jam_selesai: time })}
                                        onClear={() => setFormData({ ...formData,jam_selesai: null })}
                                        disabled={loading}
                                    />
                                </Form.Group>
                            </Row>
                        )}
                        <Row style={{ marginBottom: '15px' }}>
                            <Form.Group as={Col}>
                                <Form.Label>Tempat</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="tempat"
                                    value={formData.tempat}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                            {isIuran && (
                                <Form.Group as={Col}>
                                    <Form.Label>Iuran</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>Rp</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name='iuran'
                                            placeholder="Contoh : 10000"
                                            value={formData.iuran}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            )}
                        </Row>
                        <Modal.Footer className="d-flex justify-content-between">
                            <SansCheckBox
                                isChecked={isSelesai}
                                onChange={handleStatusChange}
                                label='Tandai Selesai'
                                style={{ backgroundColor: '#ffc107',padding: '0 3px 0 5px' }}
                            />
                            <Button variant="primary" type="submit" disabled={loading} style={{ marginLeft: '8px' }}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default JadwalEdit;
