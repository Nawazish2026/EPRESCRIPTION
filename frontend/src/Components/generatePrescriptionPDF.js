import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a professional prescription PDF document and triggers a download.
 * @param {Array} cartItems - The list of medicines in the cart (with dosage, frequency, duration).
 * @param {object} user - The logged-in user (doctor) object.
 * @param {object} patientDetails - The patient's details { name, age }.
 * @param {string} diagnosis - The patient's diagnosis.
 * @param {string} doctorNotes - Optional notes from the doctor.
 */
export const generatePrescriptionPDF = (cartItems, user, patientDetails, diagnosis, doctorNotes) => {
  const doc = new jsPDF();

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const doctorName = user?.name || 'Dr. [Doctor Name]';
  const doctorDetails = user?.specialization || 'General Physician';
  const clinicName = user?.clinicName || 'E-Prescription Clinic';
  const clinicAddress = user?.clinicAddress || '123 Health St, Wellness City';

  // =========== HEADER ===========
  // Blue accent bar
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 0, 210, 4, 'F');

  // Doctor info (left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(31, 41, 55); // gray-800
  doc.text(doctorName, 20, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text(doctorDetails, 20, 26);

  // Clinic info (right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text(clinicName, 190, 16, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(clinicAddress, 190, 22, { align: 'right' });
  doc.text(`Date: ${dateStr}`, 190, 28, { align: 'right' });

  // Separator line
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.setLineWidth(0.5);
  doc.line(20, 33, 190, 33);

  // =========== PATIENT DETAILS ===========
  doc.setFillColor(240, 249, 255); // cyan-50
  doc.roundedRect(20, 38, 170, 22, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 182, 212);
  doc.text('PATIENT INFORMATION', 28, 46);

  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${patientDetails.name}`, 28, 54);
  doc.text(`Age: ${patientDetails.age} years`, 110, 54);

  // Diagnosis (if provided)
  let currentY = 68;
  if (diagnosis && diagnosis.trim()) {
    doc.setFillColor(254, 243, 199); // amber-100
    doc.roundedRect(20, currentY - 5, 170, 14, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text('DIAGNOSIS:', 28, currentY + 3);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 41, 55);
    doc.text(diagnosis, 60, currentY + 3);
    currentY += 18;
  }

  // =========== RX SYMBOL ===========
  doc.setFontSize(32);
  doc.setFont('times', 'bold');
  doc.setTextColor(6, 182, 212);
  doc.text('Rx', 20, currentY + 10);
  currentY += 16;

  // =========== MEDICINES TABLE ===========
  const tableColumn = ['#', 'Medicine', 'Dosage', 'Frequency', 'Duration', 'Qty'];
  const tableRows = [];

  cartItems.forEach((item, index) => {
    tableRows.push([
      (index + 1).toString(),
      `${item.name}\n${item.composition || ''}`,
      item.dosage || '-',
      item.frequency || 'As directed',
      item.duration || '-',
      item.quantity.toString(),
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: currentY,
    theme: 'grid',
    headStyles: {
      fillColor: [6, 182, 212], // cyan-500
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: [31, 41, 55],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 60 },
      2: { halign: 'center', cellWidth: 28 },
      3: { halign: 'center', cellWidth: 32 },
      4: { halign: 'center', cellWidth: 24 },
      5: { halign: 'center', cellWidth: 14 },
    },
    styles: {
      font: 'helvetica',
      overflow: 'linebreak',
      lineColor: [229, 231, 235],
      lineWidth: 0.3,
    },
    margin: { left: 20, right: 20 },
  });

  // =========== DOCTOR'S NOTES ===========
  let finalY = 70;
  if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
    finalY = doc.lastAutoTable.finalY;
  }

  if (doctorNotes && doctorNotes.trim() !== '') {
    finalY += 12;

    doc.setFillColor(243, 244, 246); // gray-100
    const notesLines = doc.splitTextToSize(doctorNotes, 158);
    const notesHeight = notesLines.length * 5 + 16;
    doc.roundedRect(20, finalY - 4, 170, notesHeight, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99); // gray-600
    doc.text("Doctor's Notes:", 28, finalY + 4);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81); // gray-700
    doc.text(notesLines, 28, finalY + 12);

    finalY += notesHeight;
  }

  // =========== SIGNATURE ===========
  finalY += 15;
  doc.setDrawColor(156, 163, 175); // gray-400
  doc.setLineWidth(0.3);
  doc.line(140, finalY + 5, 190, finalY + 5);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(doctorName, 165, finalY + 12, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Signature', 165, finalY, { align: 'center' });

  // =========== FOOTER ===========
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(6, 182, 212);
  doc.rect(0, pageHeight - 4, 210, 4, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text('Generated by E-Prescription · This is a computer-generated prescription', 105, pageHeight - 8, { align: 'center' });

  // =========== SAVE ===========
  doc.save(`Prescription-${patientDetails.name.replace(/\s/g, '_')}-${dateStr.replace(/\s/g, '-')}.pdf`);
};