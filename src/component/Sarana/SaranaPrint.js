import jsPDF from 'jspdf';
import 'jspdf-autotable';
<<<<<<< HEAD
import autoTable from 'jspdf-autotable';

export const SaranaPrint = (data, filter) => {
=======

export const SaranaPrint = (data,filter) =>
{
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
    const doc = new jsPDF();
    const topMargin = 10;

    doc.setFontSize(14);
<<<<<<< HEAD
    doc.setFont('times', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`Sarana dan Prasarana Divisi ${filter}`, 105, topMargin, { align: 'center' });

    const tableColumn = ["No", "Nama", "Jumlah", "Satuan", "Layak", "Tidak Layak", "Ket"];
    const tableRows = [];

    data.forEach((item, index) => {
=======
    doc.setFont('times','bold');
    doc.setTextColor(0,0,0);
    doc.text(`Sarana dan Prasarana Divisi ${filter}`,105,topMargin,{ align: 'center' });

    const tableColumn = ["No","Nama","Jumlah","Satuan","Layak","Tidak Layak","Ket"];
    const tableRows = [];

    data.forEach((item,index) =>
    {
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        const tableData = [
            index + 1,
            item.nama,
            item.jumlah,
            item.satuan,
            item.layak_pakai,
            item.tdk_layak_pakai,
            item.keterangan
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
            font: 'times',
            halign: 'center',
            fontSize: 12
        },
        columnStyles: {
<<<<<<< HEAD
            0: { halign: 'center', valign: 'middle' },
            2: { halign: 'center', valign: 'middle' },
            4: { halign: 'center', valign: 'middle' },
            5: { halign: 'center', valign: 'middle' },
        },
        cellWidth: 'auto',
        bodyStyles: {
            textColor: [0, 0, 0],
            fontSize: 12,
            font: 'times',
            fontStyle: 'normal',
            cellPadding: [1, 2, 1, 2],
=======
            0: { halign: 'center',valign: 'middle' },
            2: { halign: 'center',valign: 'middle' },
            4: { halign: 'center',valign: 'middle' },
            5: { halign: 'center',valign: 'middle' },
        },
        cellWidth: 'auto',
        bodyStyles: {
            textColor: [0,0,0],
            fontSize: 12,
            font: 'times',
            fontStyle: 'normal',
            cellPadding: [1,2,1,2],
>>>>>>> a3483058bf086d0b4f91f4a53307dea9d5b0ce7a
        },
        styles: {
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
        },
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
