import React,{ useState } from 'react';
import { Container,Form,Button,Row,Col,InputGroup,Modal } from 'react-bootstrap';
import { PlusLg,Trash,Search } from 'react-bootstrap-icons';
import DateTimePicker from 'react-datetime-picker';

function PresensiInput()
{
    //Handle Set tanggal
    const [tanggal,setTanggal] = useState(new Date());

    //Handle Hapus Tanggal
    const handleClearTanggal = () =>
    {
        setTanggal(null)
    };

    //Handle Tambah Tanggal
    const handleChangeTanggal = (value) =>
    {
        setTanggal(value)
    };

    //Handle Tambah baris data
    const [presensiCount,setPresensiCount] = useState(1);
    const [atletData,setAtletData] = useState([{ nomor: 1,namaAtlet: null,status: null,iuran: 0 }]);
    const [pengeluaran,setPengeluaran] = useState(0);
    const [idPresensi,setIdPresensi] = useState(null);
    const [idJadwal,setIdJadwal] = useState(null);
    const [showIds,setShowIds] = useState(false);

    //Handle hitung iuran
    const totalIuran = atletData.reduce((total,data) => total + data.iuran,null) - pengeluaran;
    const handleSubmit = (e) =>
    {
        e.preventDefault();
        console.log({
            namaAtlet: atletData.map((data) => data.namaAtlet),
            status: atletData.map((data) => data.status),
            iuran: atletData.map((data) => data.iuran),
            pengeluaran,
            totalIuran,
            idPresensi,
            idJadwal,
        });
    };

    const handleAddAtlet = () =>
    {
        setAtletData([...atletData,
        { nomor: atletData.length + 1,namaAtlet: null,status: null,iuran: 0 }
        ]);
        setPresensiCount(presensiCount + 1);
    };

    const handleAtletDataChange = (index,field,value) =>
    {
        const newAtletData = [...atletData];
        newAtletData[index][field] = value;
        setAtletData(newAtletData);
    };

    const handlePresensiRemove = () =>
    {
        if (presensiCount > 1)
        {
            const newAtletData = [...atletData];
            newAtletData.pop();
            setAtletData(newAtletData);
            setPresensiCount(presensiCount - 1);
        }
    };

    const [showModal,setShowModal] = useState(false);

    const handleAddOutcome = () =>
    {
        setShowModal(true);
    };

    const handleCloseModal = () =>
    {
        setShowModal(false);
    };

    return (
        <>
            <Container>
                {/* Content Form Presensi */}
                <Form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
                    <h2 style={{ marginBottom: '15px' }}>Tambah Presensi</h2>
                    <Row style={{ marginBottom: '10px' }} >
                        <Form.Group as={Col} md={2} controlId="idJadwal" >
                            <Button variant="primary" className='button-search'>
                                <div style={{ marginLeft: '9px',}}>Cari Jadwal</div>
                                <Search className='search-custom'></Search>
                            </Button>
                        </Form.Group>
                    </Row>
                    {showIds && (
                        <Row>
                            <Form.Group as={Col} md={4} controlId="tanggal">
                                <Form.Label for="idPresensiSesi">Tanggal</Form.Label>
                                <Form.Group style={{ display: 'flex' }}>
                                    <DateTimePicker
                                        format="dd/MM/yy"
                                        clearIcon={null}
                                        calendarIcon={null}
                                        disableClock={true}
                                        onChange={handleChangeTanggal}
                                        value={tanggal}
                                    />
                                    {tanggal !== null && (
                                        <Button variant="danger" onClick={handleClearTanggal} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '9px',marginLeft: '5px' }}>
                                            <Trash style={{ width: '18px',height: '16px' }} />
                                        </Button>
                                    )}
                                </Form.Group>
                            </Form.Group>
                            <Form.Group as={Col} md={4} controlId="idPresensi">
                                <Form.Label for="idPresensi">Kegiatan</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={idPresensi}
                                    onChange={(e) => setIdPresensi(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={4} controlId="idJadwal">
                                <Form.Label for="idJadwal">ID Jadwal</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={idJadwal}
                                    onChange={(e) => setIdJadwal(e.target.value)}
                                />
                            </Form.Group>
                        </Row>
                    )}
                    <Row>
                        <Form.Group as={Col} md={1}>
                            <Form.Label>No</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                            <Form.Label>Nama Atlet</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Status</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                            <Form.Label>Iuran</Form.Label>
                        </Form.Group>
                    </Row>
                    {atletData.map((data,index) => (
                        <Row style={{ marginBottom: '5px' }} key={index}>
                            <Form.Group as={Col} md={1} controlId={`nomor-${index}`}>
                                <Form.Control type="text" value={data.nomor} disabled={true} style={{ backgroundColor: '#fff' }} />
                            </Form.Group>
                            <Form.Group as={Col} md={4} controlId={`namaAtlet-${index}`}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nama Atlet"
                                    value={data.namaAtlet}
                                    onChange={(e) => handleAtletDataChange(index,'namaAtlet',e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={3} controlId={`status-${index}`}>
                                <Form.Select
                                    value={data.status}
                                    onChange={(e) => handleAtletDataChange(index,'status',e.target.value)}
                                >
                                    <option value="">Pilih Status</option>
                                    <option value="hadir">Hadir</option>
                                    <option value="terlambat">Terlambat</option>
                                    <option value="sakit">Sakit</option>
                                    <option value="izin">Izin</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md={4} controlId={`iuran-${index}`}>
                                <InputGroup>
                                    <InputGroup.Text>Rp</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        placeholder="Berikan nilai 0"
                                        value={data.iuran}
                                        onChange={(e) => handleAtletDataChange(index,'iuran',parseFloat(e.target.value))}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Row>
                    ))}
                    <Row as={Col} style={{ marginBottom: '5px' }} className="justify-content-end">
                        <Form.Group as={Col} md={6} style={{ display: 'flex' }}>
                            <Button variant="success" onClick={handleAddAtlet} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '6px',width: '38px',height: '38px',marginRight: '5px' }}>
                                <PlusLg style={{ width: '24px',height: '24px' }} />
                            </Button>
                            {presensiCount > 1 && (
                                <Button variant="danger" onClick={handlePresensiRemove} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '9px',width: '38px',height: '38px' }}>
                                    <Trash style={{ width: '18px',height: '16px' }} />
                                </Button>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md={2} style={{ marginTop: '15px' }}>
                            <Form.Label style={{ marginTop: '5px' }} for="pengeluaran">Pengeluaran :</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} md={4} controlId="pengeluaran" style={{ marginTop: '15px' }}>
                            <Button variant="success" onClick={handleAddOutcome} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '6px',width: '38px',height: '38px',marginRight: '5px' }}>
                                <PlusLg style={{ width: '24px',height: '24px' }} />
                            </Button>
                        </Form.Group>
                    </Row>
                    <Row style={{ marginBottom: '15px' }} className="justify-content-end">
                        <Form.Group as={Col} md={2}>
                            <Form.Label style={{ marginTop: '5px' }} for="totalIuran" >Total Iuran :</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} md={4} controlId="totalIuran">
                            <InputGroup>
                                <InputGroup.Text>Rp</InputGroup.Text>
                                <Form.Control type="text" value={totalIuran} disabled={true} />
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Button variant="primary" type="submit" style={{ width: '30%',margin: '5px 35% 0 35%' }}>
                        Submit
                    </Button>
                </Form>
            </Container >

            <Modal show={showModal} onHide={handleCloseModal} size="lg"
                style={{
                    position: 'fixed',
                    marginTop: '10vh',
                    marginRight: '5px',
                }}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Dana Keluar</Modal.Title>
                </Modal.Header>
                <Form
                    style={{
                        margin: '15px',
                    }}>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} md={4} controlId="tanggal">
                            <Form.Label for="tanggal">Tanggal</Form.Label>
                            <Form.Group style={{ display: 'flex' }}>
                                <DateTimePicker
                                    format="dd/mm/yy"
                                    clearIcon={null}
                                    calendarIcon={null}
                                    disableClock={true}
                                    value={tanggal}
                                />
                            </Form.Group>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Sumber Dana</Form.Label>
                            <Form.Group>
                                <Form.Control type="text" value="Iuran" disabled="true"></Form.Control>
                            </Form.Group>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Biaya</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} md={1}>
                            <Form.Label>Qty</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} md={2}>
                            <Form.Label>Satuan</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Total</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Keterangan</Form.Label>
                        </Form.Group>
                    </Row>

                    <Row style={{ marginBottom: '15px' }}>
                        <Form.Group as={Col} md={3}>
                            <InputGroup>
                                <InputGroup.Text>Rp</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md={1}>
                            <Form.Control
                                type="number"
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md={2}>
                            <Form.Select
                                type="text"
                            >
                                <option value="">Pilih</option>
                                <option value="Dana Pengurus">Kg</option>
                                <option value="Iuran">Pcs</option>
                                <option value="Dana Pengurus">lusin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <InputGroup>
                                <InputGroup.Text>Rp</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Control
                                type="text"
                            ></Form.Control>
                        </Form.Group>
                    </Row>
                    <Button variant="primary" type="submit" style={{ width: '30%',margin: '0 35%' }}>
                        Submit
                    </Button>
                </Form>
            </Modal>
        </>
    );
}

export default PresensiInput;