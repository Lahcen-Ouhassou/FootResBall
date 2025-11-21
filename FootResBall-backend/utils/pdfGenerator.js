const PDFDocument = require("pdfkit");

function generateReservationPDF(reservation, res) {
  const doc = new PDFDocument();

  // Format time slot correctly
  const start = new Date(reservation.timeSlotStart);
  const end = new Date(reservation.timeSlotEnd);

  const formattedStart = start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedEnd = end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const timeSlot = `${formattedStart} - ${formattedEnd}`;

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
  doc.text(`Date: ${new Date(reservation.date).toDateString()}`);
  doc.text(`Time Slot: ${timeSlot}`);
  doc.text(`Duration: ${reservation.duration} hour(s)`);
  doc.text(`Price: ${reservation.price} DH`);
  doc.text(`Paid: ${reservation.paid ? "Yes" : "No"}`);

  doc.end();
}

module.exports = generateReservationPDF;
