const asyncErrorBoundary = require("../errors/asyncErrorBoundry")
const service = require("./tables.service")
const reservationService = require("../reservations/reservations.service")

async function validateUpdate(req, res, next) {
    const { table_id } = req.params;
    const { data } = req.body;
    if (!data) {
        return next({ status: 400, message: "Data is missing" });
    }
    const { reservation_id } = data;
    if (!reservation_id) {
        return next({ status: 400, message: "reservation_id is missing" });
    }
    const table = await service.read(table_id);
    const reservation = await reservationService.read(reservation_id);
    if (!table) {
        return next({ status: 404, message: `Table not found: ${table_id}` });
    }
    if (!reservation) {
        return next({ status: 404, message: `Reservation not found: ${reservation_id}` });
    }
    if (reservation.status === "seated") {
        return next({ status: 400, message: "reservation is already seated"})
    }
    if (table.capacity < reservation.people) {
        return next({ status: 400, message: "Table does not have sufficient capacity" });
    }
    if (table.occupied) {
        return next({ status: 400, message: "Table is already occupied" });
    }
    res.locals.table = table;
    res.locals.reservation = reservation;
    next();
}

async function tableExists(req, res, next) {
    const table = await service.read(req.params.table_id)
    if (table) {
      res.locals.table = table;
      return next()
    }
    return next({
      status: 404,
      message: `Table id not found : ${req.params.table_id}`,
    })
}

async function hasValidFields(req, res, next) {
    if (!req.body.data) {
        return next({ status: 400, message: 'Data missing' });
    }
    const { data: { table_name, capacity } } = req.body;

    if (!table_name || table_name === "" || table_name.length < 2) {
        return next({
            status: 400,
            message: "table_name",
        });
    }
    if (!capacity || typeof capacity !== 'number' || capacity < 1) {
        return next({
            status: 400,
            message: "capacity",
        });
    }

    next();
}

async function list(req, res) {
    const { date } = req.query
    const data = await service.list(date)
    res.json({ data })
}

async function create(req, res) {
    const data = await service.create(req.body.data)
    res.status(201).json({ data })
}

async function update(req, res) {
    const tableId = res.locals.table.table_id;
    const reservationId = res.locals.reservation.reservation_id;
    const updatedTableData = {
        reservation_id: reservationId,
        occupied: true,
    };
    const updatedTable = await service.update(tableId, updatedTableData);
    await reservationService.updateStatus(reservationId, "seated")
    res.status(200).json({ data: updatedTable });
}

async function destroy(req, res, next) {
    const table = res.locals.table
    if(!table.occupied) {
        return next({ status: 400, message: "table is not occupied"})
    }
    const reservationId = table.reservation_id
    await reservationService.updateStatus(reservationId, "finished")
    await service.destroy(table.table_id)
    // res.sendStatus(200).json({ message: "table unseated" })
    res.json({ message: "table unseated" })

}

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [hasValidFields, asyncErrorBoundary(create)],
    update: [asyncErrorBoundary(validateUpdate), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)]
}