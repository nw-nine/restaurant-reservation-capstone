const knex = require("../db/connection")

function list() {
    return knex("tables")
        .select("*")
        .orderBy("tables.table_name")
}

function create(table) {
    if(table.reservation_id) table.occupied = true
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((tables) => tables[0])
}

function read(tableId) {
    return knex("tables")
        .where({table_id: tableId})
        .first()
}

function update(tableId, updatedTable) {
    return knex("tables")
        .where({ table_id: tableId })
        .update(updatedTable, '*');
}

function destroy(tableId) {
    return knex("tables")
        .where({ table_id: tableId })
        .update({ occupied: false, reservation_id: null }, "*")
}

module.exports = {
    list,
    create,
    read,
    update,
    destroy,
}