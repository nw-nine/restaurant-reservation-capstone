import { useEffect, useState } from "react";
import { listTables, unseat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function ViewTables() {
    
    const [tables, setTables] = useState([])
    const [tablesError, setTablesError] = useState(null)

    useEffect(loadTables, [])

    function loadTables() {
        const abortController = new AbortController()
        setTablesError(null)
        listTables(abortController.signal).then(setTables).catch(setTablesError)
        return () => abortController.abort()
    }

    function deleteHandler(table_id) {
        unseat(table_id).then(loadTables).catch(setTablesError)
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
                            {table.occupied ? "occupied" : "free"}
                        </div>
                        <div data-table-id-finish={table.table_id} className="col-3">
                            {table.occupied && (
                                <button  className="btn btn-warning" onClick={() => {
                                        if(window.confirm("Is this table ready to seat new guests? This cannot be undone")) {
                                            deleteHandler(table.table_id)
                                        }
                                    }}>
                                    Finish
                                </button>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    )

}

export default ViewTables