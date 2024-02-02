import { useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { createReservation } from "../utils/api"
import ReservationForm from "./ReservationForm"


function CreateReservation() {

    const history = useHistory()

    const intialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    }

    const [formData, setFormData] = useState(intialFormData)

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        createReservation(formData)
        history.push(`/dashboard?state=${formData.reservation_date}`)
    }

    function goBack() {
        history.goBack()
    }


    return (
        <>
        <header>
            <h3>
                Create a reservation!
            </h3>
        </header>
        <div>
            <ReservationForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} goBack={goBack}/>
        </div>
        </>
    )
}


export default CreateReservation