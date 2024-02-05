import { useEffect, useState } from "react";
import { listTables, unseat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function ViewTables() {
    
    const [tables, setTables] = useState([])
    const [tablesError, setTablesError] = useState(null)

    useEffect(() => {
        const abortController = new AbortController();
        loadTables(abortController.signal);
        return () => abortController.abort();
    }, []);

    function loadTables(signal) {
        setTablesError(null);
        listTables(signal)
            .then(setTables)
            .catch(setTablesError);
    }

    async function deleteHandler(table_id) {
        
            await unseat(table_id)
                .then(() => loadTables(new AbortController().signal))
                .catch(setTablesError);
            window.location.reload()
        
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