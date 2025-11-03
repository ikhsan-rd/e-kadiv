import React,{ useState,useEffect } from 'react';
import { Form,Button,Spinner,Modal,Col,Row } from 'react-bootstrap';
import '../../css/button.scss';
import { SansDivisiDropdown } from '../ComponentCustom/SansComps';
import axios from 'axios';

function SaranaEdit({
    formData,
    setFormData,
    loading,
    setLoading,
    editingRowId,
    isEditing,
    handleCancelClick,
    setStatus,
    setShowNotify,
    setErrorMessage,
    setSuccessMessage,
    fetchTableData,
})
{
    const currentToken = sessionStorage.getItem('token');

    //fetch satuan list
    const [satuanList,setSatuanList] = useState([]);

    useEffect(() =>
    {
        const fetchSatuanList = async () =>
        {
            setLoading(true);
            try
            {
                const response = await axios.get("http://localhost:8000/api/sarana",{
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

    //Handle Data Change
    const handleChange = (e) =>
    {
        const { name,value } = e.target;
        let newValue = value;

        setFormData((prevData) =>
        {
            const updatedData = { ...prevData,[name]: newValue };

            if (name === 'jumlah')
            {
                const layak = parseInt(updatedData.layak_pakai) || 0;
                const tdkLayak = parseInt(updatedData.tdk_layak_pakai) || 0;

                if (layak + tdkLayak > value)
                {
                    updatedData.layak_pakai = '';
                    updatedData.tdk_layak_pakai = '';
                }
            } else if (name === 'layak_pakai')
            {
                const jumlah = parseInt(updatedData.jumlah) || 0;
                updatedData.tdk_layak_pakai = jumlah - parseInt(newValue);
            } else if (name === 'tdk_layak_pakai')
            {
                const jumlah = parseInt(updatedData.jumlah) || 0;
                updatedData.layak_pakai = jumlah - parseInt(newValue);
            }

            return updatedData;
        });
    };

    //Handle submit
    const handleEditSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        try
        {
            await axios.put(`http://localhost:8000/api/sarana/${editingRowId}`,formData,{
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
                    <Modal.Title>Edit Data Sarana dan Prasarana</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit} >
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
                                <Form.Label>Nama</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Form.Group as={Col} controlId="formNomorAnggota">
                                <Form.Label>Jumlah</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="jumlah"
                                    value={formData.jumlah}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Satuan</Form.Label>
                                <Form.Control
                                    list="satuanOptions"
                                    type="text"
                                    name="satuan"
                                    value={formData.satuan}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                <datalist id="satuanOptions">
                                    {satuanList.map((satuan,index) => (
                                        <option key={index} value={satuan}>{satuan}</option>
                                    ))}
                                </datalist>
                            </Form.Group>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Form.Group as={Col} >
                                <Form.Label>Layak Pakai</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="layak_pakai"
                                    value={formData.layak_pakai}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Tidak Layak Pakai</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="tdk_layak_pakai"
                                    value={formData.tdk_layak_pakai}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Row>
                        <Modal.Footer>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                            </Button>
                        </Modal.Footer>
                    </Form >
                </Modal.Body >
            </Modal>
        </>
    );
}

export default SaranaEdit;
