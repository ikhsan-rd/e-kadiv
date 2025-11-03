import jsPDF from 'jspdf';

export const DanaRekapPrint = (filter,periode,pemasukan = 0,pengeluaran = 0,sisa = 0,terbilangSisa = '') =>
{
    const doc = new jsPDF();

    const topMargin = 10;
    const leftMargin = 10; // Ubah margin kiri menjadi 10
    const rightMargin = 10; // Ubah margin kanan menjadi 10
    const lineHeight = 5;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - leftMargin - rightMargin; // Hitung lebar maksimal untuk teks

    // Set header
    doc.setFontSize(14);
    doc.setFont('times','bold');
    doc.setTextColor(0,0,0);
    doc.text(`Rekapitulasi Pengeluaran Divisi ${filter}`,pageWidth / 2,topMargin,{ align: 'center' });

    doc.setFontSize(12);
    doc.setFont('times','normal');

    // Add content
    let currentYPosition = topMargin + 15;
    doc.text(`Pemasukan`,leftMargin,currentYPosition);
    doc.text(`: Rp ${pemasukan.toLocaleString()}`,leftMargin + 25,currentYPosition);
    currentYPosition += lineHeight;

    const pengeluaranText1 = `Pengeluaran`;
    const pengeluaranText2 = `: Rp ${pengeluaran.toLocaleString()}`;
    doc.text(pengeluaranText1,leftMargin,currentYPosition);
    doc.text(pengeluaranText2,leftMargin + 25,currentYPosition);

    // Garis bawah "Pengeluaran"
    const lineYPosition = currentYPosition + 1; // Adjust Y position for the underline slightly below the text
    doc.line(leftMargin,lineYPosition,leftMargin + 28 + doc.getTextWidth(pengeluaranText2),lineYPosition);

    currentYPosition += lineHeight;

    // Sisa
    doc.text(`Sisa`,leftMargin,currentYPosition);
    doc.text(`: Rp ${sisa.toLocaleString()}`,leftMargin + 25,currentYPosition);
    currentYPosition += lineHeight*2;

    const explanationText = `Jadi, sisa dana Divisi ${filter} yang digunakan pada Kepengurusan UKM SPORT periode ${periode}, sebesar Rp ${sisa.toLocaleString()}`;
    const wrappedExplanationText = doc.splitTextToSize(explanationText,maxLineWidth);
    doc.text(wrappedExplanationText,leftMargin,currentYPosition);
    currentYPosition += wrappedExplanationText.length * lineHeight*1.5;

    // Terbilang
    const terbilangText = `Terbilang: ${terbilangSisa} Rupiah`;
    const wrappedTerbilangText = doc.splitTextToSize(terbilangText,maxLineWidth);
    doc.text(wrappedTerbilangText,leftMargin,currentYPosition);
    currentYPosition += wrappedTerbilangText.length * lineHeight;

    currentYPosition += 20;

    // Footer
    doc.setFontSize(9);
    doc.setFont('times','thin');
    doc.text('Source: e-kadiv.com', leftMargin, currentYPosition);

    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
};
