import jsPDF from 'jspdf';
import 'jspdf-autotable';
<<<<<<< HEAD
import autoTable from 'jspdf-autotable';

export const AkunPrint = (data) => {
=======

export const AkunPrint = (data) =>
{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    const doc = new jsPDF();
    const topMargin = 10;

    // Set judul dengan font ukuran 16, tebal, dan warna biru
    doc.setFontSize(16);
<<<<<<< HEAD
    doc.setFont('times', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Data Tabel Akun', 105, topMargin, { align: 'center' });

    const tableColumn = ["No", "Nama", "Username", "Jabatan", "Divisi", "Terakhir Login"];
    const tableRows = [];

    data.forEach((item, index) => {
=======
    doc.setFont('times','bold');
    doc.setTextColor(0,0,0);
    doc.text('Data Tabel Akun',105,topMargin,{ align: 'center' });

    const tableColumn = ["No","Nama","Username","Jabatan","Divisi","Terakhir Login"];
    const tableRows = [];

    data.forEach((item,index) =>
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        const tableData = [
            index + 1,
            item.nama,
            item.nomor_anggota,
            item.jabatan,
            item.divisi,
            item.formatted_last_sign_in || 'Belum Login'
        ];
        tableRows.push(tableData);
    });

<<<<<<< HEAD
    autoTable(doc, {
=======
    doc.autoTable({
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        head: [tableColumn],
        body: tableRows,
        startY: topMargin + 5,
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
            halign: 'center',
            fontSize: 12
        },
        columnStyles: {
<<<<<<< HEAD
            0: { halign: 'center', valign: 'middle' },
            4: { halign: 'center', valign: 'middle' },
=======
            0: { halign: 'center',valign: 'middle' },
            4: { halign: 'center',valign: 'middle' },
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        },
        cellWidth: 'auto',
        bodyStyles: {
            fontSize: 12,
            fontStyle: 'normal',
            cellPadding: 5,
        }
    });

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

    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
};
