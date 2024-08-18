import React,{ useState } from 'react';
import { Container,Form,Button,Row,Col,InputGroup } from 'react-bootstrap';
import { PlusLg,Trash } from 'react-bootstrap-icons';
import DateTimePicker from 'react-datetime-picker';
import '../../css/DateTimePicker.scss'
import '../../css/button.scss'

function DanaKeluarInput()
{
    //Handle Date Format
    const [date,setDate] = useState(new Date());

    const handleClearDate = () =>
    {
        setDate(null);
    };

    //Handle Perhitungan Dana dan tambah baris
    const [danaKeluarCount,setDanaKeluarCount] = useState(1);
    const [danaKeluarData,setDanaKeluarData] = useState([
        { nomor: 1,sumberDana: null,keterangan: null,jumlahDana: 0 },
    ]);

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        // Lakukan tindakan yang diperlukan, misalnya mengirim data ke server
        console.log({
            sumberDana: danaKeluarData.map((data) => data.sumberDana),
            keterangan: danaKeluarData.map((data) => data.keterangan),
            jumlahDana: danaKeluarData.map((data) => data.jumlahDana),
        });
    };

    const handleAddDanaKeluar = () =>
    {
        setDanaKeluarData([
            ...danaKeluarData,
            { nomor: danaKeluarData.length + 1,sumberDana: null,keterangan: null,jumlahDana: 0 },
        ]);
        setDanaKeluarCount(danaKeluarCount + 1);
    };

    const handleDanaKeluarDataChange = (index,field,value) =>
    {
        const newDanaKeluarData = [...danaKeluarData];
        newDanaKeluarData[index][field] = value;
        setDanaKeluarData(newDanaKeluarData);
    };

    const handleRemoveDanaKeluar = () =>
    {
        if (danaKeluarCount > 1)
        {
            const newDanaKeluarData = [...danaKeluarData];
            newDanaKeluarData.pop();
            setDanaKeluarData(newDanaKeluarData);
            setDanaKeluarCount(danaKeluarCount - 1);
        }
    };

    return (
        <Container
            style={{
                backgroundColor: 'whitesmoke',
                padding: '2%',
                borderRadius: '10px',
            }}
        >
            {/* Content Form Dana Keluar */}
            <Form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
                <h2 style={{ marginBottom: '15px' }}>Form Dana Keluar</h2>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} md={4} controlId="tanggal">
                        <Form.Label for="tanggal">Tanggal</Form.Label>
                        <Form.Group style={{ display: 'flex' }}>
                            <DateTimePicker
                                format="dd/mm/yy"
                                clearIcon={null}
                                calendarIcon={null}
                                disableClock={true}
                                onChange={setDate}
                                value={date}
                            />
                            {setDate !== null && (
                                <Button variant="danger" onClick={handleClearDate} className='button-delete'>
                                    <Trash className='trash-custom' />
                                </Button>
                            )}
                        </Form.Group>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md={1}>
                        <Form.Label>No</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Sumber Dana</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Biaya</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={1}>
                        <Form.Label>Qty</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Satuan</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Total</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Keterangan</Form.Label>
                    </Form.Group>
                </Row>
                {danaKeluarData.map((data,index) => (
                    <Row style={{ marginBottom: '5px' }} key={index}>
                        <Form.Group as={Col} md={1} controlId={`nomor-${index}`}>
                            <Form.Control type="text" value={data.nomor} disabled={true} style={{ backgroundColor: '#fff' }} />
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId={`sumberDana-${index}`}>
                            <Form.Select
                                type="text"
                                placeholder="Sumber Dana"
                                value={data.sumberDana}
                                onChange={(e) => handleDanaKeluarDataChange(index,'sumberDana',e.target.value)}
                            >
                                <option value="">Pilih</option>
                                <option value="Dana Pengurus">Dana Pengurus</option>
                                <option value="Iuran">Iuran</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId={`keterangan-${index}`}>
                            <Form.Control
                                type="text"
                                placeholder="Biaya"
                                value={data.keterangan}
                                onChange={(e) => handleDanaKeluarDataChange(index,'keterangan',e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md={1} controlId={`keterangan-${index}`}>
                            <Form.Control
                                type="text"
                                placeholder="Qty"
                                value={data.keterangan}
                                onChange={(e) => handleDanaKeluarDataChange(index,'keterangan',e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId={`sumberDana-${index}`}>
                            <Form.Select
                                type="text"
                                placeholder="Sumber Dana"
                                value={data.sumberDana}
                                onChange={(e) => handleDanaKeluarDataChange(index,'sumberDana',e.target.value)}
                            >
                                <option value="">Pilih</option>
                                <option value="Dana Pengurus">Kg</option>
                                <option value="Iuran">Pcs</option>
                                <option value="Dana Pengurus">lusin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId={`jumlahDana-${index}`}>
                            <InputGroup>
                                <InputGroup.Text>Rp</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    placeholder="Jumlah Dana"
                                    value={data.jumlahDana}
                                    onChange={(e) => handleDanaKeluarDataChange(index,'jumlahDana',parseFloat(e.target.value))}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId={`keterangan-${index}`}>
                            <Form.Control
                                type="text"
                                placeholder="Keterangan"
                                value={data.keterangan}
                                onChange={(e) => handleDanaKeluarDataChange(index,'keterangan',e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </Row>
                ))}
                <Row style={{ marginBottom: '5px' }}>
                    <Form.Group as={Col} style={{ display: 'flex' }}>
                        <Button variant="success" onClick={handleAddDanaKeluar} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '6px',marginRight: '5px' }}>
                            <PlusLg style={{ width: '24px',height: '24px' }} />
                        </Button>
                        {danaKeluarCount > 1 && (
                            <Button variant="danger" onClick={handleRemoveDanaKeluar} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '10px 9px' }}>
                                <Trash style={{ width: '18px',height: '16px' }} />
                            </Button>
                        )}
                    </Form.Group>
                </Row>
                <Button variant="primary" type="submit" style={{ width: '30%',margin: '0 35%' }}>
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default DanaKeluarInput;