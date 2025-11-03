import jsPDF from 'jspdf';
import 'jspdf-autotable';
<<<<<<< HEAD
import autoTable from 'jspdf-autotable';

export const JadwalPrint = (data, filter) => {
=======

export const JadwalPrint = (data,filter) =>
{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    const doc = new jsPDF();
    const topMargin = 10;

    // Menyusun teks judul dengan nama divisi
    doc.setFontSize(14);
<<<<<<< HEAD
    doc.setFont('times', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`Jadwal Divisi ${filter}`, 105, topMargin, { align: 'center' });
=======
    doc.setFont('times','bold');
    doc.setTextColor(0,0,0);
    doc.text(`Jadwal Divisi ${filter}`,105,topMargin,{ align: 'center' });
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a

    // Definisi kolom tabel
    const tableColumn = [
        'No',
        'Tanggal',
        'Kegiatan',
        'Jam',
        'Tempat',
        'Iuran'
    ];
    const tableRows = [];

    // Mengisi data tabel
<<<<<<< HEAD
    data.forEach((item, index) => {
=======
    data.forEach((item,index) =>
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        // Menggunakan string kosong jika nilai adalah null
        const tglMulai = item.formatted_tgl_mulai || '';
        const tglSelesai = item.formatted_tgl_selesai || '';
        const jamMulai = item.formatted_jam_mulai || '';
        const jamSelesai = item.formatted_jam_selesai || '';

        const tableData = [
            index + 1,
<<<<<<< HEAD
            tglSelesai ? `${tglMulai} - ${tglSelesai}` : `${tglMulai}`,
            item.kegiatan || '', // Menggunakan string kosong jika nilai adalah null
            `${jamMulai} - ${jamSelesai}`,
            item.tempat || '', // Menggunakan string kosong jika nilai adalah null
            item.iuran ? `Rp${item.iuran}` : 'Rp0' // Jika iuran tidak ada, tampilkan '-'
=======
            `${tglMulai} - ${tglSelesai}`,
            item.kegiatan || '', // Menggunakan string kosong jika nilai adalah null
            `${jamMulai} - ${jamSelesai}`,
            item.tempat || '', // Menggunakan string kosong jika nilai adalah null
            item.iuran ? `Rp ${item.iuran}` : '-' // Jika iuran tidak ada, tampilkan '-'
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        ];
        tableRows.push(tableData);
    });

    // Mengatur header tabel
<<<<<<< HEAD
    autoTable(doc, {
=======
    doc.autoTable({
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        head: [tableColumn],
        body: tableRows,
        startY: topMargin + 20,
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
<<<<<<< HEAD
            0: { halign: 'center', valign: 'middle' },
            1: { halign: 'left', valign: 'middle' },
            2: { halign: 'center', valign: 'middle' },
            3: { halign: 'center', valign: 'middle' },
            4: { halign: 'left', valign: 'middle' },
            5: { halign: 'left', valign: 'middle' },
        },
        cellWidth: 'auto',
        bodyStyles: {
            textColor: [0, 0, 0],
            fontSize: 12,
            font: 'times',
            fontStyle: 'normal',
            cellPadding: [1, 2, 1, 2],
        },
        styles: {
            lineColor: [0, 0, 0], // Mengatur warna border tabel
=======
            0: { halign: 'center',valign: 'middle' },
            1: { halign: 'center',valign: 'middle' },
            2: { halign: 'center',valign: 'middle' },
            3: { halign: 'center',valign: 'middle' },
            4: { halign: 'center',valign: 'middle' },
        },
        cellWidth: 'auto',
        bodyStyles: {
            textColor: [0,0,0],
            fontSize: 12,
            font: 'times',
            fontStyle: 'normal',
            cellPadding: [1,2,1,2],
        },
        styles: {
            lineColor: [0,0,0], // Mengatur warna border tabel
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
            lineWidth: 0.1,
        },
    });

    // Menyusun teks footer
    doc.setFontSize(9);
<<<<<<< HEAD
    doc.setFont('times', 'thin');
    doc.setTextColor(0, 0, 0);
    doc.text('Source: e-kadiv.com', 10, doc.lastAutoTable.finalY + 10);
=======
    doc.setFont('times','thin');
    doc.setTextColor(0,0,0);
    doc.text('Source: e-kadiv.com',10,doc.autoTable.previous.finalY + 10);
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a

    // Menghasilkan PDF blob dan mengembalikan URL objek
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
};
