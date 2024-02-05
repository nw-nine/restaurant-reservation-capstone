/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import axios from "axios"
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function createReservation(reservation) {
  return await axios.post(`${API_BASE_URL}/reservations`, { data: reservation }, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .catch((error) => {
    console.error("Error creating reservation:", error.response);
    throw error;
  });
}
export async function createTables(tableData, signal) {
  const url = `${API_BASE_URL}/tables`;
  const dataToSend = {
    ...tableData,
    capacity: Number(tableData.capacity)
  }
  const options = {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: dataToSend }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function listTables(signal) {
  const url = `${API_BASE_URL}/tables`
  return await fetchJson(url, { headers, signal }, [])
}

export async function seatTable(reservation_id, table, signal) {
  const url = `${API_BASE_URL}/tables/${table.table_id}/seat` 
  const options = {
    method: `PUT`,
    headers,
    body: JSON.stringify({
      data: { reservation_id: reservation_id }
    }),
    signal,
  }
  return await fetchJson(url, options)
}

export async function unseat(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`
  const options ={
    method: `DELETE`,
    headers,
    signal,
  }
  return await fetchJson(url, options)
}

export async function updateResStatus(reservation, newStatus, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}/status`
  const options = {
    method: `PUT`,
    headers,
    body: JSON.stringify({
      data: { status: newStatus },
    }),
    signal,
  }
  return await fetchJson(url, options)
}

export async function listResByNum(mobile_number, signal) {
  const url = `${API_BASE_URL}/reservations?mobile_number=${mobile_number}`
  return await fetchJson(url, signal)
}

export async function EditRes(reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`
  const options = {
    method: `PUT`,
    headers,
    body: JSON.stringify({
      data: reservation
    }),
    signal,
  }
  return await fetchJson(url, options)
}

export async function readRes(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`
  return await fetchJson(url, signal).then(formatReservationDate)
}