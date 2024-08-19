import React,{ useState,useEffect } from 'react';
import { Container,Table,Form,Row,Col,Button } from 'react-bootstrap';
import axios from 'axios';

function JadwalTable()
{

    const [jadwalData,setJadwalData] = useState([]);

    useEffect(() =>
    {
        fetchJadwalData();
    },[]);

    const fetchJadwalData = () =>
    {
        axios
            .get("http://localhost:8000/api/jadwal")
            .then((response) =>
            {
                setJadwalData(response.data.data);
            })
            .catch((error) => console.error("Error fetching data:",error));
    };

    const [sortConfig,setSortConfig] = useState({ key: 'tanggalMulai',direction: 'desc' }); // Default sort by date descending


    const handleSort = (key) =>
    {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc')
        {
            direction = 'desc';
        }

        const sortedData = [...jadwalData].sort((a,b) =>
        {
            if (key === 'biaya')
            {
                return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
            } else
            {
                if (a[key] < b[key])
                {
                    return direction === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key])
                {
                    return direction === 'asc' ? 1 : -1;
                }
                return 0;
            }
        });

        setJadwalData(sortedData);
        setSortConfig({ key,direction });
    };

    // Fungsi untuk menampilkan indikator sorting
    const getSortIndicator = (key) =>
    {
        if (sortConfig.key !== key) return '';
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    return (
        <Container>
            <Form style={{ marginTop: '15px' }}>
                <h2 style={{ marginBottom: '15px' }}>Daftar Jadwal</h2>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} md={2} controlId="filterDivisi">
                        <Form.Select
                        // value={filterDivisi} onChange={e => setFilterDivisi(e.target.value)}
                        >
                            <option value="">Divisi</option>
                            <option value="Sepak Bola">Sepak Bola</option>
                            <option value="Bulu Tangkis">Bulu Tangkis</option>
                            <option value="Bola Voli">Bola Voli</option>
                            <option value="Futsal">Futsal</option>
                            <option value="Beladiri">Bela Diri (Silat)</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={2} controlId="filterJabatan">
                        <Form.Select
                        // value={filterJabatan} onChange={e => setFilterJabatan(e.target.value)}
                        >
                            <option value="">Jabatan</option>
                            <option value="Puspendiv">Puspendiv</option>
                            <option value="Kadiv">Kadiv</option>
                            <option value="Pelatih">Pelatih</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="searchTerm">
                        <Form.Control
                            type="text"
                            placeholder="Search"
                        // value={searchTerm}
                        // onChange={e => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={2}>
                        <Button
                        // onClick={handleClearFilter}
                        // disabled={!filterDivisi && !filterJabatan && !searchTerm}
                        >
                            Clear All
                        </Button>
                    </Form.Group>
                </Row>
                <Table striped bordered hover>
                    <thead>
                        <tr className='text-center'>
                            <th>No</th>
                            <th colSpan={2}>
                                Tanggal
                                <Button
                                    variant="link"
                                    onClick={() => handleSort('tanggalMulai')}
                                    style={{ padding: 0,fontSize: 'inherit',color: 'black',textDecoration: 'underline' }}
                                >
                                    {getSortIndicator('tanggalMulai')}
                                </Button>
                            </th>
                            <th>
                                Kegiatan
                                <Button
                                    variant="link"
                                    onClick={() => handleSort('kegiatan')}
                                    style={{ padding: 0,fontSize: 'inherit',color: 'black',textDecoration: 'underline' }}
                                >
                                    {getSortIndicator('kegiatan')}
                                </Button>
                            </th>
                            <th colSpan={2}>
                                Jam
                                <Button
                                    variant="link"
                                    onClick={() => handleSort('jamMulai')}
                                    style={{ padding: 0,fontSize: 'inherit',color: 'black',textDecoration: 'underline' }}
                                >
                                    {getSortIndicator('jamMulai')}
                                </Button>
                            </th>
                            <th>
                                Lokasi
                                <Button
                                    variant="link"
                                    onClick={() => handleSort('lokasi')}
                                    style={{ padding: 0,fontSize: 'inherit',color: 'black',textDecoration: 'underline' }}
                                >
                                    {getSortIndicator('lokasi')}
                                </Button>
                            </th>
                            <th>
                                Biaya
                                <Button
                                    variant="link"
                                    onClick={() => handleSort('biaya')}
                                    style={{ padding: 0,fontSize: 'inherit',color: 'black',textDecoration: 'underline' }}
                                >
                                    {getSortIndicator('biaya')}
                                </Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {jadwalData.map((item,index) => (
                            <tr key={item.id}>
                                <td className='text-center'>{index + 1}</td>
                                <td className='text-center'>{item.tgl_mulai}</td>
                                <td className='text-center'>{item.tgl_selesai}</td>
                                <td>{item.kegiatan}</td>
                                <td className='text-center'>{item.jam_mulai}</td>
                                <td className='text-center'>{item.jam_selesai}</td>
                                <td>{item.tempat}</td>
                                <td>Rp {item.iuran}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Form>
        </Container>
    );
}

export default JadwalTable;
