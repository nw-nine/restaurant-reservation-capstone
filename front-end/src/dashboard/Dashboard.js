import React, { useEffect, useState } from "react";
import { listReservations, updateResStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import ViewTables from "../tables/ViewTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {

  const history = useHistory()

  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }
  const query = useQuery()
  const [date, setDate] = useState(query.get("date") || today())
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function updateStatus(reservation, newStatus) {
    updateResStatus(reservation, newStatus)
      .then(loadDashboard)
      .catch(setReservationsError)
  }

  function handleCancel(reservation) {
    if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      updateResStatus(reservation, "cancelled")
      window.location.reload()
    }
  }

  const formatReservation = reservations.map((reservation, index) => (
    <div key={index} className="d-flex">
      <div className="col-1">
        <p>{reservation.first_name}</p>
      </div>
      <div className="col-1">
        <p>{reservation.last_name}</p>
      </div>
      <div className="col-1">
        <p>{reservation.mobile_number}</p>
      </div>
      <div className="col-1">
        <p>{reservation.reservation_time}</p>
      </div>
      <div className="col-1">
        <p>{reservation.people}</p>
      </div>
      <div className="col-1">
        <p data-reservation-id-status={reservation.reservation_id}>{reservation.status}</p>
      </div>
      <div className="col-1">
        {reservation.status === "booked" && (
          <a href={`/reservations/${reservation.reservation_id}/seat`} id="seat" name="seat">
            <button type="button" id="seat" name="seat" className="btn btn-primary">
              Seat
            </button>
          </a>
        )}
        {reservation.status === "seated" && (
          <button type="button" className="btn btn-warning" onClick={() => {
            if(window.confirm("finish reservation?")) {
              updateStatus(reservation, "finished")
            }
          }}>
            Finish
          </button>
        )}
      </div>
        {reservation.status !== "cancelled" && (
        <>
          <div className="col-1">
              <button data-reservation-id-cancel={reservation.reservation_id} className="btn btn-primary" onClick={() => {
                handleCancel(reservation)
              }}>
                Cancel
              </button>
          </div>
          <div className="col-1">
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <button type="button" className="btn btn-secondary">
                Edit
              </button>
            </a>
          </div>
        </>
        )}
    </div>
  ))

  return (
    <main>
      <button
        onClick={() => {
            const newDate = previous(date)
            setDate(newDate)
            history.push(`?date=${newDate}`)
          }
        } 
        className="btn btn-secondary"
      >
        Previous Day
      </button>
      <button
        className="mx-3 btn btn-primary"
        onClick={() => {
            const newDate = today()
            setDate(newDate)
            history.push(`?date=${newDate}`)
          }
        }
      >
        Today
      </button>
      <button
        onClick={() => {
            const newDate = next(date)
            setDate(newDate)
            history.push(`?date=${newDate}`)
          }  
        }
        className="btn btn-secondary"
      >
        Next Day
      </button>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>{formatReservation}</div>
      <div className="col-4">
        <ViewTables />
      </div>
    </main>
  );
}

export default Dashboard;
