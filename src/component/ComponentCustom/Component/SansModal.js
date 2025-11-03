import React,{ useEffect } from 'react';
import { Modal,Button,Spinner,Alert,Form,Col,Row } from 'react-bootstrap';
import { CheckCircle,QuestionLg,Trash2,Trash2Fill,Trash3,XCircle } from 'react-bootstrap-icons';
import SansLoadOrNotImage from './SansLoadOrNotImage';

export const SansDeleteModal = ({
    show,
    onHide,
    onDelete,
    loading,
    title = "Delete",
    bodyText = "Anda yakin ingin menghapus ini?",
    deleteText = "Delete",
}) =>
{
    useEffect(() =>
    {
        const handleKeyPress = (event) =>
        {
            if (event.key === 'Enter')
            {
                onDelete();
            }
        };

        if (show)
        {
            document.addEventListener('keydown',handleKeyPress);
        }

        return () =>
        {
            document.removeEventListener('keydown',handleKeyPress);
        };
    },[show,onHide]);

    return (
        <Modal show={show} size='sm' onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center' style={{ padding: '25px' }}>
                <Trash3 size={80} className="text-danger" />
                <p className='text-center' style={{ marginTop: '25px' }}>{bodyText}</p>
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex',justifyContent: 'center' }}>
                <Button variant="danger" onClick={onDelete} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : deleteText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export const SansNotify = ({
    show,
    onHide,
    status,
    onSuccess,
    onError,
}) =>
{

    useEffect(() =>
    {
        const handleKeyPress = (event) =>
        {
            if (event.key === 'Enter')
            {
                onHide();
            }
        };

        if (show)
        {
            document.addEventListener('keydown',handleKeyPress);
        }

        return () =>
        {
            document.removeEventListener('keydown',handleKeyPress);
        };
    },[show,onHide]);

    return (
        <Modal show={show} onHide={onHide} size="sm" centered>
            <Modal.Body className='text-center' style={{ padding: '25px' }}>
                {status === 'success' ? (
                    <>
                        <CheckCircle size={80} className="text-success" />
                        <h4 className="mt-2">Success!</h4>
                        <p>{onSuccess}</p>
                    </>
                ) : (
                    <>
                        <XCircle size={80} className="text-danger" />
                        <h4 className="mt-2">Error!</h4>
                        <p>{onError}</p>
                    </>
                )}
                <Button
                    style={{ marginTop: '3%',padding: ' 2% 30%' }}
                    variant={status === 'success' ? "success" : "danger"}
                    onClick={onHide}>
                    OK
                </Button>
            </Modal.Body>
        </Modal>
    );
};


export const SansAsk = ({
    show,
    onHide,
    question,
    onClickOne,
    onClickTwo,
    textOne,
    textTwo,
}) =>
{

    useEffect(() =>
    {
        const handleKeyPress = (event) =>
        {
            if (event.key === 'Enter')
            {
                onHide();
            }
        };

        if (show)
        {
            document.addEventListener('keydown',handleKeyPress);
        }

        return () =>
        {
            document.removeEventListener('keydown',handleKeyPress);
        };
    },[show,onHide]);

    return (
        <Modal show={show} onHide={onHide} size="sm" centered>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body className='text-center' style={{ padding: '25px' }}>
                <QuestionLg size={80} className="text-warning" />
                <h4 className="mt-2">Wait!</h4>
                <p>{question}</p>
                <Row>
                    <Form.Group as={Col}>
                        <Button
                            style={{ marginTop: '3%',padding: ' 2% 30%' }}
                            variant='primary'
                            onClick={onClickOne}>
                            {textOne}
                        </Button>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Button
                            style={{ marginTop: '3%',padding: ' 2% 30%' }}
                            variant='success'
                            onClick={onClickTwo}>
                            {textTwo}
                        </Button>
                    </Form.Group>
                </Row>
            </Modal.Body>
        </Modal>
    );
};


export const SansWelcome = ({ show,onHide }) =>
{

    const currentNama = sessionStorage.getItem('nama');
    const currentFoto = sessionStorage.getItem('foto');
    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentDivisi = sessionStorage.getItem('divisi');

    useEffect(() =>
    {
        const handleKeyPress = (event) =>
        {
            if (event.key === 'Enter')
            {
                onHide();
            }
        };

        if (show)
        {
            document.addEventListener('keydown',handleKeyPress);
        }

        return () =>
        {
            document.removeEventListener('keydown',handleKeyPress);
        };
    },[show,onHide]);

    return (
        <Modal show={show} onHide={onHide} size="sm" centered>
            <Modal.Body className='text-center' style={{ padding: '25px' }}>
                <SansLoadOrNotImage
                    src={currentFoto}
                    width='80px'
                    height='80px'
                    shape='circle'
                />
                <h4 className="mt-2">Welcome {currentNama}!</h4>
                {(currentJabatan === 'Kadiv' || currentJabatan === 'Pelatih') ?
                    (
                        <>
                            <p>
                                Kamu login sebagai
                                <span style={{ display: 'block' }}>
                                    {currentJabatan} {currentDivisi}
                                </span>
                            </p>
                        </>
                    ) : (
                        <p>Kamu login sebagai {currentJabatan}</p>
                    )}
                <Button
                    style={{ marginTop: '3%',padding: ' 2% 30%' }}
                    variant='primary'
                    onClick={onHide}>
                    OK
                </Button>
            </Modal.Body>
        </Modal>
    );
};



