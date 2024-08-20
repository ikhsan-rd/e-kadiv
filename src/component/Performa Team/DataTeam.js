import React,{ useState } from 'react';
import { Container,Table,Form,Row,Col,Button } from 'react-bootstrap';

function DataTeam()
{
    // Data riwayat pertandingan dengan kategori
    const [pertandinganData] = useState({
        'Sepak Bola': [
            { tanggal: '2024-08-01',kegiatan: 'Turnamen A',melawan: 'Tim B',atlet: 11,hasil: 'Menang',skor: '2-1' },
            { tanggal: '2024-08-10',kegiatan: 'Turnamen B',melawan: 'Tim C',atlet: 11,hasil: 'Kalah',skor: '0-1' }
        ],
        'Bola Voli': [
            { tanggal: '2024-08-05',kegiatan: 'Turnamen C',melawan: 'Tim D',atlet: 8,hasil: 'Menang',skor: '3-0'},
            { tanggal: '2024-08-15',kegiatan: 'Turnamen D',melawan: 'Tim E',atlet: 8,hasil: 'Kalah',skor: '1-3'}
        ],
        'Bola Basket': [
            { tanggal: '2024-08-07',kegiatan: 'Turnamen E',melawan: 'Tim F',atlet: 10,hasil: 'Menang',skor: '88-75'},
            { tanggal: '2024-08-20',kegiatan: 'Turnamen F',melawan: 'Tim G',atlet: 10,hasil: 'Kalah',skor: '72-80'}
        ],
        'Bulu Tangkis': [
            { tanggal: '2024-08-12',kegiatan: 'Turnamen G',melawan: 'Tim H',atlet: 6,hasil: 'Menang',skor: '2-1'},
            { tanggal: '2024-08-25',kegiatan: 'Turnamen H',melawan: 'Tim I',atlet: 6,hasil: 'Kalah',skor: '1-2'}
        ],
        'Futsal': [
            { tanggal: '2024-08-03',kegiatan: 'Turnamen I',melawan: 'Tim J',atlet: 12,hasil: 'Menang',skor: '4-2'},
            { tanggal: '2024-08-18',kegiatan: 'Turnamen J',melawan: 'Tim K',atlet: 12,hasil: 'Kalah',skor: '3-5'}
        ],
        'Silat': [
            { tanggal: '2024-08-08',kegiatan: 'Turnamen K',melawan: 'Tim L',atlet: 5,hasil: 'Menang',skor: '5-3'},
            { tanggal: '2024-08-22',kegiatan: 'Turnamen L',melawan: 'Tim M',atlet: 5,hasil: 'Kalah',skor: '2-4' }
        ]
    });

    const [selectedDivisi,setSelectedDivisi] = useState('');

    // Handle the division change
    const handleDivisionChange = (event) =>
    {
        setSelectedDivisi(event.target.value);
    };

    return (
        <Container style={{ backgroundColor: 'whitesmoke',padding: '2%',borderRadius: '10px' }}>
            <Form style={{ marginTop: '15px' }}>
                <h2 style={{ marginBottom: '15px' }}>Performa Team</h2>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} md={3} controlId="filterDivisi">
                        <Form.Select onChange={handleDivisionChange}>
                            <option value="">Pilih Divisi</option>
                            <option value="Sepak Bola">Sepak Bola</option>
                            <option value="Bola Voli">Bola Voli</option>
                            <option value="Bola Basket">Bola Basket</option>
                            <option value="Bulu Tangkis">Bulu Tangkis</option>
                            <option value="Futsal">Futsal</option>
                            <option value="Silat">Silat</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                {selectedDivisi && (
                    <Table striped bordered hover>
                        <thead>
                            <tr className='text-center'>
                                <th>Tanggal</th>
                                <th>Kegiatan</th>
                                <th>Melawan</th>
                                <th>Atlet</th>
                                <th>Hasil</th>
                                <th>Skor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pertandinganData[selectedDivisi]?.map((pertandingan,index) => (
                                <tr key={index}>
                                    <td className='text-center'>{pertandingan.tanggal}</td>
                                    <td>{pertandingan.kegiatan}</td>
                                    <td>{pertandingan.melawan}</td>
                                    <td className='text-center'>{pertandingan.atlet}</td>
                                    <td className='text-center'>{pertandingan.hasil}</td>
                                    <td className='text-center'>{pertandingan.skor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Form>
        </Container>
    );
}

export default DataTeam;
