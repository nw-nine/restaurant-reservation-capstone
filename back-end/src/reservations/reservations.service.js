const knex = require("../db/connection")

async function list() {
    return await knex("reservations").select("*").orderBy("reservation_date").orderBy("reservation_time")
}

async function read(reservationId) {
    return await knex("reservations").where({ reservation_id: reservationId }).first()
}

async function listByDate(date) {
    return await knex("reservations").where({ reservation_date: date }).select("*").orderBy("reservation_time")
}

async function destroy(reservationId) {
    return await knex("reservations").where("reservation_id", reservationId).delete()
}

async function create(newReservation) {
    return await knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then(rows => rows[0])
}


module.exports = {
    list,
    listByDate,
    read,
    destroy,
    create,
}