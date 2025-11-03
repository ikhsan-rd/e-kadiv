import jsPDF from 'jspdf';
import 'jspdf-autotable';
<<<<<<< HEAD
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { SansFormatDate, SansFormatDateToDay, SansFormatMoney, SansFormatTime } from '../ComponentCustom/SansComps';

export const PresensiDetailPrint = async (presensiIdPrint) => {
    const currentToken = sessionStorage.getItem('token');

    try {
        // Fetch data presensi
        const presensiResponse = await axios.get(`http://localhost:8000/api/presensi/${presensiIdPrint}`, {
=======
import axios from 'axios';
import { SansFormatDate,SansFormatDateToDay,SansFormatMoney,SansFormatTime } from '../ComponentCustom/SansComps';

export const PresensiDetailPrint = async (presensiIdPrint) =>
{
    const currentToken = sessionStorage.getItem('token');

    try
    {
        // Fetch data presensi
        const presensiResponse = await axios.get(`http://localhost:8000/api/presensi/${presensiIdPrint}`,{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            }
        });

        const presensiData = presensiResponse.data.data;
        const formattedTgl = SansFormatDate(presensiData.tgl);
        const formattedJamMulai = SansFormatTime(presensiData.jam_mulai);
        const formattedJamSelesai = SansFormatTime(presensiData.jam_selesai);
        const formattedDanaMasuk = SansFormatMoney(presensiData.total_dana_masuk);
        const formattedDanaKeluar = SansFormatMoney(presensiData.total_dana_keluar);
        const formattedDatetoday = SansFormatDateToDay(presensiData.tgl);

        const year = new Date(presensiData.tgl).getFullYear();

        // Fetch data presensi atlet
<<<<<<< HEAD
        const presensiAtletResponse = await axios.get(`http://localhost:8000/api/presensi-atlet`, {
=======
        const presensiAtletResponse = await axios.get(`http://localhost:8000/api/presensi-atlet`,{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
            params: {
                presensi_id: presensiIdPrint
            }
        });
        const presensiAtletData = presensiAtletResponse.data.data;

        // Calculate the difference between dana masuk and dana keluar
        const totalDanaMasuk = presensiData.total_dana_masuk || 0;
        const totalDanaKeluar = presensiData.total_dana_keluar || 0;
        const difference = totalDanaMasuk - totalDanaKeluar;
        const formattedDifference = SansFormatMoney(difference);

        // Generate PDF
        const doc = new jsPDF();

        const topMargin = 10;

        // Header
        doc.setFontSize(12);
<<<<<<< HEAD
        doc.setFont('times', 'thin');
        doc.text('Hari/Tanggal', 10, topMargin);
        doc.text(`: ${formattedDatetoday} - ${formattedTgl}`, 45, topMargin);
        doc.text('Jam', 10, topMargin + 5);
        doc.text(`: ${formattedJamMulai} - ${formattedJamSelesai}`, 45, topMargin + 5);
        doc.text('Tempat', 10, topMargin + 10);
        doc.text(`: ${presensiData.tempat}`, 45, topMargin + 10);

        doc.setFontSize(14);
        doc.setFont('times', 'Bold');
        doc.text(`Absen ${presensiData.kegiatan} Divisi ${presensiData.divisi}`, 105, topMargin + 20, { align: 'center' });
        doc.text(`UKM SPORT UNISKA ${year}`, 105, topMargin + 25, { align: 'center' });

        // Table setup
        const tableColumn = ["No", "Nama", "Keterangan", "Iuran"];
        const tableRows = [];

        presensiAtletData.forEach((atlet, index) => {
=======
        doc.setFont('times','thin');
        doc.text('Hari/Tanggal',10,topMargin);
        doc.text(`: ${formattedDatetoday} - ${formattedTgl}`,45,topMargin);
        doc.text('Jam',10,topMargin + 5);
        doc.text(`: ${formattedJamMulai} - ${formattedJamSelesai}`,45,topMargin + 5);
        doc.text('Tempat',10,topMargin + 10);
        doc.text(`: ${presensiData.tempat}`,45,topMargin + 10);

        doc.setFontSize(14);
        doc.setFont('times','Bold');
        doc.text(`Absen ${presensiData.kegiatan} Divisi ${presensiData.divisi}`,105,topMargin + 20,{ align: 'center' });
        doc.text(`UKM SPORT UNISKA ${year}`,105,topMargin + 25,{ align: 'center' });

        // Table setup
        const tableColumn = ["No","Nama","Keterangan","Iuran"];
        const tableRows = [];

        presensiAtletData.forEach((atlet,index) =>
        {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            const atletData = [
                index + 1, // No
                atlet.nama, // Nama atlet
                atlet.status,
                `Rp ${SansFormatMoney(atlet.iuran)}` // Menyimpan format Rp
            ];
            tableRows.push(atletData);
        });

        // Table content
<<<<<<< HEAD
        autoTable(doc, {
=======
        doc.autoTable({
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            head: [tableColumn],
            body: tableRows,
            startY: topMargin + 30,
            theme: 'grid',
<<<<<<< HEAD
            margin: { left: 10, right: 10 },
            headStyles: {
                fillColor: [13, 110, 253],
                textColor: [255, 255, 255],
=======
            margin: { left: 10,right: 10 },
            headStyles: {
                fillColor: [13,110,253],
                textColor: [255,255,255],
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                fontStyle: 'bold',
                font: 'times',
                halign: 'center',
                fontSize: 12
            },
            columnStyles: {
                0: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'left' },
            },
            cellWidth: 'auto',
            bodyStyles: {
<<<<<<< HEAD
                textColor: [0, 0, 0],
                fontSize: 12,
                font: 'times',
                fontStyle: 'normal',
                cellPadding: [1, 2, 1, 2],
            },
            styles: {
                lineColor: [0, 0, 0],
=======
                textColor: [0,0,0],
                fontSize: 12,
                font: 'times',
                fontStyle: 'normal',
                cellPadding: [1,2,1,2],
            },
            styles: {
                lineColor: [0,0,0],
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
                lineWidth: 0.1,
            },
        });

        // Financial details
<<<<<<< HEAD
        doc.setFont('times', 'thin');
=======
        doc.setFont('times','thin');
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        doc.setFontSize(12);
        const startY = doc.lastAutoTable.finalY + 10;

        // Pemasukan
<<<<<<< HEAD
        doc.text('Pemasukan', 130, startY);
        doc.text(':', 155, startY);  // Label rata kiri
        doc.text('Rp', 160, startY);         // Rp rata kiri
        doc.text(`${formattedDanaMasuk}`, 198, startY, { align: 'right' });  // Nominal rata kanan

        // Pengeluaran
        const pengeluaranY = startY + 5;
        doc.text('Pengeluaran', 130, pengeluaranY);  // Label rata kiri
        doc.text(':', 155, pengeluaranY);
        doc.text('Rp', 160, pengeluaranY);           // Rp rata kiri
        doc.text(`${formattedDanaKeluar}`, 198, pengeluaranY, { align: 'right' });  // Nominal rata kanan

        // Garis setelah pengeluaran
        doc.setLineWidth(0.5);
        doc.line(130, pengeluaranY + 2, 198, pengeluaranY + 2); // Garis horizontal

        // Sisa
        const sisaY = pengeluaranY + 6;
        doc.text('Sisa', 130, sisaY);  // Label rata kiri
        doc.text(':', 155, sisaY);
        doc.text('Rp', 160, sisaY);    // Rp rata kiri
        doc.text(`${formattedDifference}`, 198, sisaY, { align: 'right' });  // Nominal rata kanan

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('Source: e-kadiv.com', 10, doc.lastAutoTable.finalY + 30);
=======
        doc.text('Pemasukan',130,startY);
        doc.text(':',155,startY);  // Label rata kiri
        doc.text('Rp',160,startY);         // Rp rata kiri
        doc.text(`${formattedDanaMasuk}`,198,startY,{ align: 'right' });  // Nominal rata kanan

        // Pengeluaran
        const pengeluaranY = startY + 5;
        doc.text('Pengeluaran',130,pengeluaranY);  // Label rata kiri
        doc.text(':',155,pengeluaranY);
        doc.text('Rp',160,pengeluaranY);           // Rp rata kiri
        doc.text(`${formattedDanaKeluar}`,198,pengeluaranY,{ align: 'right' });  // Nominal rata kanan

        // Garis setelah pengeluaran
        doc.setLineWidth(0.5);
        doc.line(130,pengeluaranY + 2,198,pengeluaranY + 2); // Garis horizontal

        // Sisa
        const sisaY = pengeluaranY + 6;
        doc.text('Sisa',130,sisaY);  // Label rata kiri
        doc.text(':',155,sisaY);
        doc.text('Rp',160,sisaY);    // Rp rata kiri
        doc.text(`${formattedDifference}`,198,sisaY,{ align: 'right' });  // Nominal rata kanan

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(0,0,0);
        doc.text('Source: e-kadiv.com',10,doc.autoTable.previous.finalY + 30);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a

        // Save the PDF
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        return url;

<<<<<<< HEAD
    } catch (error) {
        console.error('Error generating PDF:', error);
=======
    } catch (error)
    {
        console.error('Error generating PDF:',error);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        return null;
    }
};
