import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

export const AtletPrint = (data, filter, calculateSemester) => {
    const doc = new jsPDF();
    const topMargin = 10;

    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`Data Atlet Divisi ${filter}`, 105, topMargin, { align: 'center' });

    const tableColumn = ["No", "Nama", "TTL", "Jurusan", "Semester"];
    const tableRows = [];

    data.forEach((item, index) => {
        const tableData = [
            index + 1,
            item.nama,
            `${item.tempat_lahir}-${item.tgl_lahir}`,
            item.jurusan,
            calculateSemester(item.angkatan),
        ];
        tableRows.push(tableData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: topMargin + 5,
        theme: 'grid',
        margin: { left: 10, right: 10 },
        headStyles: {
            fillColor: [13, 110, 253],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            font: 'times',
            halign: 'center',
            fontSize: 12,
        },
        columnStyles: {
            0: { halign: 'center', valign: 'middle' },
            4: { halign: 'center', valign: 'middle' },
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
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
        },
    });

    doc.setFontSize(9);
    doc.setFont('times', 'thin');
    doc.setTextColor(0, 0, 0);
    doc.text('Source: e-kadiv.com', 10, doc.lastAutoTable.finalY + 10);

    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
};
