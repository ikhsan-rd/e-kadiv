import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Col, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { SansDatePicker, SansDivisiDropdown, SansMoneyInput, SansMoneyToSend } from '../ComponentCustom/SansComps';

function DanaMasukEdit({
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

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formattedData = {
            ...formData,
            tgl: formData.tgl,
        };

        try {
            await axios.put(`http://localhost:8000/api/dana-masuk/${editingRowId}`, formattedData, {
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
        <Modal
            show={isEditing}
            onHide={handleCancelClick}
            size='md'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Dana Keluar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                            <Form.Label>Total</Form.Label>
                            <SansMoneyInput
                                name="total"
                                value={formData.total}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Form.Group>
                    </Row>
                    <Modal.Footer>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default DanaMasukEdit;
