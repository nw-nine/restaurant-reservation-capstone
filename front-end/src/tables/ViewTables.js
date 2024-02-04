import { useEffect, useState } from "react";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function ViewTables() {
    
    const [tables, setTables] = useState([])
    const [tablesError, setTablesError] = useState(null)

    useEffect(loadTables, [tables])

    function loadTables() {
        const abortController = new AbortController()
        setTablesError(null)
        listTables(abortController.signal).then(setTables).catch(setTablesError)
        return () => abortController.abort()
    }

    return (
        <div>
            <ErrorAlert error={tablesError} />
            <h3>
                Tables
            </h3>
            {tables && 
                tables.map((table, index) => (
                    <div key={index} className="row mb-2">
                        <div className="col-6">
                            <h5 key={index}>
                                {`${table.table_name}`}
                            </h5>
                            <p>capacity: {table.capacity}</p>
                        </div>
                        <div data-table-id-status={table.table_id} className="col-6">
                            <p>{table.occupied ? "occupied" : "free"}</p>
                        </div>
                    </div>
                ))}
        </div>
    )

}

export default ViewTables