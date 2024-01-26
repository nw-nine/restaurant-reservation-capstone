/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require('../errors/asyncErrorBoundry')

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `Reservation id not found : ${req.params.reservation_id}`,
  });
}

const hasValidFields = (req, res, next) => {
  if(!req.body.data) {
    return next({ status: 400, message: 'Data missing'})
  }
  const knownFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ]
  for (const field of knownFields) {
    if (!req.body.data[field]) {
      return next({ status: 400, message: `${field} is required` });
    }
  }
  if (
    !req.body.data.reservation_date.match(/\d{4}-\d{2}-\d{2}/g) ||
    typeof req.body.data.people !== "number" ||
    !req.body.data.reservation_time.match(/[0-9]{2}:[0-9]{2}/g)
  )
    return next({
      status: 400,
      message: `Invalid input for reservation_date, reservation_time, or people`,
    });

  res.locals.validReservation = req.body.data;
  next();
}

async function list(req, res) {
  const { date } = req.query
  if(!date) {
    const data = await service.list()
    res.json({ data });
  } else {
    const data = await service.listByDate(date)
    res.json({ data })
  }
}

async function read(req, res) {
  const reservationId = req.params.reservation_id;
  const data = await service.read(reservationId);
    res.json({ data });
}

async function create(req, res) {
  const data = await service.create(res.locals.validReservation);
  res.status(201).json({ data });
}

module.exports = {
  create: [
    hasValidFields,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)]
};
