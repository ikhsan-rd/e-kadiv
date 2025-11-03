<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, InputGroup, Spinner, Modal, ModalHeader } from 'react-bootstrap';
import { PlusLg, Trash, Search, Pencil, PencilSquare } from 'react-bootstrap-icons';
=======
import React,{ useState,useEffect } from 'react';
import { Container,Form,Button,Row,Col,InputGroup,Spinner,Modal,ModalHeader } from 'react-bootstrap';
import { PlusLg,Trash,Search,Pencil,PencilSquare } from 'react-bootstrap-icons';
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
import PresensiCari from './PresensiCari';
import PresensiDanaKeluar from './PresensiDanaKeluar';
import './../../css/button.scss';
import axios from 'axios';
<<<<<<< HEAD
import {
=======
import
{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    SansDatePicker,
    SansCheckBox,
    SansTimePicker,
    SansNotify,
    SansDateToSend,
    SansButtonDelete,
    SansDeleteModal,
    SansFormatDateFromStamp,
    SansAsk,
    SansMoneyInput,
} from '../ComponentCustom/SansComps';
import DanaKeluarInput from '../Dana/DanaKeluarInput';

<<<<<<< HEAD
function PresensiInput() {
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    const [loading, setLoading] = useState(false);

    // // Initialize form data state
    // const [formDataAtlet,setFormDataAtlet] = useState({
    //     presensi_id: "",
    //     atlet_id: "",
    //     tempat: "",
    //     iuran: null,
    // });

    const [atletList, setAtletList] = useState([]);

    // State untuk Cari Jadwal
    const [showDetail, setShowDetail] = useState(false);
    const [isIuran, setIsIuran] = useState(false);
    const [showJadwalCari, setshowJadwalCari] = useState(false);
    const [sumberDana, setSumberDana] = useState(null);

    const [jadwalData, setJadwalData] = useState(null);
    const [idJadwal, setIdJadwal] = useState(null);
    const [divisi, setDivisi] = useState(null);

    const handleshowJadwalCari = () => setshowJadwalCari(true);
    const handleCloseShowJadwalCari = () => setshowJadwalCari(false);

    const [atletformData, setAtletFormData] = useState([]);
    const [filteredAtletListData, setFilteredAtletListData] = useState([]);
    useEffect(() => {
        if (jadwalData) {
            setShowDetail(true);
            setIdJadwal(jadwalData.id);
            if (jadwalData.tgl_mulai && !jadwalData.tgl_selesai) {
                setSelectedDate(jadwalData.tgl_mulai);
            } else {
                setSelectedDate(null);
            }

            setSumberDana(jadwalData.kegiatan === 'Latihan' ? 'Iuran' : '');
            setDivisi(jadwalData.divisi);
            setIsIuran(!!jadwalData.iuran);

            if (jadwalData.divisi) {
                const fetchAtletList = async () => {
                    setLoading(true);
                    try {
                        const response = await axios.get("http://localhost:8000/api/atlet", {
                            headers: { 'Authorization': `Bearer ${currentToken}` }
                        });

                        const filteredAtletListData = response.data.data.filter(item => item.divisi === jadwalData.divisi);

                        setAtletList([...new Set(filteredAtletListData.map(item => item.nama))]);
                        setFilteredAtletListData(filteredAtletListData);


                        setAtletFormData(filteredAtletListData);
                        console.log('Filtered Data fetched: ', filteredAtletListData);
                    } catch (error) {
                        console.error("Error fetching atlet list:", error);
                    } finally {
                        setLoading(false);
                        console.log(atletList);
                    }
                };

                fetchAtletList();
                handleCalculateIuran();
            }
        }
    }, [jadwalData]);

    const [selectedDate, setSelectedDate] = useState(null);
    const [notChangeDate, setNotChangeDate] = useState(false);

    const handleDateChange = (date) => {
        if (jadwalData && jadwalData.hari) {
            const selectedDay = new Date(date).toLocaleDateString('id-ID', { weekday: 'long' });
            if (selectedDay !== jadwalData.hari) {
                setErrorMessage(`Pilih tanggal di hari ${jadwalData.hari}`);
                setStatus("error");
                setShowNotify(true);
                return;
            }
        }
        const formattedDate = SansDateToSend(date);
        setSelectedDate(formattedDate);
    };

    // Presensi Atlet
    const [presensiCount, setPresensiCount] = useState(1);
    const [atletData, setAtletData] = useState([
        { nomor: 1, presensi_id: null, namaAtlet: null, status: null, iuran: null }
    ]);

    // useEffect to set default values for status and iuran if jadwalData.id is present
    useEffect(() => {
        if (idJadwal) {
            setAtletData((prevAtletData) =>
                prevAtletData.map((atlet) => ({
                    ...atlet, // Spread the existing properties
                    status: 'hadir', // Set default status
                    iuran: jadwalData.iuran // Set default iuran
                }))
            );
        }
    }, [idJadwal, jadwalData]);

    // Function to add a new atlet
    const handleAddAtlet = () => {
        const newAtlet = {
            nomor: atletData.length + 1,
            presensi_id: null,
            namaAtlet: null,
            status: idJadwal ? 'hadir' : null, // Default to 'hadir' if jadwalData.id is present
            iuran: idJadwal ? jadwalData.iuran : null // Default to jadwalData.iuran if present
        };

        setAtletData([...atletData, newAtlet]);
=======
function PresensiInput()
{
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    const [loading,setLoading] = useState(false);

    // // Initialize form data state
    // const [formDataAtlet,setFormDataAtlet] = useState({
    //     presensi_id: "",
    //     atlet_id: "",
    //     tempat: "",
    //     iuran: null,
    // });

    const [atletList,setAtletList] = useState([]);

    // State untuk Cari Jadwal
    const [showDetail,setShowDetail] = useState(false);
    const [isIuran,setIsIuran] = useState(false);
    const [showJadwalCari,setshowJadwalCari] = useState(false);
    const [sumberDana,setSumberDana] = useState(null);

    const [jadwalData,setJadwalData] = useState(null);
    const [idJadwal,setIdJadwal] = useState(null);
    const [divisi,setDivisi] = useState(null);

    const handleshowJadwalCari = () => setshowJadwalCari(true);
    const handleCloseShowJadwalCari = () => setshowJadwalCari(false);

    const [atletformData,setAtletFormData] = useState([]);
    const [filteredAtletListData,setFilteredAtletListData] = useState([]);
    useEffect(() =>
    {
        if (jadwalData)
        {
            setShowDetail(true);
            setIdJadwal(jadwalData.id);
            if (jadwalData.tgl_mulai && !jadwalData.tgl_selesai)
            {
                setSelectedDate(jadwalData.tgl_mulai);
            } else
            {
                setSelectedDate(null);
            }

            setSumberDana(jadwalData.kegiatan === 'Latihan' ? 'Iuran' : '');
            setDivisi(jadwalData.divisi);
            setIsIuran(!!jadwalData.iuran);

            if (jadwalData.divisi)
            {
                const fetchAtletList = async () =>
                {
                    setLoading(true);
                    try
                    {
                        const response = await axios.get("http://localhost:8000/api/atlet",{
                            headers: { 'Authorization': `Bearer ${currentToken}` }
                        });

                        const filteredAtletListData = response.data.data.filter(item => item.divisi === jadwalData.divisi);

                        setAtletList([...new Set(filteredAtletListData.map(item => item.nama))]);
                        setFilteredAtletListData(filteredAtletListData);


                        setAtletFormData(filteredAtletListData);
                        console.log('Filtered Data fetched: ',filteredAtletListData);
                    } catch (error)
                    {
                        console.error("Error fetching atlet list:",error);
                    } finally
                    {
                        setLoading(false);
                        console.log(atletList);
                    }
                };

                fetchAtletList();
                handleCalculateIuran();
            }
        }
    },[jadwalData]);

    const [selectedDate,setSelectedDate] = useState(null);
    const [notChangeDate,setNotChangeDate] = useState(false);

    const handleDateChange = (date) =>
    {
        if (jadwalData && jadwalData.hari)
        {
            const selectedDay = new Date(date).toLocaleDateString('id-ID',{ weekday: 'long' });
            if (selectedDay !== jadwalData.hari)
            {
                setErrorMessage(`Pilih tanggal di hari ${jadwalData.hari}`);
                setStatus("error");
                setShowNotify(true);
                return;
            }
        }
        const formattedDate = SansDateToSend(date);
        setSelectedDate(formattedDate);
    };

    // Presensi Atlet
    const [presensiCount,setPresensiCount] = useState(1);
    const [atletData,setAtletData] = useState([
        { nomor: 1,presensi_id: null,namaAtlet: null,status: null,iuran: null }
    ]);

    // useEffect to set default values for status and iuran if jadwalData.id is present
    useEffect(() =>
    {
        if (idJadwal)
        {
            setAtletData((prevAtletData) =>
                prevAtletData.map((atlet) => ({
                    ...atlet, // Spread the existing properties
                    status: 'hadir', // Set default status
                    iuran: jadwalData.iuran // Set default iuran
                }))
            );
        }
    },[idJadwal,jadwalData]);

    // Function to add a new atlet
    const handleAddAtlet = () =>
    {
        const newAtlet = {
            nomor: atletData.length + 1,
            presensi_id: null,
            namaAtlet: null,
            status: idJadwal ? 'hadir' : null, // Default to 'hadir' if jadwalData.id is present
            iuran: idJadwal ? jadwalData.iuran : null // Default to jadwalData.iuran if present
        };

        setAtletData([...atletData,newAtlet]);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        setPresensiCount(presensiCount + 1);
    };

    // Function to handle changes in atletData fields
<<<<<<< HEAD
    const handleAtletDataChange = (index, field, value) => {
=======
    const handleAtletDataChange = (index,field,value) =>
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        const newAtletData = [...atletData];

        newAtletData[index][field] = value;

<<<<<<< HEAD
        if (field === 'namaAtlet') {
            const atlet = filteredAtletListData.find(item => item.nama === value);
            if (atlet) {
=======
        if (field === 'namaAtlet')
        {
            const atlet = filteredAtletListData.find(item => item.nama === value);
            if (atlet)
            {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                newAtletData[index]['atlet_id'] = atlet.id;
            }
        }

        setAtletData(newAtletData);
    };


    // Fungsi untuk menghapus baris atlet terakhir
<<<<<<< HEAD
    const handlePresensiRemove = () => {
        if (presensiCount > 1) {
=======
    const handlePresensiRemove = () =>
    {
        if (presensiCount > 1)
        {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            const newAtletData = [...atletData];
            newAtletData.pop();
            setAtletData(newAtletData);
            setPresensiCount(presensiCount - 1);
        }
    };

    // Fungsi untuk menghitung total iuran
<<<<<<< HEAD
    const [totalDanaKeluar, setTotalDanaKeluar] = useState(null);
    const [totalIuran, setTotalIuran] = useState(null);
    const [sisaIuran, setSisaIuran] = useState(null);

    const handleCalculateIuran = () => {
        // Calculate total iuran from atletData
        const totalIuranAtlet = atletData.reduce((total, data) => {
            return total + (parseFloat(data.iuran) || 0); // Convert data.iuran to a number, default to 0 if null or NaN
        }, 0);
=======
    const [totalDanaKeluar,setTotalDanaKeluar] = useState(null);
    const [totalIuran,setTotalIuran] = useState(null);
    const [sisaIuran,setSisaIuran] = useState(null);

    const handleCalculateIuran = () =>
    {
        // Calculate total iuran from atletData
        const totalIuranAtlet = atletData.reduce((total,data) =>
        {
            return total + (parseFloat(data.iuran) || 0); // Convert data.iuran to a number, default to 0 if null or NaN
        },0);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a

        // Update the totalIuran state
        setTotalIuran(totalIuranAtlet);

        // Calculate total after deducting expenses
        const totalSetelahPengeluaran = totalIuranAtlet - (parseFloat(totalDanaKeluar) || 0);

        // Set sisaIuran, ensuring that 0 is set if the result is 0
        setSisaIuran(totalSetelahPengeluaran);
    };

<<<<<<< HEAD
    useEffect(() => {
        handleCalculateIuran();
    }, [atletData, totalDanaKeluar]);

    //Show Dana Keluar
    const [showAddDanaKeluar, setShowAddDanaKeluar] = useState(false);

    const [checkedIds, setCheckedIds] = useState([]);
    const [adaDanaKeluar, setAdaDanaKeluar] = useState(false);

    const handleTambahDanaKeluar = () => {

        if (!selectedDate) {
=======
    useEffect(() =>
    {
        handleCalculateIuran();
    },[atletData,totalDanaKeluar]);

    //Show Dana Keluar
    const [showAddDanaKeluar,setShowAddDanaKeluar] = useState(false);

    const [checkedIds,setCheckedIds] = useState([]);
    const [adaDanaKeluar,setAdaDanaKeluar] = useState(false);

    const handleTambahDanaKeluar = () =>
    {

        if (!selectedDate)
        {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            setShowNotify(true);
            setStatus("error");
            setErrorMessage("Masukan Tanggal");
            return;
<<<<<<< HEAD
        } else {
=======
        } else
        {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            setSelectedDate(selectedDate);
            setShowAddDanaKeluar(true);
        }
    }

<<<<<<< HEAD
    const handleCloseDanaKeluar = () => {
=======
    const handleCloseDanaKeluar = () =>
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        setShowAddDanaKeluar(false);
    };

    //submit
    const handleSubmit = async () => {
        setLoading(true);
<<<<<<< HEAD

=======
    
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        try {
            // Data yang akan dikirim ke backend
            const requestData = {
                divisi: jadwalData.divisi,
                sumber_dana: "Iuran",
                tgl: SansDateToSend(selectedDate),
                total: totalIuran,
<<<<<<< HEAD
                status: statusAsk ? 'Y' : null,
                atletData: atletData,
                adaDanaKeluar: adaDanaKeluar,
                checkedIds: checkedIds,
                jadwal_id: idJadwal,
            };

            // Mengirim data ke backend untuk diproses
            const response = await axios.post(
                "http://localhost:8000/api/presensi",
=======
                status: statusAsk ? 'Y' : null, // status untuk presensi
                atletData: atletData, // Data presensi atlet
                adaDanaKeluar: adaDanaKeluar,
                checkedIds: checkedIds, // ID dana keluar yang dipilih
            };
    
            // Mengirim data ke backend untuk diproses
            const response = await axios.post(
                "http://localhost:8000/api/presensi", // Pastikan API endpoint sesuai
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentToken}`,
                    },
                    withCredentials: true,
                }
            );
<<<<<<< HEAD

            // Mengecek jika penyimpanan berhasil
            if (response.data.success) {
                console.log("Semua data berhasil disimpan");

=======
    
            // Mengecek jika penyimpanan berhasil
            if (response.data.success) {
                console.log("Semua data berhasil disimpan");
    
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                // Menampilkan pesan sukses
                setSuccessMessage("Data berhasil ditambahkan");
                setStatus("success");
                setShowNotify(true);
<<<<<<< HEAD

=======
    
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                // Reset form
                resetForm();
            } else {
                throw new Error("Gagal menyimpan data.");
            }
        } catch (error) {
            console.error("Error during submission:", error);
            setErrorMessage(error.message || "Terjadi Kesalahan");
            setStatus("error");
            setShowNotify(true);
        } finally {
            setLoading(false);
        }
    };
<<<<<<< HEAD



    // Fungsi untuk mereset form setelah submit berhasil
    const resetForm = () => {
        setAtletData([{ nomor: 1, presensi_id: null, namaAtlet: null, status: null, iuran: null }]);
=======
    


    // Fungsi untuk mereset form setelah submit berhasil
    const resetForm = () =>
    {
        setAtletData([{ nomor: 1,presensi_id: null,namaAtlet: null,status: null,iuran: null }]);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        setPresensiCount(1);
        setIdJadwal(null);
        setJadwalData(null);
        setShowDetail(false);
        setIsIuran(false);
        setTotalDanaKeluar(null);
        setSelectedDate(null);
    };

    //ask
<<<<<<< HEAD
    const [showAsk, setShowAsk] = useState(false);
    const [statusAsk, setStatusAsk] = useState(false);

    const handleConfirmationSubmit = () => {
        // Validasi semua data atlet
        const isAtletDataValid = atletData.every((data) => {
=======
    const [showAsk,setShowAsk] = useState(false);
    const [statusAsk,setStatusAsk] = useState(false);

    const handleConfirmationSubmit = () =>
    {
        // Validasi semua data atlet
        const isAtletDataValid = atletData.every((data) =>
        {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            return (
                data.namaAtlet && // Check that namaAtlet is not null or empty
                data.status // Check that status is not null or empty
            );
        });

        // Validasi input

<<<<<<< HEAD
        if (!isAtletDataValid) {
=======
        if (!isAtletDataValid)
        {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            setErrorMessage('Lengkapi semua data atlet');
            setStatus('error');
            setShowNotify(true);
            return;
        }

<<<<<<< HEAD
        if (!selectedDate) {
=======
        if (!selectedDate)
        {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            setErrorMessage('Lengkapi Tanggal');
            setStatus('error');
            setShowNotify(true);
            return;
        }

        setShowAsk(true);
        console.log(statusAsk)
    }
<<<<<<< HEAD
    const handleCloseAsk = () => {
        setShowAsk(false);
    }
    const handleClickOne = () => {
=======
    const handleCloseAsk = () =>
    {
        setShowAsk(false);
    }
    const handleClickOne = () =>
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        setStatusAsk(true);
        setShowAsk(false);
        handleSubmit();
        handleCloseAsk();
    }
<<<<<<< HEAD
    const handleClickTwo = () => {
=======
    const handleClickTwo = () =>
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        setStatusAsk(false);
        setShowAsk(false);
        handleSubmit();
        handleCloseAsk();
    }


    // Notify state
<<<<<<< HEAD
    const [status, setStatus] = useState(null);
    const [showNotify, setShowNotify] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleCloseNotify = () => {
        setShowNotify(false);
        if (errorMessage === 'Terjadi Kesalahan, coba ulang') {
=======
    const [status,setStatus] = useState(null);
    const [showNotify,setShowNotify] = useState(false);
    const [successMessage,setSuccessMessage] = useState("");
    const [errorMessage,setErrorMessage] = useState("");

    const handleCloseNotify = () =>
    {
        setShowNotify(false);
        if (errorMessage === 'Terjadi Kesalahan, coba ulang')
        {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            setShowAddDanaKeluar();
            setIdJadwal(null);
            setJadwalData(null);
            setIsIuran(false);
            setShowDetail(false);
        }

<<<<<<< HEAD
        if (successMessage === 'Dana Keluar berhasil ditambahkan') {
            setNotChangeDate(true);
        } else {
=======
        if (successMessage === 'Dana Keluar berhasil ditambahkan')
        {
            setNotChangeDate(true);
        } else
        {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            setNotChangeDate(false);
        }

        setSuccessMessage("");
        setErrorMessage("");
<<<<<<< HEAD
        setTimeout(() => {
            setStatus(null);
        }, 100);
=======
        setTimeout(() =>
        {
            setStatus(null);
        },100);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a

    };

    return (
        <>
            <Container>
                <Form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
                    <h2 style={{ marginBottom: '15px' }}>Tambah Presensi</h2>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} style={{ display: 'flex' }}>
                            <Button
                                variant="primary"
                                className='button-search'
                                onClick={handleshowJadwalCari}
                            >
<<<<<<< HEAD
                                <div style={{ marginLeft: '9px', }}>{idJadwal ? 'Ganti Jadwal' : 'Cari Jadwal'}</div>
=======
                                <div style={{ marginLeft: '9px',}}>{idJadwal ? 'Ganti Jadwal' : 'Cari Jadwal'}</div>
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                                <Search className='search-custom'></Search>
                            </Button>
                            <Form.Group style={{ margin: '6px 0 0 15px' }}>
                                <SansCheckBox
                                    isChecked={showDetail}
                                    label='Detail Jadwal'
                                    onChange={(e) => setShowDetail(e.target.checked)}
                                />
                            </Form.Group>
                            {isIuran && (
                                <Form.Group style={{ margin: '6px 0 0 15px' }}>
                                    <SansCheckBox
                                        isChecked={isIuran}
                                        label='Iuran'
                                        onChange={(e) => setIsIuran(e.target.checked)}
                                    />
                                </Form.Group>
                            )}
                        </Form.Group>
                    </Row>
                    {showDetail && jadwalData && (
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
                                {(jadwalData.tgl_mulai && !jadwalData.tgl_selesai) && (
                                    <Form.Group as={Col}>
                                        <Form.Label>Tanggal</Form.Label>
                                        <SansDatePicker
                                            value={selectedDate}
                                            disabled={true}
                                        />
                                    </Form.Group>
                                )}

                                {(jadwalData.tgl_mulai && jadwalData.tgl_selesai) && (
                                    <Form.Group as={Col}>
                                        <Form.Label>Tanggal</Form.Label>
                                        <SansDatePicker
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            minDate={new Date(jadwalData.tgl_mulai)}
                                            maxDate={new Date(jadwalData.tgl_selesai)}
<<<<<<< HEAD
                                            onClear={() => setSelectedDate(null)}
=======
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                                        />
                                    </Form.Group>
                                )}

                                {jadwalData.hari && (
                                    <Form.Group as={Col}>
                                        <Form.Label>Tanggal</Form.Label>
                                        <SansDatePicker
                                            value={selectedDate}
                                            onChange={handleDateChange}
<<<<<<< HEAD
                                            onClear={() => setSelectedDate(null)}
=======
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
                                {isIuran && (
                                    <Form.Group as={Col}>
                                        <Form.Label>Iuran</Form.Label>
                                        <SansMoneyInput
                                            type="number"
                                            name="iuran"
                                            value={jadwalData.iuran}
                                            disabled={isIuran}
                                            required={true}
                                        />
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
                            {/* Form Tambah Atlet */}
<<<<<<< HEAD
                            {atletData.map((data, index) => (
=======
                            {atletData.map((data,index) => (
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                                <Row key={index} style={{ marginBottom: '10px' }}>
                                    <Form.Group as={Col} md={1}>
                                        <Form.Control
                                            value={data.nomor}
                                            type="text"
                                            disabled={true}
                                            required={true}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md={4}>
                                        <Form.Control
                                            list="atletList"
                                            value={data.namaAtlet || ''}
<<<<<<< HEAD
                                            onChange={(e) => handleAtletDataChange(index, 'namaAtlet', e.target.value)}
=======
                                            onChange={(e) => handleAtletDataChange(index,'namaAtlet',e.target.value)}
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                                            type="text"
                                            required={true}
                                        />
                                        <datalist id="atletList">
<<<<<<< HEAD
                                            {atletList.map((nama, index) => (
=======
                                            {atletList.map((nama,index) => (
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                                                <option key={index} value={nama}>{nama}</option>
                                            ))}
                                        </datalist>
                                    </Form.Group>
                                    <Form.Group as={Col} md={3}>
                                        <Form.Select
                                            value={data.status || ''}
<<<<<<< HEAD
                                            onChange={(e) => handleAtletDataChange(index, 'status', e.target.value)}
=======
                                            onChange={(e) => handleAtletDataChange(index,'status',e.target.value)}
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
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
<<<<<<< HEAD
                                            onChange={(e) => handleAtletDataChange(index, 'iuran', e.target.value)}
=======
                                            onChange={(e) => handleAtletDataChange(index,'iuran',e.target.value)}
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                                            type="number"
                                            disabled={!isIuran}
                                        />
                                    </Form.Group>
                                </Row>
                            ))}
                            <Row as={Col} style={{ marginBottom: '5px' }} className="justify-content-end">
                                <Form.Group as={Col} md={6} style={{ display: 'flex' }}>
                                    <Button
                                        variant="success"
                                        onClick={handleAddAtlet}
                                        className='button-plus'>
                                        <PlusLg className='pluslg-custom' />
                                    </Button>
                                    {presensiCount > 1 && (
                                        <Button variant="danger" onClick={handlePresensiRemove}
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
<<<<<<< HEAD
                                            <Trash style={{ width: '20px', height: '20px' }} />
=======
                                            <Trash style={{ width: '20px',height: '20px' }} />
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                                        </Button>
                                    )}
                                </Form.Group>
                                <Form.Group as={Col} md={2} style={{ marginTop: '15px' }}>
                                    <Form.Label
                                        style={{ marginTop: '5px' }}
                                        for="totalIuran"
                                    >
                                        Total Iuran :
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group as={Col} md={4} style={{ marginTop: '15px' }}>
                                    <SansMoneyInput
                                        type="text"
                                        value={totalIuran ? totalIuran : 0}
                                        disabled={true}
                                    />
                                </Form.Group>
                            </Row>
                            <Row style={{ marginBottom: '15px' }} className="justify-content-end">
                                <Form.Group as={Col} md={2}>
                                    <Form.Label
                                        style={{ marginTop: '5px' }}
                                        for="pengeluaran"
                                    >
                                        Pengeluaran :
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group as={Col} md={4} style={{ display: 'flex' }}>
                                    <SansMoneyInput
                                        type="number"
                                        value={totalDanaKeluar ? totalDanaKeluar : 0}
                                        disabled={true}
                                        style={{ marginRight: '5px' }}
                                    />

                                    <Button
                                        variant={!adaDanaKeluar ? "success" : "primary"}
                                        onClick={handleTambahDanaKeluar}
                                        className='button-plus'>
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
                                    <Form.Label
                                        style={{ marginTop: '5px' }}
                                        for="totalIuran"
                                    >
                                        Sisa :
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <SansMoneyInput
                                        type="text"
                                        value={sisaIuran}
                                        disabled={true}
                                    />
                                </Form.Group>
                            </Row>
                            <Form.Group>
                                <Button
                                    variant="primary"
                                    onClick={handleConfirmationSubmit}
                                    disabled={loading}
<<<<<<< HEAD
                                    style={{ width: "30%", margin: "5px 35% 0 35%" }}
=======
                                    style={{ width: "30%",margin: "5px 35% 0 35%" }}
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                                >
                                    {loading ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : 'Submit'}
                                </Button>
                            </Form.Group>
                        </>
                    )}
                </Form>
            </Container >

            <Modal show={showAddDanaKeluar} onHide={handleCloseDanaKeluar} style={{ borderRadius: '5px' }} size='xl' centered>
                <ModalHeader closeButton>
                    <Modal.Title>Cari Dana Keluar</Modal.Title>
                </ModalHeader>
                <Modal.Body>
                    <PresensiDanaKeluar
                        adaDanaKeluar={adaDanaKeluar}
                        setAdaDanaKeluar={setAdaDanaKeluar}
                        totalDanaKeluar={totalDanaKeluar}
                        setTotalDanaKeluar={setTotalDanaKeluar}
                        checkedIds={checkedIds}
                        setCheckedIds={setCheckedIds}

                        jadwalData={jadwalData}
                        selectedDate={selectedDate}

                        handleCloseDanaKeluar={handleCloseDanaKeluar}
                    />
                </Modal.Body>
            </Modal>

            <PresensiCari
                show={showJadwalCari}
                handleClose={handleCloseShowJadwalCari}
                setJadwalData={setJadwalData}
            />

            <SansAsk
                show={showAsk}
                onHide={handleCloseAsk}
                question='Apakah nanti ada presensi tambahan pada jadwal ini?'
                onClickOne={handleClickOne}
                onClickTwo={handleClickTwo}
                textOne='Tidak'
                textTwo='Ada'
            //One = jadwal akan disembunyikan karena status menjadi Y (done)
            //Two = sebaliknya
            />

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

export default PresensiInput;