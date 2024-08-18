import React,{ useState,useRef } from 'react';
import { Container,Form,Button,Row,Col,InputGroup } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import TimePickerCustom from '../ComponentCustom/TimePickerCustom';
import '../../css/button.scss';
import DayCheckBoxCustom from '../ComponentCustom/DayCheckBoxCustom';
import DateTimePicker from 'react-datetime-picker';

function JadwalInput()
{
    const [type,setType] = useState('sekali');
    const [startDate,setStartDate] = useState(null);
    const [endDate,setEndDate] = useState(null);
    const [startTime,setStartTime] = useState(null);
    const [endTime,setEndTime] = useState(null);
    const [isAllDay,setIsAllDay] = useState(false);
    const [isIuran,setIuran] = useState(true);
    const [dayCheckbox,setSelectedDayCheckbox] = useState([]);

    const handleDayCheckboxChange = (dayCheckbox) =>
    {
        setSelectedDayCheckbox(dayCheckbox);
    };

    const handleTypeChange = (event) =>
    {
        setType(event.target.value);
    };

    const handleChangeStartDate = (value) =>
    {
        setStartDate(value);
    };

    const handleChangeEndDate = (value) =>
    {
        setEndDate(value);
    };

    const handleClearStartDate = () =>
    {
        setStartDate(null);
    };

    const handleClearEndDate = () =>
    {
        setEndDate(null);
    };

    const handleChangeStartTime = (value) =>
    {
        setStartTime(value);
    };

    const handleChangeEndTime = (value) =>
    {
        setEndTime(value);
    };

    const handleClearStartTime = () =>
    {
        setStartTime(null);
    };

    const handleClearEndTime = () =>
    {
        setEndTime(null);
    };

    const handleAllDayChange = (event) =>
    {
        setIsAllDay(event.target.checked);
        if (event.target.checked)
        {
            setStartTime(null);
            setEndTime(null);
        }
    };

    const handleIuranChange = (event) =>
    {
        setIuran(event.target.checked);
        if (event.target.checked)
        {
            setStartTime(null);
            setEndTime(null);
        }
    };

    return (
        <Container>
            <Form style={{ marginTop: '15px' }}>
                <h2 style={{ marginBottom: '15px' }}>Tambah Jadwal</h2>
                <Form.Group as={Col} md={6}
                    style={{
                        display: 'flex',
                        alignSelf: 'flex-end',
                        justifyContent: 'space-between',
                        height: 'fit-content',
                        marginBottom: '15px'
                    }}>
                    <Form.Group controlId="seharian">
                        <Form.Check
                            type="checkbox"
                            label="Seharian"
                            checked={isAllDay}
                            onChange={handleAllDayChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="iuran">
                        <Form.Check
                            type="checkbox"
                            label="Iuran"
                            checked={isIuran}
                            onChange={handleIuranChange}
                        />
                    </Form.Group>
                    |
                    <Form.Group controlId="sekali">
                        <Form.Check
                            inline
                            type="radio"
                            label="Sekali"
                            name="type"
                            value="sekali"
                            checked={type === 'sekali'}
                            onChange={handleTypeChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="berulang">
                        <Form.Check
                            inline
                            type="radio"
                            label="Berulang"
                            name="type"
                            value="berulang"
                            checked={type === 'berulang'}
                            onChange={handleTypeChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="berkelanjutan">
                        <Form.Check
                            inline
                            type="radio"
                            label="Berkelanjutan"
                            name="type"
                            value="berkelanjutan"
                            checked={type === 'berkelanjutan'}
                            onChange={handleTypeChange}
                        />
                    </Form.Group>
                </Form.Group>
                <Row style={{ marginBottom: '15px' }}>
                    <Form.Group as={Col} md={3} controlId="divisi">
                        <Form.Label>Divisi</Form.Label>
                        <Form.Select as="select">
                            <option value="">Pilih Divisi</option>
                            <option value="divisi1">Sepak Bola</option>
                            <option value="divisi2">Bulu Tangkis</option>
                            <option value="divisi2">Bola Voli</option>
                            <option value="divisi2">Futsal</option>
                            <option value="divisi3">Bela Diri (Silat)</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="kegiatan">
                        <Form.Label>Jenis Kegiatan</Form.Label>
                        <Form.Select as="select">
                            <option value="">Pilih Jenis Kegiatan</option>
                            <option selected={true} value="latihan">Latihan</option>
                            <option value="sparing">Sparing</option>
                            <option value="funMatch">Fun Match</option>
                            <option value="pertandingan">Pertandingan</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="tempat">
                        <Form.Label>Tempat</Form.Label>
                        <Form.Control type="text" placeholder="Tempat" />
                    </Form.Group>

                </Row>
                <Row style={{ marginBottom: '15px' }}>
                    {type === 'sekali' && (
                        <>
                            <Form.Group as={Col} md={3} controlId="tanggalMulai">
                                <Form.Label>Tanggal</Form.Label>
                                <Form.Group style={{ display: 'flex' }}>
                                    <DateTimePicker
                                        format="dd/MM/yy"
                                        clearIcon={null}
                                        calendarIcon={null}
                                        disableClock={true}
                                        onChange={handleChangeStartDate}
                                        value={startDate}
                                    />
                                    {startDate !== null && (
                                        <Button variant="danger" onClick={handleClearStartDate} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '9px',marginLeft: '5px' }}>
                                            <Trash style={{ width: '18px',height: '16px' }} />
                                        </Button>
                                    )}
                                </Form.Group>
                            </Form.Group>
                        </>
                    )}
                    {type === 'berulang' && (
                        <>
                            <Form.Group as={Col} md={3} controlId="tanggalMulai">
                                <Form.Label>Tanggal Mulai</Form.Label>
                                <Form.Group style={{ display: 'flex' }}>
                                    <DateTimePicker
                                        format="dd/MM/yy"
                                        clearIcon={null}
                                        calendarIcon={null}
                                        disableClock={true}
                                        onChange={handleChangeStartDate}
                                        value={startDate}
                                    />
                                    {startDate !== null && (
                                        <Button variant="danger" onClick={handleClearStartDate} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '9px',marginLeft: '5px' }}>
                                            <Trash style={{ width: '18px',height: '16px' }} />
                                        </Button>
                                    )}
                                </Form.Group>
                            </Form.Group>
                            <Form.Group as={Col} md={2} controlId="hari">
                                <Form.Label>Hari</Form.Label>
                                <DayCheckBoxCustom
                                    value={dayCheckbox}
                                    onChange={handleDayCheckboxChange}
                                />
                            </Form.Group>
                        </>
                    )}
                    {type === 'berkelanjutan' && (
                        <>
                            <Form.Group as={Col} md={3} controlId="tanggalMulai">
                                <Form.Label>Tanggal Mulai</Form.Label>
                                <Form.Group style={{ display: 'flex' }}>
                                    <DateTimePicker
                                        format="dd/MM/yy"
                                        clearIcon={null}
                                        calendarIcon={null}
                                        disableClock={true}
                                        onChange={handleChangeStartDate}
                                        value={startDate}
                                    />
                                    {startDate !== null && (
                                        <Button variant="danger" onClick={handleClearStartDate} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '9px',marginLeft: '5px' }}>
                                            <Trash style={{ width: '18px',height: '16px' }} />
                                        </Button>
                                    )}
                                </Form.Group>
                            </Form.Group>
                            <Form.Group as={Col} md={3} controlId="tanggalSelesai">
                                <Form.Label>Tanggal Selesai</Form.Label>
                                <Form.Group style={{ display: 'flex' }}>
                                    <DateTimePicker
                                        format="dd/MM/yy"
                                        clearIcon={null}
                                        calendarIcon={null}
                                        disableClock={true}
                                        onChange={handleChangeEndDate}
                                        value={endDate}
                                    />
                                    {endDate !== null && (
                                        <Button variant="danger" onClick={handleClearEndDate} style={{ display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '9px',marginLeft: '5px' }}>
                                            <Trash style={{ width: '18px',height: '16px' }} />
                                        </Button>
                                    )}
                                </Form.Group>
                            </Form.Group>
                        </>
                    )}
                    {!isAllDay && (
                        <>
                            <Form.Group as={Col} md={2} controlId="jamMulai">
                                <Form.Label>Jam Mulai</Form.Label>
                                <Form.Group style={{ display: 'flex' }}>
                                    <TimePickerCustom
                                        value={startTime}
                                        format="24h"
                                        onChange={handleChangeStartTime}
                                    />
                                    {startTime !== null && (
                                        <Button variant="danger" onClick={handleClearStartTime} className="button-delete">
                                            <Trash className="trash-custom" />
                                        </Button>
                                    )}
                                </Form.Group>
                            </Form.Group>
                            <Form.Group as={Col} md={2} controlId="jamSelesai">
                                <Form.Label>Jam Selesai</Form.Label>
                                <Form.Group style={{ display: 'flex' }}>
                                    <TimePickerCustom
                                        value={endTime}
                                        format="24h"
                                        onChange={handleChangeEndTime}
                                    />
                                    {endTime !== null && (
                                        <Button variant="danger" onClick={handleClearEndTime} className="button-delete">
                                            <Trash className="trash-custom" />
                                        </Button>
                                    )}
                                </Form.Group>
                            </Form.Group>
                        </>
                    )}
                    {isIuran && (
                        <>
                            <Form.Group as={Col} md={4} controlId="iuran">
                                <Form.Label>Iuran</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>Rp</InputGroup.Text>
                                    <Form.Control type="number" placeholder="Contoh : 10000" />
                                </InputGroup>
                            </Form.Group>
                        </>
                    )}
                </Row>
                <Button variant="primary" type="submit" style={{ width: '30%',margin: '5px 35% 0 35%' }}>
                    Submit
                </Button>
            </Form>
        </Container >
    );
}

export default JadwalInput;
