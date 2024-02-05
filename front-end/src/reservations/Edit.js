import { useEffect, useState } from "react"
import { EditRes, readRes } from "../utils/api"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import ErrorAlert from "../layout/ErrorAlert"
import { formatAsDate, formatAsTime } from "../utils/date-time"

function Edit({
    intialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
        
    },
    }) {

        const [editsError, setEditsError] = useState(null)
        const { reservation_id } = useParams()
        const [reservation, setReservation] = useState({...intialFormData})
        const history = useHistory()


    useEffect(loadEdit, [reservation_id])

    function loadEdit() {
        const abortController = new AbortController()
        setEditsError(null)
        readRes(reservation_id, abortController.signal)
            .then((loadedReservation) => {
                loadedReservation.reservation_date = formatAsDate(loadedReservation.reservation_date)
                loadedReservation.reservation_time = formatAsTime(loadedReservation.reservation_time)
                setReservation(loadedReservation)
            })
            .catch(setEditsError)
        return () => abortController.abort()
    }

    function handleChange(event) {
        setReservation((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value, 
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log(reservation)
        EditRes(reservation)
            .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
            .catch(setEditsError)
    }

    function goBack() {
        history.goBack()
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>Edit Reservation</h3>
                <fieldset>
                    <p>First Name:</p>
                    <label htmlFor="first_name">
                        <input
                            name="first_name"
                            type="text"
                            id="first_name"
                            onChange={handleChange}
                            value={reservation.first_name}
                            placeholder="First Name"
                            required={true}
                        />
                    </label>
                    <p>Last Name:</p>
                    <label htmlFor="last_name">
                        <input
                            name="last_name"
                            type="text"
                            id="last_name"
                            onChange={handleChange}
                            value={reservation.last_name}
                            placeholder="Last Name"
                            required={true}
                        />
                    </label>
                    <p>Mobile Number:</p>
                    <label htmlFor="mobile_number">
                        <input
                            name="mobile_number"
                            type="text"
                            id="mobile_number"
                            onChange={handleChange}
                            value={reservation.mobile_number}
                            placeholder="XXX-XXX-XXXX"
                            required={true}
                        />
                    </label>
                    <p>Date:</p>
                    <label htmlFor="reservation_date">
                        <input
                            name="reservation_date"
                            type="date"
                            id="reservation_date"
                            onChange={handleChange}
                            value={reservation.reservation_date}
                            required={true}
                        />
                    </label>
                    <p>Time:</p>
                    <label htmlFor="reservation_time">
                        <input
                            name="reservation_time"
                            type="time"
                            id="reservation_time"
                            onChange={handleChange}
                            value={reservation.reservation_time}
                            required={true}
                        />
                    </label>
                    <p>Seats:</p>
                    <label htmlFor="people">
                        <input
                            name="people"
                            type="number"
                            id="people"
                            onChange={handleChange}
                            value={reservation.people}
                            placeholder="1"
                            required={true}
                            min={1}
                            max={10}
                        />
                    </label>
                    <div>
                        <button type="button" className="btn btn-secondary" onClick={goBack}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            submit
                        </button>
                    </div>
                    <ErrorAlert error={editsError} />
                </fieldset>
            </form>
        </div>
    )
}

export default Edit