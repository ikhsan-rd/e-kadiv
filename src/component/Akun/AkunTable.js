import React,{ useEffect,useState } from 'react';
import { Table,Container,Form,Row,Col,Button } from 'react-bootstrap';
import '../../css/button.scss';
import axios from "axios";

function AkunTable()
{
  const [akunData,setAkunData] = useState([]);
  // const [filterDivisi,setFilterDivisi] = useState('');
  // const [filterJabatan,setFilterJabatan] = useState('');
  // const [filteredAkuns,setFilteredAkuns] = useState([]);
  // const [searchTerm,setSearchTerm] = useState('');

  const currentJabatan = localStorage.getItem('jabatan');

  useEffect(() =>
  {
    fetchAkunData();
  },[]);

  const fetchAkunData = async () =>
  {
    try
    {
      const response = await axios.get("http://localhost:8000/api/user");
      setAkunData(response.data.data);
    } catch (error)
    {
      console.error("Error fetching data:",error);
      if (error.response)
      {
        console.error("Response data:",error.response.data);
      }
    }
  };

  // useEffect(() =>
  // {
  //   const filtered = akunData
  //     .filter(item => (filterDivisi ? item.divisi === filterDivisi : true))
  //     .filter(item => (filterJabatan ? item.jabatan === filterJabatan : true))
  //     .filter(item => (searchTerm ? item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase()) : true));

  //   setFilteredAkuns(filtered);
  // },[filterDivisi,filterJabatan,searchTerm,akunData]);

  // const handleClearFilter = () =>
  // {
  //   setFilterDivisi('');
  //   setFilterJabatan('');
  //   setSearchTerm(''); // Tambahkan ini untuk menghapus searchTerm juga
  // };

  return (
    <Container>
      <Form style={{ marginTop: '15px' }}>
        <h2 style={{ marginBottom: '15px' }}>Daftar Akun</h2>
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
              <th>Nama</th>
              <th>Username</th>
              <th>Password</th>
              <th>Divisi</th>
              <th>Jabatan</th>
              <th>Foto</th>
              <th>Last Sign In</th>
            </tr>
          </thead>
          <tbody>
            {/* {filteredAkuns.map((item,index) => ( */}
            {akunData.map((item,index) => (
              <tr key={item.id}>
                <td className='text-center'>{index + 1}</td>
                <td>{item.nama}</td>
                <td>{item.id}</td>
                <td>{item.fe_password}</td>
                <td>{item.divisi}</td>
                <td>{item.jabatan}</td>
                <td>
                  {item.foto ? (
                    <img src={item.foto} alt="Foto" style={{ maxWidth: '100px',maxHeight: '100px' }} />
                  ) : (
                    'No Photo'
                  )}
                </td>
                <td>{item.lastSignInTime ? item.lastSignInTime : 'N/A'}</td>
              </tr>
            ))}
            {/* ))} */}
          </tbody>
        </Table>
      </Form>
    </Container>
  );
}

export default AkunTable;
