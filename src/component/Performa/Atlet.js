import React,{ useState,useEffect } from 'react';
import { Container,Table,Form,Row,Col,Button,Card,Modal,Spinner } from 'react-bootstrap';
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
import
{
    SansDivisiDropdown,
    SansLoadOrNotImage,
    SansSortableTable,
    SansSearch,
    SansFormatDate,
    SansButtonEdit,
    SansNotify
} from '../ComponentCustom/SansComps';
import axios from 'axios';

ChartJS.register(RadarController,RadialLinearScale,PointElement,LineElement,Filler,Tooltip,Legend);

function PerformaAtlet()
{
    const currentJabatan = sessionStorage.getItem('jabatan');
    const currentDivisi = sessionStorage.getItem('divisi');
    const currentToken = sessionStorage.getItem('token');

    const [loading,setLoading] = useState(false);
    const [selectedAtlet,setSelectedAtlet] = useState(null);
    const [filter,setFilter] = useState('');
    const [searchTerm,setSearchTerm] = useState('');
    const [filtered,setFiltered] = useState([]);

    const [editedSkills,setEditedSkills] = useState({
        skill_i: 0,
        skill_ii: 0,
        skill_iii: 0,
        skill_iv: 0,
        skill_v: 0,
        skill_vi: 0
    });

    const skillLabels = {
        'Sepak Bola': ['Dribble','Passing','Shoot','Defense','Heading','Goalkeeping'],
        'Bola Voli': ['Servis','Passing','Seting','Smash','Block','Digging'],
        'Bulu Tangkis': ['Smash','Clear','Drop','Serve','Footwork','Defense'],
        'Futsal': ['Dribble','Passing','Shoot','Defense','Goalkeeping','Movement'],
        'Silat': ['Pukulan','Tendangan','Pertahanan','Kuncian','Elakkan','Jatuhan'],
        'Bola Basket': ['Dribble','Passing','Shoot','Defense','Rebound','Assist']
    };

    const [tableData,setTableData] = useState([]);
    const { sortedData,requestSort,getSortIcon } = SansSortableTable({
        data: tableData,
        defaultSort: 'nama',
        type: 'ascending'
    });

    useEffect(() =>
    {
        fetchTableData();
    },[]);

    useEffect(() =>
    {
        filterAndSearchData();
    },[filter,searchTerm,tableData]);

    const fetchTableData = async () =>
    {
        setLoading(true);
        try
        {
            const response = await axios.get('http://localhost:8000/api/performa-atlet',{
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                },
            });

            const formattedData = response.data.data.map(item => ({
                ...item,
                formatted_tgl_lahir: SansFormatDate(item.tgl_lahir),
            }));

            setTableData(formattedData);
            console.log(formattedData);
        } catch (error)
        {
            console.error('Error fetching data:',error);
        } finally
        {
            setLoading(false);
        }
    };

    const filterAndSearchData = () =>
    {
        let filteredData = tableData;

        if (currentDivisi === '-')
        {
            if (filter !== '')
            {
                filteredData = filteredData.filter(item => item.divisi === filter);
            }
        } else
        {
            filteredData = filteredData.filter(item => item.divisi === currentDivisi);
        }

        if (searchTerm)
        {
            const lowerSearch = searchTerm.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.nama.toLowerCase().includes(lowerSearch) ||
                item.tempat_lahir.toLowerCase().includes(lowerSearch) ||
                item.tgl_lahir.toString().includes(searchTerm) ||
                item.jk.toLowerCase().includes(lowerSearch) ||
                item.jurusan.toLowerCase().includes(lowerSearch) ||
                calculateSemester(item.angkatan).toString().includes(searchTerm)
            );
        }

        setFiltered(filteredData);
    };

    const handleClearAll = () =>
    {
        setFilter('');
        setSearchTerm('');
    };

    const calculateSemester = (angkatan) =>
    {
        const currentYear = new Date().getFullYear();
        const yearsElapsed = currentYear - angkatan;
        const currentSemester = yearsElapsed * 2 + 1;

        const isFirstHalfOfYear = new Date().getMonth() < 6;
        return isFirstHalfOfYear ? currentSemester : currentSemester + 1;
    };

    const getRadarData = (atlet) =>
    {
        if (!atlet) return { labels: [],datasets: [] };
        const labels = skillLabels[atlet.divisi] || [];
        const skills = [
            atlet.skill_i || 0,
            atlet.skill_ii || 0,
            atlet.skill_iii || 0,
            atlet.skill_iv || 0,
            atlet.skill_v || 0,
            atlet.skill_vi || 0
        ];

        return {
            labels,
            datasets: [
                {
                    label: 'Skill Set',
                    data: skills,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    display: false,
                    stepSize: 2,
                },
                suggestedMin: 0,
                suggestedMax: 10,
                pointLabels: {
                    font: {
                        size: 12,
                    },
                },
                circular: {
                    display: true,
                    lineWidth: 1,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) =>
                    {
                        return tooltipItem.raw.toString();
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

    //EDIT
    const [showModal,setShowModal] = useState(false);

    const handleSkillChange = (e) =>
    {
        setEditedSkills({
            ...editedSkills,
            [e.target.name]: parseInt(e.target.value)
        });
    };

    const handleRowClick = (atlet) =>
    {
        setSelectedAtlet(atlet);

    };

    const [selectedData,setSelectedData] = useState(null);
    const handleEditClick = (atlet) =>
    {
        setSelectedAtlet(atlet);
        setSelectedData({
            id: atlet.id,
            atlet_id: atlet.id,
        })

        setEditedSkills({
            skill_i: atlet.skill_i || 0,
            skill_ii: atlet.skill_ii || 0,
            skill_iii: atlet.skill_iii || 0,
            skill_iv: atlet.skill_iv || 0,
            skill_v: atlet.skill_v || 0,
            skill_vi: atlet.skill_vi || 0
        });
        setShowModal(true);
        console.log(atlet);
        console.log(editedSkills);
    };

    const handleSaveSkills = async (event) =>
    {
        event.preventDefault();
        setLoading(true);

        try
        {
            console.log(editedSkills)
            const dataToSend = {
                ...editedSkills
            };

            console.log('Upserting record:',dataToSend);

            // Upsert the record using the backend endpoint
            await axios.post(`http://localhost:8000/api/performa-atlet/upsert`,dataToSend,{
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                },
            });

            setSuccessMessage("Data berhasil diperbarui atau ditambahkan");
            setStatus('success');
            setShowNotify(true);
            fetchTableData();
            setShowModal(false);
        } catch (error)
        {
            setErrorMessage("Terjadi Kesalahan");
            setStatus('error');
            setShowNotify(true);
            console.error("Save failed:",error);
            if (error.response)
            {
                console.error("Response data:",error.response.data);
            }
        } finally
        {
            setLoading(false);
        }
    };

    const handleCloseModalEdit = () =>
    {
        setShowModal(false);
    }

    //notify
    const [status,setStatus] = useState(null);
    const [showNotify,setShowNotify] = useState(false);
    const [successMessage,setSuccessMessage] = useState("");
    const [errorMessage,setErrorMessage] = useState("");

    const handleCloseNotify = () =>
    {
        setShowNotify(false);
        setSuccessMessage("");
        setErrorMessage("");
        setTimeout(() =>
        {
            setStatus(null);
        },100);
    };

    return (
        <>
            <Container style={{ backgroundColor: 'whitesmoke',padding: '2%',borderRadius: '10px' }}>
                <Form style={{ marginTop: '15px' }}>
                    <h2 style={{ marginBottom: '15px' }}>Performa Atlet</h2>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} md={2} controlId="filterDivisi">
                            <SansDivisiDropdown
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                required
                                disabled={loading || currentDivisi !== '-'}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <SansSearch
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={2} controlId="clearFilters">
                            <Button onClick={handleClearAll} disabled={loading}>
                                Clear All
                            </Button>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} md={6}>
                            <Table striped bordered hover>
                                <thead>
                                    <tr className='text-center'>
                                        <th>No</th>
                                        <th onClick={() => requestSort('nama')}>
                                            Nama {getSortIcon('nama')}
                                        </th>
                                        <th onClick={() => requestSort('divisi')}>
                                            Divisi {getSortIcon('divisi')}
                                        </th>
                                        <th onClick={() => requestSort('jk')}>
                                            L/P {getSortIcon('jk')}
                                        </th>
                                        {/* <th>Action</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((atlet,index) => (
                                        <tr key={index} onClick={() => handleRowClick(atlet)}>
                                            <td className='text-center'>{index + 1}</td>
                                            <td>{atlet.nama}</td>
                                            <td>{atlet.divisi}</td>
                                            <td className='text-center'>{atlet.jk}</td>
                                            {/* <td>
                                                <SansButtonEdit
                                                    onClick={() => handleEditClick(atlet)}
                                                />
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Form.Group>
                        {selectedAtlet && (
                            <>
                                <Form.Group as={Col} md={3}>
                                    <Card>
                                        <Card.Header centered>
                                            <Row>
                                                <Form.Group as={Col} className='text-center'>
                                                    <SansLoadOrNotImage
                                                        src={selectedAtlet.foto}
                                                        width='60px'
                                                        height='80px'
                                                        shape='square'
                                                    />
                                                </Form.Group>
                                            </Row>
                                        </Card.Header>
                                        <Card.Body>
                                            <Card.Title>{selectedAtlet.nama}</Card.Title>
                                            <Card.Text>
                                                Jurusan: {selectedAtlet.jurusan}<br />
                                                Semester: {calculateSemester(selectedAtlet.angkatan)}<br />
                                                Kategori: {selectedAtlet.kategori ? selectedAtlet.kategori : '-'}<br />
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Form.Group>
                                <Form.Group as={Col} md={3} controlId="athleteRadar">
                                    <Card md={3}>
                                        <Radar
                                            data={getRadarData(selectedAtlet)}
                                            options={radarOptions}
                                            plugins={[valuePlugin]}
                                        />
                                    </Card>
                                </Form.Group>
                            </>
                        )}
                    </Row>
                </Form>
            </Container>

            <Modal show={showModal} onHide={handleCloseModalEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Skills</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveSkills}>
                        <Row>
                            {Object.keys(editedSkills).map((skillKey,index) => (
                                <Col style={{ marginBottom: '10px' }} md={6} key={index}>
                                    <Form.Group controlId={skillKey}>
                                        <Form.Label>
                                            {selectedAtlet && skillLabels[selectedAtlet.divisi][index]}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            max="10"
                                            name={skillKey}
                                            value={editedSkills[skillKey]}
                                            onChange={handleSkillChange}
                                        />
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={handleSaveSkills} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <SansNotify
                show={showNotify}
                onHide={handleCloseNotify}
                status={status}
                onSuccess={successMessage}
                onError={errorMessage}
            />
        </>
    );
}

export default PerformaAtlet;
