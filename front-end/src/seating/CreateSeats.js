import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { listTables, seatTable } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
import SeatsForm from "./SeatsForm"


function CreateSeats() {

    const history = useHistory()

    const [table, setTable] = useState(null)
    const [tables, setTables] = useState([])
    const [seatError, setSeatError] = useState(null)
    const { reservation_id } = useParams()

    useEffect(loadTables, [])

    function loadTables() {
        const abortController = new AbortController()
        setSeatError(null)
        listTables(abortController.signal).then(setTables).catch(setSeatError)
        return () => abortController.abort
    }

    function handleChange({ target: { name, value } }) {
        setTable(value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(table === 0) return
        const selectedTable = tables.find(t => t.table_id === Number(table))
        try {
            seatTable(reservation_id, selectedTable)
            history.push(`/dashboard`)
        } catch (error) {
            if(error.response) {
                setSeatError({ message: error.response.data.error })
            }
            if(!error.response) {
                setSeatError(error)
            }
        }
    }

    function goBack() {
        history.goBack()
    }

    return (
        <>
        <header>
            <h3>
                Seat the Table
            </h3>
        </header>
        <div>
            <SeatsForm tables={tables} handleChange={handleChange} handleSubmit={handleSubmit} goBack={goBack} />
            <ErrorAlert error={seatError} />
        </div>
        </>
    )
}

export default CreateSeats