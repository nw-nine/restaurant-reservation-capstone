import { useParams } from "react-router-dom/cjs/react-router-dom.min"

function SeatsForm({ tables, handleChange, handleSubmit, goBack }) {

    const { reservation_id } = useParams()

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <div>
                        <h3>reservation for #{reservation_id} </h3>
                        <label htmlFor="table_name">Table Name</label>
                        <select 
                            name="table_id"
                            id="table_id"
                            onChange={handleChange}
                            required={true}
                        >
                            <option value={0}>
                                Select a Table
                            </option>
                            {tables && 
                                tables.map((table, index) => (
                                    <option
                                        key={index}
                                        value={table.table_id}
                                    >
                                        {`${table.table_name} - ${table.capacity}`}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <button type="button" className="btn btn-secondary" onClick={goBack}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" >
                            Submit
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}

export default SeatsForm