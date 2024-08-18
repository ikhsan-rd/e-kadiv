import React,{ useState } from 'react';
import { Container,Form,Button,Row,Col,InputGroup } from 'react-bootstrap';
import { PlusLg,Trash } from 'react-bootstrap-icons';
import DateTimePicker from 'react-datetime-picker';
import '../../css/DateTimePicker.scss'
import '../../css/button.scss'


function DanaMasukInput()
{

  //Handle Date Format
  const [date,setDate] = useState(new Date());

  const handleClearDate = () =>
  {
    setDate(null);
  };

  //Handle Perhitungan Dana dan tambah baris
  const [tanggal,setTanggal] = useState(new Date());
  const [danaMasukCount,setDanaMasukCount] = useState(1);
  const [danaMasukData,setDanaMasukData] = useState([
    { nomor: 1,sumberDana: null,disimpanSebagai: null,keterangan: null,jumlahDana: 0 },
  ]);

  const handleSubmit = (e) =>
  {
    e.preventDefault();
    // Lakukan tindakan yang diperlukan, misalnya mengirim data ke server
    console.log({
      sumberDana: danaMasukData.map((data) => data.sumberDana),
      disimpanSebagai: danaMasukData.map((data) => data.disimpanSebagai),
      keterangan: danaMasukData.map((data) => data.keterangan),
      jumlahDana: danaMasukData.map((data) => data.jumlahDana),
    });
  };

  const handleAddDanaMasuk = () =>
  {
    setDanaMasukData([
      ...danaMasukData,
      { nomor: danaMasukData.length + 1,sumberDana: null,disimpanSebagai: null,keterangan: null,jumlahDana: 0 },
    ]);
    setDanaMasukCount(danaMasukCount + 1);
  };

  const handleDanaMasukDataChange = (index,field,value) =>
  {
    const newDanaMasukData = [...danaMasukData];
    newDanaMasukData[index][field] = value;
    setDanaMasukData(newDanaMasukData);
  };

  const handleRemoveDanaMasuk = () =>
  {
    if (danaMasukCount > 1)
    {
      const newDanaMasukData = [...danaMasukData];
      newDanaMasukData.pop();
      setDanaMasukData(newDanaMasukData);
      setDanaMasukCount(danaMasukCount - 1);
    }
  };

  return (
    <Container
      style={{
        backgroundColor: 'whitesmoke',
        padding: '2%',
        borderRadius: '10px',
      }}
    >
      {/* Content Form Dana Masuk */}
      <Form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
        <h2 style={{ marginBottom: '15px' }}>Form Dana Masuk</h2>
        <Row style={{ marginBottom: '10px' }}>
          <Form.Group as={Col} md={4} controlId="tanggal">
            <Form.Label for="tanggal">Tanggal</Form.Label>
            <Form.Group style={{ display: 'flex' }}>
              <DateTimePicker
                format="dd/mm/yy"
                clearIcon={null}
                calendarIcon={null}
                disableClock={true}
                onChange={setDate}
                value={date}
              />
              {setDate !== null && (
                <Button variant="danger" onClick={handleClearDate} className='button-delete'>
                  <Trash className='trash-custom' />
                </Button>
              )}
            </Form.Group>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} md={1}>
            <Form.Label>No</Form.Label>
          </Form.Group>
          <Form.Group as={Col} md={3}>
            <Form.Label>Sumber Dana</Form.Label>
          </Form.Group>
          <Form.Group as={Col} md={2}>
            <Form.Label>Disimpan Sebagai</Form.Label>
          </Form.Group>
          <Form.Group as={Col} md={3}>
            <Form.Label>Jumlah Dana</Form.Label>
          </Form.Group>
          <Form.Group as={Col} md={3}>
            <Form.Label>Keterangan</Form.Label>
          </Form.Group>
        </Row>
        {danaMasukData.map((data,index) => (
          <Row style={{ marginBottom: '5px' }} key={index}>
            <Form.Group as={Col} md={1} controlId={`nomor-${index}`}>
              <Form.Control type="text" value={data.nomor} disabled={true} style={{ backgroundColor: '#fff' }} />
            </Form.Group>
            <Form.Group as={Col} md={3} controlId={`sumberDana-${index}`}>
              <Form.Control
                type="text"
                placeholder="Sumber Dana"
                value={data.sumberDana}
                onChange={(e) => handleDanaMasukDataChange(index,'sumberDana',e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md={2} controlId={`disimpanSebagai-${index}`}>
              <Form.Select
                as="select"
                placeholder="Disimpan Sebagai"
                value={data.disimpanSebagai}
                onChange={(e) => handleDanaMasukDataChange(index,'disimpanSebagai',e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Dana Pengurus">Dana Pengurus</option>
                <option value="Iuran">Iuran</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} md={3} controlId={`jumlahDana-${index}`}>
              <InputGroup>
                <InputGroup.Text>Rp</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Jumlah Dana"
                  value={data.jumlahDana}
                  onChange={(e) => handleDanaMasukDataChange(index,'jumlahDana',parseFloat(e.target.value))}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md={3} controlId={`keterangan-${index}`}>
              <Form.Control
                type="text"
                placeholder="Keterangan"
                value={data.keterangan}
                onChange={(e) => handleDanaMasukDataChange(index,'keterangan',e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Row>
        ))}
        <Row style={{ marginBottom: '5px' }}>
          <Form.Group as={Col} style={{ display: 'flex' }}>
            <Button variant="success" onClick={handleAddDanaMasuk} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '6px',marginRight: '5px' }}>
              <PlusLg style={{ width: '24px',height: '24px' }} />
            </Button>
            {danaMasukCount > 1 && (
              <Button variant="danger" onClick={handleRemoveDanaMasuk} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '9px' }}>
                <Trash style={{ width: '18px',height: '16px' }} />
              </Button>
            )}
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit" style={{ width: '30%',margin: '0 35%' }}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default DanaMasukInput;