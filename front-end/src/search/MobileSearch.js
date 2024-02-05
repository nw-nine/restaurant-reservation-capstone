import { useState } from "react"
import { listResByNum, updateResStatus } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"


function MobileSearch() {

    const [searchError, setSearchError] = useState(null)
    const [mobile_number, setMobile_number] = useState("")
    const [found, setFound] = useState(false)
    const [notFound, setNotFound] = useState(false)



    function loadSearch() {
        const abortController = new AbortController()
        setSearchError(null)
        listResByNum(mobile_number, abortController.signal)
        .then((res) => {
            if(res.length > 0) {
                setFound(res)
                setNotFound(false)
            } else {
                setNotFound(true)
                setSearchError({ message: "No reservations found"})
                setFound([])
            }
        })
        .catch(setSearchError)
        return () => abortController.abort()
    }

    function handleChange(event) {
        setMobile_number(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        loadSearch()
    }

    function handleClick(res, newStatus) {
        updateResStatus(res, newStatus)
            .then(loadSearch)
            .catch(setSearchError)
    }


    return (
        <div>
            <header>
                <h3>Enter a customer's phone number</h3>
            </header>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor="mobile_number">
                        <input 
                            name="mobile_number"
                            type="text"
                            id="mobile_number"
                            onChange={handleChange}
                            value={mobile_number}
                            placeholder="XXX-XXX-XXXX"
                            required={true}
                        />
                    </label>
                    <button type="submit" className="m-3 btn btn-primary">
                        Search
                    </button>
                </fieldset>
                {notFound && (
                    <h4>No reservation found</h4>
                )}
                {found.length > 0 && (
                    found.map((res, index) => (
                        <div key={index}>
                            <div className="d-flex"> 
                                <div className="col-2">
                                    <p>
                                        {res.first_name}
                                    </p>
                                </div>
                                <div className="col-2">
                                    <p>
                                        {res.last_name}
                                    </p>
                                </div>
                                <div className="col-2">
                                    <p>
                                        {res.mobile_number}
                                    </p>
                                </div>
                                <div className="col-2">
                                    <p>
                                        {res.reservation_time}
                                    </p>
                                </div>
                                <div className="col-2">
                                    <p>
                                        {res.people}
                                    </p>
                                </div>
                                <div className="col-2">
                                    {res.status === "booked" && (
                                        <>
                                            <p data-reservation-id-status={res.reservation_id}>
                                                {res.status}
                                            </p>
                                            <a href={`/reservations/${res.reservation_id}/seat`}>
                                                <button type="button" className="btn btn-primary" onClick={() => {
                                                    handleClick(res, "seated")
                                                }}>
                                                    Seat
                                                </button>
                                            </a>
                                        </> 
                                    )}
                                    {res.status === "seated" && (
                                        <>
                                            <p data-reservation-id-status={res.reservation_id}>
                                                {res.status}
                                            </p>
                                            <button type="button" className="btn btn-primary" onClick={() => {
                                                if(window.confirm("finish reservation?")) {
                                                    handleClick(res, "finished")
                                                }
                                            }}>
                                                Finish
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </form>
            <ErrorAlert error={searchError} />
        </div>
        
    )
}

export default MobileSearch