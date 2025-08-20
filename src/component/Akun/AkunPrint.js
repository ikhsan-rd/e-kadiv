import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const AkunPrint = (data) =>
{
    const doc = new jsPDF();
    const topMargin = 10;

    // Set judul dengan font ukuran 16, tebal, dan warna biru
    doc.setFontSize(16);
    doc.setFont('times','bold');
    doc.setTextColor(0,0,0);
    doc.text('Data Tabel Akun',105,topMargin,{ align: 'center' });

    const tableColumn = ["No","Nama","Username","Jabatan","Divisi","Terakhir Login"];
    const tableRows = [];

    data.forEach((item,index) =>
    {
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

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: topMargin + 5,
        theme: 'grid',
        margin: { left: 10,right: 10 },
        headStyles: {
            fillColor: [13,110,253],
            textColor: [255,255,255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 12
        },
        columnStyles: {
            0: { halign: 'center',valign: 'middle' },
            4: { halign: 'center',valign: 'middle' },
        },
        cellWidth: 'auto',
        bodyStyles: {
            fontSize: 12,
            fontStyle: 'normal',
            cellPadding: 5,
        }
    });

    doc.setFontSize(9);
    doc.setFont('times','thin');
    doc.setTextColor(0,0,0);
    doc.text('Source: e-kadiv.com',10,doc.autoTable.previous.finalY + 10);

    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
};
