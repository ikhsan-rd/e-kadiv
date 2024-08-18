import { Container,Table,Form, Row, Col } from 'react-bootstrap';

function PresensiTable()
{

    return (
        <Container>
            <Form style={{ marginTop: '15px' }}>
                <h2 style={{ marginBottom: '15px' }}>Presensi Table</h2>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} md={3} controlId={`filter`}>
                        <Form.Select>
                            <option selected={true} value="">Pilih Filter</option>
                            <option value="latihan">Latihan</option>
                            <option value="sparing">Sparing</option>
                            <option value="funMatch">Fun Match</option>
                            <option value="pertandingan">Pertandingan</option>
                        </Form.Select>
                    </Form.Group>
                </Row>

                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td colSpan={2}>Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </Table>
            </Form>
        </Container>
    );
}

export default PresensiTable;
