import React,{ useState } from 'react';
import { Container,Table,Form,Row,Col } from 'react-bootstrap';

function RiwayatTeam()
{
    // Data riwayat pertandingan dengan kategori
    const [pertandinganData] = useState({
        'Sepak Bola': [
            {
                tanggalMulai: '2024-08-01',
                tanggalSelesai: '2024-08-01',
                kegiatan: 'Turnamen A',
                kategori : 'Senior',
                totalAtlet: 11,
                pelatih: 'Pelatih A',
                hasil: 'Penyisihan',
                action: ''
            },
            {
                tanggalMulai: '2024-08-10',
                tanggalSelesai: '2024-08-10',
                kegiatan: 'Turnamen B',
                kategori : 'Senior',
                totalAtlet: 11,
                pelatih: 'Pelatih B',
                hasil: 'Juara 1',
                action: ''
            }
        ],
        'Bola Voli': [
            {
                tanggalMulai: '2024-08-05',
                tanggalSelesai: '2024-08-05',
                kegiatan: 'Turnamen C',
                kategori : 'Senior',
                totalAtlet: 8,
                pelatih: 'Pelatih C',
                hasil: 'Juara 3',
                action: ''
            },
            {
                tanggalMulai: '2024-08-15',
                tanggalSelesai: '2024-08-15',
                kegiatan: 'Turnamen D',
                kategori : 'Senior',
                totalAtlet: 8,
                pelatih: 'Pelatih D',
                hasil: 'Semifinal',
                action: ''
            }
        ],
        'Bola Basket': [
            {
                tanggalMulai: '2024-08-07',
                tanggalSelesai: '2024-08-07',
                kegiatan: 'Turnamen E',
                kategori : 'Senior',
                totalAtlet: 10,
                pelatih: 'Pelatih E',
                hasil: 'Juara 3',
                action: ''
            },
            {
                tanggalMulai: '2024-08-20',
                tanggalSelesai: '2024-08-20',
                kegiatan: 'Turnamen F',
                kategori : 'Senior',
                totalAtlet: 10,
                pelatih: 'Pelatih F',
                hasil: 'Juara 1',
                action: ''
            }
        ],
        'Bulu Tangkis': [
            {
                tanggalMulai: '2024-08-12',
                tanggalSelesai: '2024-08-12',
                kegiatan: 'Turnamen G',
                kategori : 'Senior',
                totalAtlet: 6,
                pelatih: 'Pelatih G',
                hasil: 'Juara 1',
                action: ''
            },
            {
                tanggalMulai: '2024-08-25',
                tanggalSelesai: '2024-08-25',
                kegiatan: 'Turnamen H',
                kategori : 'Senior',
                totalAtlet: 6,
                pelatih: 'Pelatih H',
                hasil: 'Juara 2',
                action: ''
            }
        ],
        'Futsal': [
            {
                tanggalMulai: '2024-08-03',
                tanggalSelesai: '2024-08-03',
                kegiatan: 'Turnamen I',
                kategori : 'Senior',
                totalAtlet: 12,
                pelatih: 'Pelatih I',
                hasil: 'Penyisihan',
                action: ''
            },
            {
                tanggalMulai: '2024-08-18',
                tanggalSelesai: '2024-08-18',
                kegiatan: 'Turnamen J',
                kategori : 'Senior',
                totalAtlet: 12,
                pelatih: 'Pelatih J',
                hasil: 'Semifinal',
                action: ''
            }
        ],
        'Silat': [
            {
                tanggalMulai: '2024-08-08',
                tanggalSelesai: '2024-08-08',
                kegiatan: 'Turnamen K',
                kategori : 'Senior',
                totalAtlet: 5,
                pelatih: 'Pelatih K',
                hasil: 'Juara 1',
                action: ''
            },
            {
                tanggalMulai: '2024-08-22',
                tanggalSelesai: '2024-08-22',
                kegiatan: 'Turnamen L',
                kategori : 'Senior',
                totalAtlet: 5,
                pelatih: 'Pelatih L',
                hasil: 'Juara 2',
                action: ''
            }
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
                <h2 style={{ marginBottom: '15px' }}>Performa Divisi</h2>
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
                                <th>Tanggal Mulai</th>
                                <th>Tanggal Selesai</th>
                                <th>Kegiatan</th>
                                <th>Kategori</th>
                                <th>Total Atlet</th>
                                <th>Pelatih</th>
                                <th>Hasil</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pertandinganData[selectedDivisi]?.map((pertandingan,index) => (
                                <tr key={index}>
                                    <td className='text-center'>{pertandingan.tanggalMulai}</td>
                                    <td className='text-center'>{pertandingan.tanggalSelesai}</td>
                                    <td>{pertandingan.kegiatan}</td>
                                    <td className='text-center'>{pertandingan.kategori}</td>
                                    <td className='text-center'>{pertandingan.totalAtlet}</td>
                                    <td>{pertandingan.pelatih}</td>
                                    <td>{pertandingan.hasil}</td>
                                    <td>{pertandingan.action}</td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Form>
        </Container>
    );
}

export default RiwayatTeam;
