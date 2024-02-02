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
        people: 1,
    }

    const [formData, setFormData] = useState(intialFormData)

    function handleChange(event) {
        const value = event.target.type === "number" ? Number(event.target.value) : event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            await createReservation(formData)
            setFormData({...intialFormData})
            history.push(`/dashboard?state=${formData.reservation_date}`)
        } catch (error) {
            
        }
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