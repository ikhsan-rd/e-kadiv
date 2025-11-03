<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Col, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { SansDatePicker, SansDivisiDropdown, SansMoneyInput, SansMoneyToSend } from '../ComponentCustom/SansComps';
=======
import React,{ useState,useEffect } from 'react';
import { Form,Button,Modal,Col,Row,Spinner } from 'react-bootstrap';
import axios from 'axios';
import { SansDatePicker,SansDivisiDropdown,SansMoneyInput,SansMoneyToSend } from '../ComponentCustom/SansComps';
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a

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
<<<<<<< HEAD
}) {
    const currentToken = sessionStorage.getItem('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
=======
})
{
    const currentToken = sessionStorage.getItem('token');

    const handleChange = (e) =>
    {
        const { name,value } = e.target;
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

<<<<<<< HEAD
    const handleEditSubmit = async (e) => {
=======
    const handleEditSubmit = async (e) =>
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        e.preventDefault();
        setLoading(true);

        const formattedData = {
            ...formData,
            tgl: formData.tgl,
        };

<<<<<<< HEAD
        try {
            await axios.put(`http://localhost:8000/api/dana-masuk/${editingRowId}`, formattedData, {
=======
        try
        {
            await axios.put(`http://localhost:8000/api/dana-masuk/${editingRowId}`,formattedData,{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
<<<<<<< HEAD
        } catch (error) {
            setErrorMessage("Terjadi Kesalahan");
            setStatus('error');
            setShowNotify(true);
            console.error("Error updating data:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
        } finally {
=======
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
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            setLoading(false);
        }
    };

    return (
        <Modal
            show={isEditing}
            onHide={handleCancelClick}
            size='md'
<<<<<<< HEAD
            centered
=======
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
