import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";

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
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
