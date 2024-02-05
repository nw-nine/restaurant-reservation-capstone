import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createTables } from "../utils/api";
import TableForm from "./TablesForm";
import ErrorAlert from "../layout/ErrorAlert";


function CreateTables() {

    const history = useHistory()

    const intialFormData = {
        table_name: "",
        capacity: 0,
        reservation_id: null,
        occupied: false

    }

    const [formData, setFormData] = useState(intialFormData)
    const [tableError, setTableError] = useState(null)

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    function validateForm() {
        if (formData.capacity < 1 || isNaN(formData.capacity)) {
            setTableError({ message: "Capacity must be a positive number and less than 12." });
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(!validateForm()) return
        try {
            await createTables(formData)
            setFormData({...intialFormData})
            history.push(`/dashboard`)
            
        } catch (error) {
            if(error.response) {
                setTableError({ message: error.table.data.error })
            }
            if(!error.response) {
                setTableError(error)
            }
        }
    }

    function goBack() {
        history.goBack()
    }

    return (
        <div>
            <header>
                <h3>
                    Create Table!
                </h3>
            </header>
            <div>
                <TableForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} goBack={goBack} />
                <ErrorAlert error={tableError} />
            </div>
        </div>
    )
}

export default CreateTables