<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner, Modal, Container } from 'react-bootstrap';
import { PlusLg, Trash, PencilSquare } from 'react-bootstrap-icons';
import axios from 'axios';
import {
    SansDatePicker,
    SansTimePicker,
    SansMoneyInput,
} from '../ComponentCustom/SansComps';

function PresensiEdit({
    formData,
    setFormData,
    isEditing,
    loading,
    setLoading,
    presensiData,
    jadwalData,
    handleCancelClick,
    setStatus,
    setShowNotify,
    setErrorMessage,
    setSuccessMessage,
    fetchTableData,
}) {
    const currentToken = sessionStorage.getItem('token');

    const [atletList, setAtletList] = useState([]);
    const [filteredAtletListData, setFilteredAtletListData] = useState([]);
    const [atletData, setAtletData] = useState(presensiData || []);
    const [presensiCount, setPresensiCount] = useState(atletData.length);

    const [totalIuran, setTotalIuran] = useState(0);
    const [totalDanaKeluar, setTotalDanaKeluar] = useState(presensiData?.dana_keluar || 0);
    const [sisaIuran, setSisaIuran] = useState(0);
    const [adaDanaKeluar, setAdaDanaKeluar] = useState(!!presensiData?.dana_keluar);

    useEffect(() => {
        if (jadwalData?.divisi) {
            const fetchAtletList = async () => {
                try {
                    const response = await axios.get("http://localhost:8000/api/atlet", {
                        headers: { Authorization: `Bearer ${currentToken}` }
                    });
                    const filteredData = response.data.data.filter(item => item.divisi === jadwalData.divisi);
                    setAtletList([...new Set(filteredData.map(item => item.nama))]);
                    setFilteredAtletListData(filteredData);
                } catch (error) {
                    console.error("Error fetching atlet list:", error);
                }
            };
            fetchAtletList();
        }
    }, [jadwalData?.divisi]);

    useEffect(() => {
        const totalIuranAtlet = atletData.reduce((total, data) => {
            return total + (parseFloat(data.iuran) || 0);
        }, 0);
        setTotalIuran(totalIuranAtlet);
        setSisaIuran(totalIuranAtlet - (parseFloat(totalDanaKeluar) || 0));
    }, [atletData, totalDanaKeluar]);

    const handleAddAtlet = () => {
        setAtletData([...atletData, { nomor: atletData.length + 1, namaAtlet: '', status: '', iuran: 0 }]);
        setPresensiCount(presensiCount + 1);
    };

    const handleAtletDataChange = (index, field, value) => {
        const newAtletData = [...atletData];
        newAtletData[index][field] = value;

        if (field === 'namaAtlet') {
            const atlet = filteredAtletListData.find(item => item.nama === value);
            if (atlet) {
                newAtletData[index]['atlet_id'] = atlet.id;
            }
        }
        setAtletData(newAtletData);
    };

    const handlePresensiRemove = () => {
        if (presensiCount > 1) {
            const newAtletData = [...atletData];
            newAtletData.pop();
            setAtletData(newAtletData);
            setPresensiCount(presensiCount - 1);
        }
    };

    const handleTambahDanaKeluar = () => {
        setAdaDanaKeluar(true);
        // nanti bisa buka modal atau input langsung, sesuai kebutuhan Anda
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedPresensiData = atletData.map((data) => ({
                presensi_id: presensiData.id,
                atlet_id: data.atlet_id,
                status: data.status,
                iuran: data.iuran,
            }));

            await Promise.all(
                updatedPresensiData.map((data) =>
                    axios.put(`http://localhost:8000/api/presensi-atlet/${data.presensi_id}`, data, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${currentToken}`,
                        }
                    })
                )
            );

            setSuccessMessage("Data berhasil diubah");
            setStatus('success');
            setShowNotify(true);
            fetchTableData();
            handleCancelClick();
        } catch (error) {
            setErrorMessage("Terjadi Kesalahan");
            setStatus('error');
            setShowNotify(true);
            console.error("Error updating data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isEditing} onHide={handleCancelClick} centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Edit Presensi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Form style={{ marginTop: '15px' }}>
                        {jadwalData && (
                            <>
                                <Row style={{ marginBottom: '10px' }}>
                                    {jadwalData.divisi && (
                                        <Form.Group as={Col}>
                                            <Form.Label>Divisi</Form.Label>
                                            <Form.Control
                                                value={jadwalData.divisi}
                                                type="text"
                                                disabled={true}
                                            />
                                        </Form.Group>
                                    )}
                                    {jadwalData.kegiatan && (
                                        <Form.Group as={Col}>
                                            <Form.Label>Kegiatan</Form.Label>
                                            <Form.Control
                                                value={jadwalData.kegiatan}
                                                type="text"
                                                disabled={true}
                                            />
                                        </Form.Group>
                                    )}
                                    {jadwalData.tgl_mulai && (
                                        <Form.Group as={Col}>
                                            <Form.Label>Tanggal</Form.Label>
                                            <SansDatePicker
                                                value={jadwalData.tgl_mulai}
                                                disabled={true}
                                            />
                                        </Form.Group>
                                    )}
                                    {(jadwalData.jam_mulai || jadwalData.jam_selesai) && (
                                        <Form.Group as={Col}>
                                            <Form.Label>Jam</Form.Label>
                                            <Form.Group style={{ display: 'flex' }}>
                                                {jadwalData.jam_mulai && (
                                                    <SansTimePicker
                                                        value={jadwalData.jam_mulai}
                                                        disabled={true}
                                                    />
                                                )}
                                                {jadwalData.jam_selesai && (
                                                    <SansTimePicker
                                                        value={jadwalData.jam_selesai}
                                                        disabled={true}
                                                        style={{ marginLeft: '5px' }}
                                                    />
                                                )}
                                            </Form.Group>
                                        </Form.Group>
                                    )}
                                </Row>
                            </>
                        )}

                        {jadwalData && (
                            <>
                                <Row>
                                    <Form.Group as={Col} md={1}>
                                        <Form.Label>No</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} md={4}>
                                        <Form.Label>Nama Atlet</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} md={3}>
                                        <Form.Label>Status</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} md={4}>
                                        <Form.Label>Iuran</Form.Label>
                                    </Form.Group>
                                </Row>
                                {atletData.map((data, index) => (
                                    <Row key={index} style={{ marginBottom: '10px' }}>
                                        <Form.Group as={Col} md={1}>
                                            <Form.Control value={data.nomor} type="text" disabled />
                                        </Form.Group>
                                        <Form.Group as={Col} md={4}>
                                            <Form.Control
                                                list="atletList"
                                                value={data.namaAtlet || ''}
                                                onChange={(e) => handleAtletDataChange(index, 'namaAtlet', e.target.value)}
                                                type="text"
                                                required
                                            />
                                            <datalist id="atletList">
                                                {atletList.map((nama, idx) => (
                                                    <option key={idx} value={nama}>{nama}</option>
                                                ))}
                                            </datalist>
                                        </Form.Group>
                                        <Form.Group as={Col} md={3}>
                                            <Form.Select
                                                value={data.status || ''}
                                                onChange={(e) => handleAtletDataChange(index, 'status', e.target.value)}
                                                required
                                            >
                                                <option value="">Pilih Status</option>
                                                <option value="hadir">Hadir</option>
                                                <option value="terlambat">Terlambat</option>
                                                <option value="sakit">Sakit</option>
                                                <option value="izin">Izin</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group as={Col} md={4}>
                                            <SansMoneyInput
                                                value={data.iuran}
                                                onChange={(e) => handleAtletDataChange(index, 'iuran', e.target.value)}
                                                type="number"
                                            />
                                        </Form.Group>
                                    </Row>
                                ))}
                                <Row as={Col} style={{ marginBottom: '5px' }} className="justify-content-end">
                                    <Form.Group as={Col} md={6} style={{ display: 'flex' }}>
                                        <Button variant="success" onClick={handleAddAtlet} className='button-plus'>
                                            <PlusLg className='pluslg-custom' />
                                        </Button>
                                        {presensiCount > 1 && (
                                            <Button
                                                variant="danger"
                                                onClick={handlePresensiRemove}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '9px',
                                                    width: '38px',
                                                    height: '38px',
                                                    marginLeft: '5px'
                                                }}
                                            >
                                                <Trash style={{ width: '20px', height: '20px' }} />
                                            </Button>
                                        )}
                                    </Form.Group>
                                    <Form.Group as={Col} md={2} style={{ marginTop: '15px' }}>
                                        <Form.Label style={{ marginTop: '5px' }}>Total Iuran :</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} md={4} style={{ marginTop: '15px' }}>
                                        <SansMoneyInput type="text" value={totalIuran} disabled />
                                    </Form.Group>
                                </Row>
                                <Row style={{ marginBottom: '15px' }} className="justify-content-end">
                                    <Form.Group as={Col} md={2}>
                                        <Form.Label style={{ marginTop: '5px' }}>Pengeluaran :</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} md={4} style={{ display: 'flex' }}>
                                        <SansMoneyInput
                                            type="number"
                                            value={totalDanaKeluar}
                                            disabled
                                            style={{ marginRight: '5px' }}
                                        />
                                        <Button
                                            variant={!adaDanaKeluar ? "success" : "primary"}
                                            onClick={handleTambahDanaKeluar}
                                            className='button-plus'
                                        >
                                            {!adaDanaKeluar ? (
                                                <PlusLg className='pluslg-custom' />
                                            ) : (
                                                <PencilSquare className='pluslg-custom' />
                                            )}
                                        </Button>
                                    </Form.Group>
                                </Row>
                                <Row style={{ marginBottom: '15px' }} className="justify-content-end">
                                    <Form.Group as={Col} md={2}>
                                        <Form.Label style={{ marginTop: '5px' }}>Sisa :</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} md={4}>
                                        <SansMoneyInput type="text" value={sisaIuran} disabled />
                                    </Form.Group>
                                </Row>
                            </>
                        )}
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancelClick}>Batal</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PresensiEdit;
=======
// import React,{ useState,useEffect } from 'react';
// import { Container,Form,Button,Row,Col,InputGroup,Modal,Spinner } from 'react-bootstrap';
// import { PlusLg,Trash } from 'react-bootstrap-icons';
// import axios from 'axios';

// function PresensiEdit({
//     formData,
//     setFormData,
//     loading,
//     setLoading,
//     editingRowId,
//     isEditing,

//     handleCancelClick,
//     setStatus,
//     setShowNotify,
//     setErrorMessage,
//     setSuccessMessage,
//     fetchTableData,

// })
// {
//     const currentToken = sessionStorage.getItem('token');

//     const [atletList,setAtletList] = useState([]);
//     const [filteredAtletListData,setFilteredAtletListData] = useState([]);
//     const [atletData,setAtletData] = useState(presensiData || []);
//     const [presensiCount,setPresensiCount] = useState(atletData.length);
//     const [danaKeluar,setDanaKeluar] = useState(null);
//     const [totalIuran,setTotalIuran] = useState(null);

//     useEffect(() =>
//     {
//         if (formData.divisi)
//         {
//             const fetchAtletList = async () =>
//             {
//                 try
//                 {
//                     const response = await axios.get("http:localhost:8000/api/atlet",{
//                         headers: { 'Authorization': `Bearer ${currentToken}` }
//                     });
//                     const filteredData = response.data.data.filter(item => item.divisi === jadwalData.divisi);
//                     setAtletList([...new Set(filteredData.map(item => item.nama))]);
//                     setFilteredAtletListData(filteredData);
//                 } catch (error)
//                 {
//                     console.error("Error fetching atlet list:",error);
//                 }
//             };
//             fetchAtletList();
//         }
//     },[formData.divisi]);

//     useEffect(() =>
//     {
//         const calculateTotalIuran = () =>
//         {
//             const totalIuranAtlet = atletData.reduce((total,data) =>
//             {
//                 return total + (parseFloat(data.iuran) || 0);
//             },0);
//             const totalSetelahPengeluaran = totalIuranAtlet - (parseFloat(danaKeluar) || 0);
//             return totalSetelahPengeluaran;
//         };
//         setTotalIuran(calculateTotalIuran());
//     },[atletData,danaKeluar]);

//     const handleAddAtlet = () =>
//     {
//         setAtletData([...atletData,{ nomor: atletData.length + 1,presensi_id: null,namaAtlet: null,status: null,iuran: 0 }]);
//         setPresensiCount(presensiCount + 1);
//     };

//     const handleAtletDataChange = (index,field,value) =>
//     {
//         const newAtletData = [...atletData];
//         newAtletData[index][field] = value;

//         if (field === 'namaAtlet')
//         {
//             const atlet = filteredAtletListData.find(item => item.nama === value);
//             if (atlet)
//             {
//                 newAtletData[index]['atlet_id'] = atlet.id;
//             }
//         }

//         setAtletData(newAtletData);
//     };

//     const handlePresensiRemove = () =>
//     {
//         if (presensiCount > 1)
//         {
//             const newAtletData = [...atletData];
//             newAtletData.pop();
//             setAtletData(newAtletData);
//             setPresensiCount(presensiCount - 1);
//         }
//     };

//     const handleSubmit = async () =>
//     {
//         setLoading(true);
//         try
//         {
//             //   Simpan data presensi atlet yang sudah diubah
//             if (presensiData.id)
//             {
//                 const updatedPresensiData = atletData.map((data) => ({
//                     presensi_id: presensiData.id,
//                     atlet_id: data.atlet_id,
//                     status: data.status,
//                     iuran: data.iuran,
//                 }));

//                 await Promise.all(
//                     updatedPresensiData.map((data) =>
//                         axios.put(`http:localhost:8000/api/presensi-atlet/${data.presensi_id}`,data,{
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 Authorization: `Bearer ${currentToken}`,
//                             }
//                         })
//                     )
//                 );
//                 console.log("Presensi atlet berhasil diperbarui");
//             }

//             setSuccessMessage("Data berhasil diubah");
//             setStatus('success');
//             setShowNotify(true);
//             fetchTableData();
//             handleCancelClick();
//         } catch (error)
//         {
//             setErrorMessage("Terjadi Kesalahan");
//             setStatus('error');
//             setShowNotify(true);
//             console.error("Error updating data:",error);
//             if (error.response)
//             {
//                 console.error("Response data:",error.response.data);
//             }
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     return (
//         <Modal show={isEditing} onHide={handleCancelClick} centered size='lg'>
//             <Modal.Header closeButton>
//                 <Modal.Title>Edit Presensi</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Container>
//                     <Form>
//                         <Row>
//                             <Form.Group as={Col} md={12}>
//                                 <Form.Label>Jadwal</Form.Label>
//                                 <Form.Control
//                                     value={`${jadwalData.divisi} - ${jadwalData.kegiatan}`}
//                                     type="text"
//                                     disabled
//                                 />
//                             </Form.Group>
//                         </Row>
//                         <Row style={{ marginTop: '10px' }}>
//                             <Form.Group as={Col} md={12}>
//                                 <Form.Label>Dana Keluar</Form.Label>
//                                 <InputGroup>
//                                     <InputGroup.Text>Rp</InputGroup.Text>
//                                     <Form.Control
//                                         type="number"
//                                         value={danaKeluar}
//                                         disabled
//                                     />
//                                 </InputGroup>
//                             </Form.Group>
//                         </Row>
//                         <Row style={{ marginTop: '20px' }}>
//                             {atletData.map((data,index) => (
//                                 <Row key={index} style={{ marginBottom: '10px' }}>
//                                     <Form.Group as={Col} md={1}>
//                                         <Form.Control
//                                             value={data.nomor}
//                                             type="text"
//                                             disabled
//                                         />
//                                     </Form.Group>
//                                     <Form.Group as={Col} md={4}>
//                                         <Form.Control
//                                             list="atletList"
//                                             value={data.namaAtlet || ''}
//                                             onChange={(e) => handleAtletDataChange(index,'namaAtlet',e.target.value)}
//                                             type="text"
//                                             required
//                                         />
//                                         <datalist id="atletList">
//                                             {atletList.map((nama,index) => (
//                                                 <option key={index} value={nama}>{nama}</option>
//                                             ))}
//                                         </datalist>
//                                     </Form.Group>
//                                     <Form.Group as={Col} md={3}>
//                                         <Form.Select
//                                             value={data.status || ''}
//                                             onChange={(e) => handleAtletDataChange(index,'status',e.target.value)}
//                                             required
//                                         >
//                                             <option value="">Pilih Status</option>
//                                             <option value="hadir">Hadir</option>
//                                             <option value="terlambat">Terlambat</option>
//                                             <option value="sakit">Sakit</option>
//                                             <option value="izin">Izin</option>
//                                         </Form.Select>
//                                     </Form.Group>
//                                     <Form.Group as={Col} md={4}>
//                                         <InputGroup>
//                                             <InputGroup.Text>Rp</InputGroup.Text>
//                                             <Form.Control
//                                                 value={data.iuran || null}
//                                                 onChange={(e) => handleAtletDataChange(index,'iuran',e.target.value)}
//                                                 type="number"
//                                             />
//                                         </InputGroup>
//                                     </Form.Group>
//                                 </Row>
//                             ))}
//                         </Row>
//                         <Row as={Col} style={{ marginBottom: '10px' }} className="justify-content-end">
//                             <Button variant="success" onClick={handleAddAtlet} className='button-plus'>
//                                 <PlusLg className='pluslg-custom' />
//                             </Button>
//                             {presensiCount > 1 && (
//                                 <Button variant="danger" onClick={handlePresensiRemove} style={{ marginLeft: '5px' }}>
//                                     <Trash />
//                                 </Button>
//                             )}
//                         </Row>
//                         <Row style={{ marginTop: '10px' }}>
//                             <Form.Group as={Col} md={2}>
//                                 <Form.Label>Total Iuran:</Form.Label>
//                             </Form.Group>
//                             <Form.Group as={Col} md={4}>
//                                 <InputGroup>
//                                     <InputGroup.Text>Rp</InputGroup.Text>
//                                     <Form.Control
//                                         type="text"
//                                         value={totalIuran}
//                                         disabled
//                                     />
//                                 </InputGroup>
//                             </Form.Group>
//                         </Row>
//                     </Form>
//                 </Container>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="primary" type="submit" disabled={loading} style={{ marginLeft: '8px' }}>
//                     {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }

// export default PresensiEdit;
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
