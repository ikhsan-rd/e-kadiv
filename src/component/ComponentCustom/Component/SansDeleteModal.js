import React from 'react';
import { Modal,Button,Spinner } from 'react-bootstrap';

const SansDeleteModal = ({ show,onHide,onDelete,loading,title = "Delete",bodyText = "Apakah Anda yakin ingin menghapus ini?",deleteText = "Delete" }) =>
{

    return (
        <Modal show={show} size='sm' onHide={onHide} style={{ position: 'fixed',marginTop: '10vh',marginRight: '2px' }}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{bodyText}</Modal.Body>
            <Modal.Footer style={{ display: 'flex',justifyContent: 'center' }}>
                <Button variant="danger" onClick={onDelete} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : deleteText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SansDeleteModal;
