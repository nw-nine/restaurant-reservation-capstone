import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
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

  const formatReservation = reservations.map((res, index) => (
    <div key={index} className="d-flex">
      <div className="col-2">
        <p>{res.first_name}</p>
      </div>
      <div className="col-2">
        <p>{res.last_name}</p>
      </div>
      <div className="col-2">
        <p>{res.mobile_number}</p>
      </div>
      <div className="col-2">
        <p>{res.reservation_time}</p>
      </div>
      <div className="col-2">
        <p>{res.people}</p>
      </div>
      <div>
        <a href={`/reservations/${res.reservation_id}/seat`}>
          <button type="button" className="btn btn-primary">
            Seat
          </button>
        </a>
      </div>
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
      {/* {JSON.stringify(reservations)} */}
      <div>{formatReservation}</div>
      <div className="col-4">
        <ViewTables />
      </div>
    </main>
  );
}

export default Dashboard;
