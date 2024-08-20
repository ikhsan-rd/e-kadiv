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
import { PersonCircle } from 'react-bootstrap-icons';

// Register the components used in the radar chart
ChartJS.register(RadarController,RadialLinearScale,PointElement,LineElement,Filler,Tooltip,Legend);

function PerformaAtlet()
{
    // Data atlet dengan 2 atlet per divisi
    const [atletData,setAtletData] = useState({
        'Sepak Bola': [
            { id: 1,nama: 'Andi',divisi: 'Sepak Bola',jenisKelamin: 'Laki-laki',skill: { dribble: 7,passing: 8,shoot: 6,defense: 5,heading: 8,goalkeeping: 4 } },
            { id: 2,nama: 'Budi',divisi: 'Sepak Bola',jenisKelamin: 'Laki-laki',skill: { dribble: 8,passing: 7,shoot: 7,defense: 6,heading: 7,goalkeeping: 5 } }
        ],
        'Bola Voli': [
            { id: 3,nama: 'Cindy',divisi: 'Bola Voli',jenisKelamin: 'Perempuan',skill: { servis: 7,passing: 8,seting: 6,smash: 7,block: 5,digging: 8 } },
            { id: 4,nama: 'Dewi',divisi: 'Bola Voli',jenisKelamin: 'Perempuan',skill: { servis: 6,passing: 7,seting: 7,smash: 6,block: 8,digging: 7 } }
        ],
        'Bulu Tangkis': [
            { id: 5,nama: 'Eko',divisi: 'Bulu Tangkis',jenisKelamin: 'Laki-laki',skill: { smash: 8,clear: 7,drop: 6,serve: 9,footwork: 8,defense: 6 } },
            { id: 6,nama: 'Fani',divisi: 'Bulu Tangkis',jenisKelamin: 'Perempuan',skill: { smash: 7,clear: 8,drop: 7,serve: 6,footwork: 9,defense: 7 } }
        ],
        'Futsal': [
            { id: 7,nama: 'Gina',divisi: 'Futsal',jenisKelamin: 'Perempuan',skill: { dribble: 8,passing: 7,shoot: 6,defense: 8,goalkeeping: 5,movement: 7 } },
            { id: 8,nama: 'Hadi',divisi: 'Futsal',jenisKelamin: 'Laki-laki',skill: { dribble: 7,passing: 8,shoot: 7,defense: 6,goalkeeping: 6,movement: 8 } }
        ],
        'Silat': [
            { id: 9,nama: 'Joni',divisi: 'Silat',jenisKelamin: 'Laki-laki',skill: { pukulan: 7,tendangan: 8,pertahanan: 6,kuncian: 7,elakan: 6,teknikJatuhan: 8 } },
            { id: 10,nama: 'Kiki',divisi: 'Silat',jenisKelamin: 'Perempuan',skill: { pukulan: 6,tendangan: 7,pertahanan: 8,kuncian: 6,elakan: 7,teknikJatuhan: 7 } }
        ],
        'Bola Basket': [
            { id: 11,nama: 'Alex',divisi: 'Bola Basket',jenisKelamin: 'Laki-laki',skill: { dribble: 8,passing: 7,shoot: 9,defense: 8,rebound: 7,assist: 6 } },
            { id: 12,nama: 'Bella',divisi: 'Bola Basket',jenisKelamin: 'Perempuan',skill: { dribble: 7,passing: 8,shoot: 8,defense: 7,rebound: 6,assist: 9 } }
        ]
    });

    const [selectedDivisi,setSelectedDivisi] = useState('');
    const [selectedAtlet,setSelectedAtlet] = useState(null);

    // Mengubah data untuk grafik radar berdasarkan atlet yang dipilih
    const getRadarData = (skills = {}) =>
    {
        const skillLabels = {
            'Sepak Bola': ['Dribble','Passing','Shoot','Defense','Heading','Goalkeeping'],
            'Bola Voli': ['Servis','Passing','Seting','Smash','Block','Digging'],
            'Bulu Tangkis': ['Smash','Clear','Drop','Serve','Footwork','Defense'],
            'Futsal': ['Dribble','Passing','Shoot','Defense','Goalkeeping','Movement'],
            'Silat': ['Pukulan','Tendangan','Pertahanan','Kuncian','Elakkan','Jatuhan'],
            'Bola Basket': ['Dribble','Passing','Shoot','Defense','Rebound','Assist']
        };

        const currentSkills = skillLabels[selectedDivisi] || [];

        return {
            labels: currentSkills,
            datasets: [
                {
                    label: '', // Empty label to hide it
                    data: currentSkills.map(skill => skills[skill.toLowerCase().replace(/\s+/g,'')] || 0),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Radar chart background color
                    borderColor: 'rgba(54, 162, 235, 1)', // Radar chart border color
                    borderWidth: 1,
                }
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

    // Handle the division change
    const handleDivisionChange = (event) =>
    {
        setSelectedDivisi(event.target.value);
        setSelectedAtlet(null); // Reset selected athlete when division changes
    };

    // Handle the image error
    const handleImageError = () =>
    {
        setIsImageLoaded(false);
    };

    // Data untuk foto atlet
    const atletFoto = "handle ambil data foto atlet";
    const [isImageLoaded,setIsImageLoaded] = useState(true);

    return (
        <Container style={{ backgroundColor: 'whitesmoke',padding: '2%',borderRadius: '10px' }}>
            <Form style={{ marginTop: '15px' }}>
                <h2 style={{ marginBottom: '15px' }}>Performa Atlet</h2>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} md={2} controlId="filterDivisi">
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
                    <Form.Group as={Col} md={3} controlId="searchTerm">
                        <Form.Control type="text" placeholder="Search" />
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Button>Clear All</Button>
                    </Form.Group>
                </Row>
                {selectedDivisi && (
                    <Row>
                        <Form.Group as={Col} md={6}>
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
                                    {atletData[selectedDivisi].map((atlet,index) => (
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
                                                <Button variant="warning">Update</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Card>
                                <Card.Body>
                                    <Form.Group as={Col}>
                                        {isImageLoaded ? (
                                            atletFoto ? (
                                                <img
                                                    src={atletFoto}
                                                    alt="User"
                                                    style={{ width: '40px',height: '40px',borderRadius: '50%' }}
                                                    onError={handleImageError}
                                                />
                                            ) : (
                                                <PersonCircle style={{ width: '36px',height: '36px',color: '#dee2e6' }} />
                                            )
                                        ) : (
                                            <PersonCircle style={{ width: '36px',height: '36px',color: '#dee2e6' }} />
                                        )}
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Card>
                                <Card.Body>
                                    <Radar
                                        data={getRadarData(selectedAtlet ? selectedAtlet.skill : {})}
                                        options={radarOptions}
                                        plugins={[valuePlugin]}
                                    />
                                </Card.Body>
                            </Card>
                        </Form.Group>
                    </Row>
                )}
            </Form>
        </Container>
    );
}

export default PerformaAtlet;
