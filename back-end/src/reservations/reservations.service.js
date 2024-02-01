const knex = require("../db/connection")

// async function list() {
//     return await knex("reservations").select("*").orderBy("reservation_date").orderBy("reservation_time")
// }

async function read(reservationId) {
    return await knex("reservations").where({ reservation_id: reservationId }).first()
}

async function list(date) {
    return await knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .andWhereNot({ status: "finished"})
    .orderBy("reservation_time")
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

async function update(reservation) {
    return await knex("reservations")
        .where("reservation_id", reservation.reservation_id)
        .update(reservation, "*")
        .then((updated) => updated[0])
}

async function updateStatus(reservationId, newStatus) {
    return await knex("reservations")
        .where({ reservation_id: reservationId })
        .update({ status: newStatus }, "*")
        .then((updated) => updated[0])
}

module.exports = {
    list,
    // listByDate,
    read,
    destroy,
    create,
    update,
    updateStatus,
}