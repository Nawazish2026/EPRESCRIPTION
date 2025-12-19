import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a prescription PDF document and triggers a download.
 * @param {Array} cartItems - The list of medicines in the cart.
 * @param {object} user - The logged-in user (doctor) object.
 * @param {object} patientDetails - The patient's details { name, age }.
 * @param {string} doctorNotes - Optional notes from the doctor.
 */
export const generatePrescriptionPDF = (cartItems, user, patientDetails, doctorNotes) => {
  // 1. Initialize jsPDF
  const doc = new jsPDF();

  // 2. Set up document properties and header
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN'); // Use Indian date format
  const doctorName = user?.name || 'Dr. [Doctor Name]';
  const doctorDetails = user?.specialization || 'General Physician'; // Example: 'MBBS, MD'
  const clinicName = user?.clinicName || 'E-Prescription Clinic';
  const clinicAddress = user?.clinicAddress || '123 Health St, Wellness City';

  // --- Header ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(doctorName, 20, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(doctorDetails, 20, 26);

  doc.setFontSize(10);
  doc.text(clinicName, 190, 20, { align: 'right' });
  doc.text(clinicAddress, 190, 26, { align: 'right' });
  doc.line(20, 35, 190, 35); // Horizontal line

  // --- Patient Details ---
  doc.setFontSize(11);
  doc.text(`Patient Name: ${patientDetails.name}`, 20, 45);
  doc.text(`Patient Age: ${patientDetails.age}`, 130, 45);
  doc.text(`Date: ${dateStr}`, 190, 45, { align: 'right' });
  doc.line(20, 50, 190, 50); // Horizontal line

  // --- Prescription Body ---
  doc.setFontSize(28);
  doc.setFont('times', 'normal');
  doc.text('Rx', 20, 65);

  // 3. Create the table of medicines
  const tableColumn = ["Medicine", "Composition", "Quantity", "Instructions"];
  const tableRows = [];

  cartItems.forEach(item => {
    const itemData = [
      item.name,
      item.composition,
      item.quantity,
      'As directed by the physician.' // Placeholder for instructions
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 70,
    theme: 'grid',
    headStyles: { fillColor: [67, 56, 202] }, // Indigo color
    styles: { font: 'helvetica', fontSize: 10 },
  });

  // 4. Add Doctor's notes and signature
  // Safely get the final Y position of the table, with a fallback if the table doesn't render.
  // Accessing .finalY on an undefined lastAutoTable would crash the PDF generation.
  let finalY = 70; // Fallback startY for notes if table fails
  if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
    finalY = doc.lastAutoTable.finalY;
  }

  // Add Doctor's notes if available
  if (doctorNotes && doctorNotes.trim() !== '') {
    finalY += 15; // Add some space
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text("Doctor's Notes:", 20, finalY);

    finalY += 7; // Space between title and text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(doctorNotes, 170); // 170mm width
    doc.text(notesLines, 20, finalY);
    finalY += (notesLines.length * 5); // Adjust finalY based on notes height
  }

  doc.setFontSize(10);
  doc.text('Signature:', 150, finalY + 20);
  doc.line(150, finalY + 22, 190, finalY + 22); // Signature line
  doc.text(doctorName, 150, finalY + 27);

  // 5. Save the PDF
  doc.save(`Prescription-${patientDetails.name.replace(/\s/g, '_')}-${dateStr}.pdf`);
};