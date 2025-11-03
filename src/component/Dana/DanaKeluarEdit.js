import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Col, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { SansDatePicker, SansDivisiDropdown, SansMoneyInput, SansMoneyToSend } from '../ComponentCustom/SansComps';

function DanaKeluarEdit({
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
}) {
    const currentToken = sessionStorage.getItem('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const calculateTotal = () => {
        const biaya = parseFloat(SansMoneyToSend(formData.biaya)) || 0;
        const banyak = parseFloat(formData.banyak) || 0;
        const total = biaya * banyak;

        setFormData((prevData) => ({
            ...prevData,
            total: total,
        }));
    };

    useEffect(() => {
        calculateTotal();
    }, [formData.biaya, formData.banyak]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formattedData = {
            ...formData,
            tgl: formData.tgl,
        };

        try {
            await axios.put(`http://localhost:8000/api/dana-keluar/${editingRowId}`, formattedData, {
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
        } catch (error) {
            setErrorMessage("Terjadi Kesalahan");
            setStatus('error');
            setShowNotify(true);
            console.error("Error updating data:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleEditSubmit}>
            <Row style={{ marginBottom: '10px' }}>
                <Form.Group as={Col}>
                    <Form.Label>Divisi</Form.Label>
                    <SansDivisiDropdown
                        value={formData.divisi}
                        onChange={handleChange}
                        required
                        disabled={true}
                        setLoading={setLoading}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Tanggal</Form.Label>
                    <SansDatePicker
                        value={formData.tgl}
                        onChange={handleChange}
                        disabled={true}
                    />
                </Form.Group>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
                <Form.Group as={Col}>
                    <Form.Label>Sumber Dana</Form.Label>
                    <Form.Control
                        type="text"
                        name="sumber_dana"
                        value={formData.sumber_dana}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Tujuan</Form.Label>
                    <Form.Control
                        type="text"
                        name="tujuan"
                        value={formData.tujuan}
                        onChange={handleChange}
                    />
                </Form.Group>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
                <Form.Group as={Col}>
                    <Form.Label>Biaya</Form.Label>
                    <SansMoneyInput
                        name="biaya"
                        value={formData.biaya}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Banyak</Form.Label>
                    <Form.Control
                        type="number"
                        name="banyak"
                        value={formData.banyak}
                        onChange={handleChange}
                    />
                </Form.Group>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
                <Form.Group as={Col}>
                    <Form.Label>Satuan</Form.Label>
                    <Form.Control
                        type="text"
                        name="satuan"
                        value={formData.satuan}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Total</Form.Label>
                    <SansMoneyInput
                        name="total"
                        value={formData.total}
                        onChange={handleChange}
                        disabled={true}
                    />
                </Form.Group>
            </Row>
            <Modal.Footer>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                </Button>
            </Modal.Footer>
        </Form>
    );
}

export default DanaKeluarEdit;
