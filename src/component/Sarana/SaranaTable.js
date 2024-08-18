import React,{ useState } from 'react';
import { Container,Form,Button,Row,Col } from 'react-bootstrap';
import { PlusLg,Trash } from 'react-bootstrap-icons';
import '../../css/button.scss'

function SaranaTable()
{
    const [saranaCount,setSaranaCount] = useState(1);
    const [saranaData,setSaranaData] = useState([{ nomor: 1,namaSarana: null,jumlah: 0,satuan: null,layakPakai: 0,tidakLayakPakai: 0,keterangan:null }]);

    const handleAddSarana = () =>
    {
        setSaranaData([...saranaData,
        { nomor: saranaData.length + 1,namaSarana: null,jumlah: 0,satuan: null,layakPakai: 0,tidakLayakPakai: 0,keterangan:null }
        ]);
        setSaranaCount(saranaCount + 1);
    };

    const handleSaranaDataChange = (index,field,value) =>
    {
        const newSaranaData = [...saranaData];
        newSaranaData[index][field] = value;
        setSaranaData(newSaranaData);
    };

    const handleSaranaRemove = () =>
    {
        if (saranaCount > 1)
        {
            const newSaranaData = [...saranaData];
            newSaranaData.pop();
            setSaranaData(newSaranaData);
            setSaranaCount(saranaCount - 1);
        }
    };

    return (
        <Container>
            {/* Content Form Sarana */}
            <Form style={{ marginTop: '15px' }}>
                <h2>Data Sarana</h2>
                <Row style={{ marginBottom: '15px' }}>
                    <Form.Group as={Col} md={4} controlId="divisi">
                        <Form.Label>Divisi</Form.Label>
                        <Form.Select as="select">
                            <option value="">Pilih Divisi</option>
                            <option value="divisi1">Sepak Bola</option>
                            <option value="divisi2">Bulu Tangkis</option>
                            <option value="divisi2">Bola Voli</option>
                            <option value="divisi2">Futsal</option>
                            <option value="divisi3">Bela Diri (Silat)</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md={1}>
                        <Form.Label>No</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Nama</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={1}>
                        <Form.Label>Jumlah</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Satuan</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Layak Pakai</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Tidak Layak Pakai</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Form.Label>Keterangan</Form.Label>
                    </Form.Group>
                </Row>
                {saranaData.map((data,index) => (
                    <Row style={{ marginBottom: '5px' }}>
                        <Form.Group as={Col} md={1} controlId={`nomor-${index}`}>
                            <Form.Control type="text" value={data.nomor} disabled={true} style={{ backgroundColor: '#fff' }} />
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId="nama">
                            <Form.Control type="text" placeholder="Nama Sarana"
                                value={data.namaSarana} />
                        </Form.Group>
                        <Form.Group as={Col} md={1} controlId="jumlah">
                            <Form.Control type="number" value={data.jumlah}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId="satuan">
                            <Form.Select
                                value={data.satuan}
                            >
                                <option value="">Pilih</option>
                                <option value="buah">Buah</option>
                                <option value="set">Set</option>
                                <option value="lusin">Lusin</option>
                                <option value="klogram">Kilogram</option>
                                <option value="meter">Meter</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId="layakPakai">
                            <Form.Control type="number" value={data.layakPakai}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId="tidakLayakPakai ">
                            <Form.Control type="number" value={data.tidakLayakPakai}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId="keterangan">
                            <Form.Control type="text" value={data.keterangan} placeholder="Keterangan" />
                        </Form.Group>
                    </Row>
                ))}
                <Row as={Col} style={{ marginBottom: '5px' }}>
                    <Form.Group as={Col} md={1} style={{ display: 'flex' }}>
                        <Button variant="success" onClick={handleAddSarana} className='button-plus'>
                            <PlusLg className='pluslg-custom' />
                        </Button>
                        {saranaCount > 1 && (
                            <Button variant="danger" onClick={handleSaranaRemove} className='button-delete'>
                                <Trash className='trash-custom' />
                            </Button>
                        )}
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
        </Container>
    );
}
export default SaranaTable;