import React,{ useEffect,useState } from 'react';
import { Container,Form,Row,Col,Button,Card } from 'react-bootstrap';
import '../../css/button.scss';
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
    const data = {
        labels: ['January','February','March','April','May','June','July'],
        datasets: [
            {
                label: 'Sample Data',
                data: [12,19,3,5,2,3,7],
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
                text: 'Performa Divisi',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Container style={
            {
                backgroundColor: 'whitesmoke',
                padding: '2%',
                borderRadius: '10px'
            }
        }>
            <Form style={{ marginTop: '15px' }}>
                <h2 style={{ marginBottom: '15px' }}>Performa Divisi</h2>
                <Form.Group as={Col} md={2} controlId="filterDivisi"
                    style={{ marginBottom: '15px' }}>
                    <Form.Select >
                        <option value="">Divisi</option>
                        <option value="Sepak Bola">Sepak Bola</option>
                        <option value="Bulu Tangkis">Bulu Tangkis</option>
                        <option value="Bola Voli">Bola Voli</option>
                        <option value="Futsal">Futsal</option>
                        <option value="Beladiri">Bela Diri (Silat)</option>
                    </Form.Select>
                </Form.Group>
                <Row>
                    <Form.Group as={Col} md={7}>
                        <Card md={7}>
                            <Card.Body>
                                <Bar data={data} options={options} />
                            </Card.Body>
                        </Card>
                    </Form.Group>
                    <Form.Group as={Col} md={5}>
                        <Card>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Form.Group>
                </Row>
            </Form>
        </Container>
    );
}

export default PerformaDivisi;
