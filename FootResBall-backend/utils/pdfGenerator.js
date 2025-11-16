const PDFDocument = require("pdfkit");

function generateReservationPDF(reservation, res) {
  const doc = new PDFDocument();

  // نرسل PDF مباشرة فـ Response
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Reservation_${reservation.reservationCode}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(20).text("Reservation Details", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Reservation Code: ${reservation.reservationCode}`);
  doc.text(`Customer Name: ${reservation.customerName}`);
  doc.text(`Phone Number: ${reservation.phoneNumber || "N/A"}`);
  doc.text(`ID Card: ${reservation.idCard || "N/A"}`);
  doc.text(`Terrain: ${reservation.terrain}`);
  doc.text(`Date: ${reservation.date.toDateString()}`);
  doc.text(`Time Slot: ${reservation.timeSlot}`);
  doc.text(`Duration: ${reservation.duration} hour(s)`);
  doc.text(`Price: ${reservation.price} DH`);
  doc.text(`Paid: ${reservation.paid ? "Yes" : "No"}`);

  doc.end();
}

module.exports = generateReservationPDF;
