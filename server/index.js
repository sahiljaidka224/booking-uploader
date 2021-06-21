const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors()); // so that app can access
app.use(express.json());

const bookings = JSON.parse(fs.readFileSync("./server/bookings.json")).map(
  (bookingRecord) => ({
    time: bookingRecord.time,
    duration: bookingRecord.duration,
    userId: bookingRecord.user_id,
  })
);

app.get("/bookings", (_, res) => {
  res.json(bookings);
});

app.post("/bookings", (req, res) => {
  const allBookings = [...bookings, ...req.body];

  const newBookings = allBookings.map((booking) => ({
    time: booking.time,
    duration: parseInt(booking.duration),
    user_id: booking.userId.replace(" ", ""),
  }));

  fs.writeFileSync("./server/bookings.json", JSON.stringify(newBookings));
  res.json(newBookings);
});

app.listen(3001);
