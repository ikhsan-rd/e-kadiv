import '../../css/inputdatabase.scss'
import React,{ useState,useRef } from 'react';
import { Container,Form,Button,Row,Col,Modal,InputGroup } from 'react-bootstrap';
import { Check2,Eye,Trash } from 'react-bootstrap-icons';
import '../../css/button.scss'

function PelatihInput()
{

    //Handle Nomor Whatsapp
    const [phoneNumberInput,setPhoneNumberInput] = useState('');
    const [phoneNumber,setPhoneNumber] = useState('+62');

    const isValidPhoneNumber = (phoneNumber) =>
    {
        const numericPhoneNumber = phoneNumber.replace(/\D/g,'');
        return numericPhoneNumber.length >= 10 && numericPhoneNumber.length <= 14;
    };

    const handlePhoneNumberChange = (event) =>
    {
        const inputValue = event.target.value;
        const numericValue = inputValue.replace(/\D/g,'');

        if (numericValue.length <= 15)
        {
            setPhoneNumberInput(inputValue);
            setPhoneNumber('+62' + numericValue);
        }
    };

    const handleBlur = () =>
    {
        if (!isValidPhoneNumber(phoneNumber))
        {
            setPhoneNumberInput('');
            setPhoneNumber('+62');
        }
    };

    //Handle Upload Foto
    const [foto,setFoto] = useState(null);
    const fotoInputRef = useRef(null);
    const [showModalFoto,setShowModalFoto] = useState(false);

    const handleUploadFoto = (event) =>
    {
        const uploadedFoto = URL.createObjectURL(event.target.files[0]);
        setFoto(uploadedFoto);
    };

    const handleHapusFoto = () =>
    {
        handleCloseModalFoto();
        URL.revokeObjectURL(foto);
        setFoto(null);
        if (fotoInputRef.current)
        {
            fotoInputRef.current.value = "";
        }
    };

    const handleCekFoto = () =>
    {
        setShowModalFoto(true);
    };

    const handleCloseModalFoto = () =>
    {
        setShowModalFoto(false);
    };

    //Handle Upload Tanda Pengenal
    const [pengenal,setPengenal] = useState(null);
    const pengenalInputRef = useRef(null);
    const [showModalPengenal,setShowModalPengenal] = useState(false);

    const handleUploadPengenal = (event) =>
    {
        const uploadedPengenal = URL.createObjectURL(event.target.files[0]);
        setPengenal(uploadedPengenal);
    };

    const handleHapusPengenal = () =>
    {
        handleCloseModalPengenal();
        URL.revokeObjectURL(pengenal);
        setPengenal(null);
        if (pengenalInputRef.current)
        {
            pengenalInputRef.current.value = "";
        }
    };

    const handleCekPengenal = () =>
    {
        setShowModalPengenal(true);
    };

    const handleCloseModalPengenal = () =>
    {
        setShowModalPengenal(false);
    };

    return (
        <Container>
            <Form style={{ marginTop: '15px' }}>
                <h2>Tambah Pelatih</h2>
                <Row style={{ marginBottom: '15px' }}>
                    <Form.Group as={Col} md={4} controlId="nama">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control type="text" placeholder="Masukkan nama" />
                    </Form.Group>
                    <Form.Group as={Col} md={2} controlId="jeniskelamin">
                        <Form.Label>Jenis Kelamin</Form.Label>
                        <Form.Select defaultValue="Pilih">
                            <option value="">Pilih</option>
                            <option>Laki-laki</option>
                            <option>Perempuan</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="whatsapp">
                        <Form.Label>Whatsapp</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>+62</InputGroup.Text>
                            <Form.Control type="tel"
                                value={phoneNumberInput}
                                onChange={handlePhoneNumberChange}
                                onBlur={handleBlur}
                                maxLength={12}
                                placeholder="Tulis tanpa +62" />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="foto">
                        <Form.Label>Foto</Form.Label>
                        <Form.Group style={{ display: 'flex' }}>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleUploadFoto}
                                ref={fotoInputRef}
                            />
                            {foto !== null && (
                                    <Button variant="primary" onClick={handleCekFoto} className='button-see' >
                                        <Eye className='eye-custom' />
                                    </Button>
                            )}
                        </Form.Group>
                    </Form.Group>
                </Row>
                <Row style={{ marginBottom: '20px' }}>
                    <Form.Group as={Col} md={3} controlId="divisi">
                        <Form.Label>Divisi</Form.Label>
                        <Form.Select as="select">
                            <option value="">Pilih divisi</option>
                            <option value="divisi1">Sepak Bola</option>
                            <option value="divisi2">Bulu Tangkis</option>
                            <option value="divisi2">Bola Voli</option>
                            <option value="divisi2">Futsal</option>
                            <option value="divisi3">Bela Diri (Silat)</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="kategori">
                        <Form.Label>Kategori</Form.Label>
                        <Form.Control type="text" placeholder="Masukkan kategori (opsional)" />
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="statusanggota">
                        <Form.Label>Status Keanggotaan UKM</Form.Label>
                        <Form.Select as="select">
                            <option value="">Pilih</option>
                            <option value="aktif">Anggota</option>
                            <option value="tidak-aktif">Non-Anggota</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="pengenal">
                        <Form.Label>KTP/SIM/Lainnya (pdf)</Form.Label>
                        <Form.Group style={{ display: 'flex' }}>
                            <Form.Control
                                type="file"
                                accept="application/pdf"
                                onChange={handleUploadPengenal}
                                ref={pengenalInputRef}
                            />
                            {pengenal !== null && (
                                    <Button variant="primary" onClick={handleCekPengenal} className='button-see'>
                                        <Eye className='eye-custom' />
                                    </Button>
                            )}
                        </Form.Group>
                    </Form.Group>
                </Row>
                <Button variant="primary" type="submit" style={
                    {
                        width: '30%',
                        margin: '0 35%'
                    }
                }>
                    Submit
                </Button>
            </Form>
            {/* Modal untuk menampilkan foto */}
            <Modal show={showModalFoto} onHide={handleCloseModalFoto}>
                <Modal.Header>
                    <Modal.Title>Foto</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex',justifyContent: 'center',alignItems: 'center' }}>
                    <img src={foto} alt="Foto" style={{ minHeight: '60vh',maxHeight: '60vh',maxWidth: '100%',objectFit: 'contain' }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleHapusFoto} className='button-delete' style={{ marginRight: '5px' }}>
                        <Trash className='trash-custom' />
                    </Button>
                    <Button variant="success" onClick={handleCloseModalFoto} className='button-check'>
                        <Check2 className='check2-custom' />
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal untuk menampilkan pengenal */}
            <Modal show={showModalPengenal} onHide={handleCloseModalPengenal}>
                <Modal.Header>
                    <Modal.Title>Tanda Pengenal</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex',justifyContent: 'center',alignItems: 'center' }}>
                    <iframe src={`${pengenal}#toolbar=0`} alt="Pengenal" style={{ minHeight: '60vh',maxHeight: '60vh',maxWidth: '100%',objectFit: 'contain' }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleHapusPengenal} className='button-delete' style={{ marginRight: '5px' }}>
                        <Trash className='trash-custom' />
                    </Button>
                    <Button variant="success" onClick={handleCloseModalPengenal} className='button-check'>
                        <Check2 className='check2-custom' />
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
}

export default PelatihInput;