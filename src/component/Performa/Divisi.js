import React,{ useEffect,useState } from 'react';
import { Container,Form,Row,Col,Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import
    {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
    } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function PerformaDivisi()
{
    const [divisi,setDivisi] = useState('');
    const [dataChart,setDataChart] = useState([]);
    const [cardData,setCardData] = useState({});

    const dataPerDivisi = {
        'Sepak Bola': {
            January: { latihan: 3,sparing: 4,event: 1,juara1: 0,juara2: 0,juara3: 0 },
            February: { latihan: 2,sparing: 2,event: 1,juara1: 0,juara2: 1,juara3: 0 },
            // Tambahkan data untuk bulan lainnya...
        },
        'Bulu Tangkis': {
            January: { latihan: 4,sparing: 3,event: 2,juara1: 1,juara2: 0,juara3: 0 },
            February: { latihan: 3,sparing: 2,event: 1,juara1: 0,juara2: 1,juara3: 1 },
            // Tambahkan data untuk bulan lainnya...
        },
        // Tambahkan data untuk divisi lainnya...
    };

    useEffect(() =>
    {
        if (divisi)
        {
            const selectedData = dataPerDivisi[divisi] || {};
            const calculatedData = Object.keys(selectedData).map(month =>
            {
                const { latihan,sparing,event,juara1,juara2,juara3 } = selectedData[month];
                const totalPoin = (
                    (latihan * 10) +
                    (sparing * 5) +
                    (event * 5) +
                    (juara1 * 10) +
                    (juara2 * 8) +
                    (juara3 * 5)
                );
                return totalPoin;
            });

            const latestMonth = Object.keys(selectedData)[Object.keys(selectedData).length - 1];
            setCardData(selectedData[latestMonth] || {});

            setDataChart(calculatedData);
        }
    },[divisi]);

    const chartData = {
        labels: ['January','February','March','April','May','June','July'],
        datasets: [
            {
                label: 'Performa Bulanan',
                data: dataChart,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Performa Divisi - ${divisi}`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Container style={{ backgroundColor: 'whitesmoke',padding: '2%',borderRadius: '10px' }}>
            <Form style={{ marginTop: '15px' }}>
                <h2 style={{ marginBottom: '15px' }}>Performa Divisi</h2>
                <Form.Group as={Col} md={2} controlId="filterDivisi" style={{ marginBottom: '15px' }}>
                    <Form.Select onChange={(e) => setDivisi(e.target.value)}>
                        <option value="">Divisi</option>
                        <option value="Sepak Bola">Sepak Bola</option>
                        <option value="Bulu Tangkis">Bulu Tangkis</option>
                        <option value="Bola Voli">Bola Voli</option>
                        <option value="Futsal">Futsal</option>
                        <option value="Beladiri">Bela Diri (Silat)</option>
                    </Form.Select>
                </Form.Group>
                <Row>
                    <Form.Group as={Col} md={9}>
                        <Card md={9}>
                            <Card.Body md={9}>
                                <Bar data={chartData} options={options} />
                            </Card.Body>
                        </Card>
                    </Form.Group>
                    <Form.Group as={Col} md={3}>
                        <Card style={{ marginBottom: '15px' }}>
                            <Card.Body>
                                <h5>Poin Performa</h5>
                                <ul>
                                    <li>Latihan: {cardData.latihan * 10}%</li>
                                    <li>Sparing: {cardData.sparing * 5}%</li>
                                    <li>Event: {cardData.event * 5}%</li>
                                    <li>Juara 1: {cardData.juara1 * 10}%</li>
                                    <li>Juara 2: {cardData.juara2 * 8}%</li>
                                    <li>Juara 3: {cardData.juara3 * 5}%</li>
                                </ul>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <h5>Rangkuman Kegiatan</h5>
                                <ul>
                                    <li>Latihan: {cardData.latihan} kali</li>
                                    <li>Sparing: {cardData.sparing} kali</li>
                                    <li>Event: {cardData.event} kali</li>
                                    <li>Juara 1: {cardData.juara1} kali</li>
                                    <li>Juara 2: {cardData.juara2} kali</li>
                                    <li>Juara 3: {cardData.juara3} kali</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Form.Group>
                </Row>
            </Form>
        </Container>
    );
}

export default PerformaDivisi;
