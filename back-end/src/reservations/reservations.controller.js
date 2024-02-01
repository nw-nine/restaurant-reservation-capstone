/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require('../errors/asyncErrorBoundry')

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id)
  if (reservation) {
    res.locals.reservation = reservation;
    return next()
  }
  return next({
    status: 404,
    message: `Reservation id not found : ${req.params.reservation_id}`,
  })
}

const hasValidFields = (req, res, next) => {
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ]

  if (!req.body.data) {
    return next({ status: 400, message: "Data missing" });
  }

  for (const field of requiredFields) {
    if (!req.body.data.hasOwnProperty(field)) {
      return next({ status: 400, message: `${field} is required` });
    }
  }

  if(req.body.data.first_name === '') {
    return next({
      status: 400, 
      message: "first_name is empty"
    })
  }
  if(req.body.data.last_name === '') {
    return next({
      status: 400, 
      message: "last_name is empty"
    })
  }
  if(req.body.data.mobile_number === '') {
    return next({
      status: 400, 
      message: "mobile_number is empty"
    })
  }
  if(req.body.data.people === 0) {
    return next({
      status: 400, 
      message: "people is 0"
    })
  }
  if (
    !req.body.data.reservation_date.match(/\d{4}-\d{2}-\d{2}/) ||
    typeof req.body.data.people !== "number" ||
    !req.body.data.reservation_time.match(/^[0-9]{2}:[0-9]{2}$/)
  ) {
    return next({
      status: 400,
      message: "Invalid input for reservation_date, reservation_time, or people",
    });
  }

  if (!req.body.data.status) {
    req.body.data.status = "booked";
  } else if (!["booked", "seated", "finished"].includes(req.body.data.status)) {
    return next({ status: 400, message: "Invalid status" });
  }

  res.locals.validReservation = req.body.data;
  next();
}

function notTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const [year, month, day] = reservation_date.split("-")
  const date = new Date(`${month} ${day}, ${year}`)
  if (date.getDay() === 2) {
    return next({ status: 400, message: "Reservations are closed on Tuesdays" })
  }
  res.locals.date = date;
  next()
}

function isFuture(req, res, next) {
  const date = res.locals.date
  const today = new Date()
  if (date < today) {
    return next({ status: 400, message: "Only future reservations allowed" });
  }
  next()
}

function buisnessHours(req, res, next) {
  const reservation = req.body.data
  const [hour, minute] = reservation.reservation_time.split(":")
  if (hour < 10 || hour > 21) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    })
  }
  if ((hour < 11 && minute < 30) || (hour > 20 && minute > 30)) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  next();
}

async function list(req, res) {
  const { date } = req.query
  res.json({ data: await service.list(date) });
}

async function read(req, res) {
  const reservationId = req.params.reservation_id;
  const data = await service.read(reservationId);
    res.json({ data });
}

async function create(req, res, next) {
  if(["seated", "finished"].includes(res.locals.validReservation.status)) {
    return next({
      status: 400,
      message: `invalid status : ${res.locals.validReservation.status}`
    })
  }
  const data = await service.create(res.locals.validReservation);
  res.status(201).json({ data });
}

async function update(req, res, next) {
  const status = req.body.data.status

  if(["seated", "finished", "booked"].includes(status)) {
    if(res.locals.reservation.status === "finished") {
      return next({
        status: 400,
        message: "can not update finished reservation"
      })
    }
    const updatedReservation = {
      ...res.locals.reservation,
      status: status,
    }
    const data = await service.update(updatedReservation)
    res.status(200).json({ data })
  } else {
    return next({
      status: 400,
      message: `invalid status ${status}`
    })
  }
}

// async function update(req, res, next) {
//   if(req.body.status !== "seated" && req.body.status !== "finished" && req.body.status !== "booked") {
//     return next({
//       status: 400,
//       message: `${req.body.status} is invalid`,
//     })
//   }
//   if(res.locals.reservation.status === "finished") {
//     return next({
//       status: 400,
//       message: "can not update finished reservation"
//     })
//   }
//   const updated = {
//     ...res.locals.reservation,
//     status: req.body.status,
//   }
//   const data = await service.update(updated)
//   res.status(200).json({ data })
// }


module.exports = {
  create: [
    hasValidFields,
    notTuesday,
    isFuture,
    buisnessHours,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(update)]
};
