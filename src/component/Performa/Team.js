import React,{ useState } from 'react';
import { Container,Table,Form,Row,Col,Button,Card } from 'react-bootstrap';
import { Radar } from 'react-chartjs-2';
import
    {
        Chart as ChartJS,
        RadarController,
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend
    } from 'chart.js';

// Register the components used in the radar chart
ChartJS.register(RadarController,RadialLinearScale,PointElement,LineElement,Filler,Tooltip,Legend);

function PerformaTeam()
{
    // Data atlet
    const [atletData,setAtletData] = useState([
        { id: 1,nama: 'Andi',divisi: 'Sepak Bola',jenisKelamin: 'Laki-laki',skill: { speed: 7,power: 8,passing: 6,dribbling: 7,shooting: 8,defense: 6 } },
        { id: 2,nama: 'Budi',divisi: 'Bola Voli',jenisKelamin: 'Laki-laki',skill: { speed: 6,power: 7,passing: 7,dribbling: 6,shooting: 7,defense: 8 } },
        { id: 3,nama: 'Cindy',divisi: 'Bulu Tangkis',jenisKelamin: 'Perempuan',skill: { speed: 9,power: 6,passing: 8,dribbling: 7,shooting: 6,defense: 7 } },
        { id: 4,nama: 'Dewi',divisi: 'Futsal',jenisKelamin: 'Perempuan',skill: { speed: 8,power: 7,passing: 8,dribbling: 9,shooting: 7,defense: 6 } },
        { id: 5,nama: 'Eko',divisi: 'Beladiri',jenisKelamin: 'Laki-laki',skill: { speed: 7,power: 9,passing: 5,dribbling: 6,shooting: 7,defense: 9 } },
    ]);

    // Data untuk grafik radar
    const [selectedAtlet,setSelectedAtlet] = useState(null);

    // Mengubah data untuk grafik radar berdasarkan atlet yang dipilih
    const getRadarData = (skills) =>
    {
        return {
            labels: ['Speed','Power','Passing','Dribbling','Shooting','Defense'],
            datasets: [
                {
                    label: '', // Empty label to hide it
                    data: [skills.speed,skills.power,skills.passing,skills.dribbling,skills.shooting,skills.defense],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Radar chart background color
                    borderColor: 'rgba(54, 162, 235, 1)', // Radar chart border color
                    borderWidth: 1,
                },
            ],
        };
    };

    // Opsi untuk radar chart
    const radarOptions = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)', // Adjust grid color
                },
                ticks: {
                    display: false, // Hide the ticks
                    stepSize: 2, // Control step size
                },
                suggestedMin: 0,
                suggestedMax: 10,
                pointLabels: {
                    font: {
                        size: 12, // Adjust the font size for point labels
                    },
                },
                circular: {
                    display: true,
                    lineWidth: 1, // Adjust grid line width
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) =>
                    {
                        return tooltipItem.raw.toString(); // Show only value in tooltip
                    },
                },
            },
        },
    };

    const valuePlugin = {
        id: 'valuePlugin',
        afterDatasetsDraw(chart)
        {
            const { ctx,data } = chart;
            const meta = chart.getDatasetMeta(0);

            ctx.save();
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            data.datasets.forEach((dataset) =>
            {
                dataset.data.forEach((point,index) =>
                {
                    const pointMeta = meta.data[index];
                    const pointPosition = pointMeta.getProps(['x','y'],true);
                    const value = dataset.data[index];

                    ctx.fillText(value,pointPosition.x,pointPosition.y - 10); // Adjust as needed
                });
            });

            ctx.restore();
        }
    };

    const handleUpdate = (id) =>
    {
        // Handle the update logic here (e.g., open a modal for editing)
        console.log(`Update atlet with ID: ${id}`);
    };

    return (
        <Container style={{ backgroundColor: 'whitesmoke',padding: '2%',borderRadius: '10px' }}>
            <Form style={{ marginTop: '15px' }}>
                <h2 style={{ marginBottom: '15px' }}>Performa Team</h2>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} md={2} controlId="filterDivisi">
                        <Form.Select>
                            <option value="">Divisi</option>
                            <option value="Sepak Bola">Sepak Bola</option>
                            <option value="Bulu Tangkis">Bulu Tangkis</option>
                            <option value="Bola Voli">Bola Voli</option>
                            <option value="Futsal">Futsal</option>
                            <option value="Beladiri">Bela Diri (Silat)</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="searchTerm">
                        <Form.Control type="text" placeholder="Search" />
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Button>Clear All</Button>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md={8}>
                        <Table striped bordered hover>
                            <thead>
                                <tr className='text-center'>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>Divisi</th>
                                    <th>Jenis Kelamin</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atletData.map((atlet,index) => (
                                    <tr
                                        key={atlet.id}
                                        onClick={() => setSelectedAtlet(atlet)}
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: selectedAtlet?.id === atlet.id ? 'rgba(54, 162, 235, 0.2)' : 'transparent'
                                        }}
                                    >
                                        <td className='text-center'>{index + 1}</td>
                                        <td>{atlet.nama}</td>
                                        <td>{atlet.divisi}</td>
                                        <td>{atlet.jenisKelamin}</td>
                                        <td className='text-center'>
                                            <Button variant="warning" onClick={() => handleUpdate(atlet.id)}>Update</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                        <Card>
                            <Card.Body>
                                {selectedAtlet ? (
                                    <Radar
                                        data={getRadarData(selectedAtlet.skill)}
                                        options={radarOptions}
                                        plugins={[valuePlugin]}
                                    />
                                ) : (
                                    <p>Pilih atlet untuk melihat grafik radar.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Form.Group>
                </Row>
            </Form>
        </Container>
    );
}

export default PerformaTeam;
