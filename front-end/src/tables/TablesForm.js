

function TableForm({ formData, handleChange, handleSubmit, goBack }) {


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Table Name:</p>
                <label htmlFor="table_name">
                    <input 
                        name="table_name"
                        type="text"
                        id="table_name"
                        onChange={handleChange}
                        value={formData.table_name}
                        placeholder="Table Name"
                        required={true}
                    />
                </label>
                <p>Capacity:</p>
                <label htmlFor="capacity">
                    <input 
                        name="capacity"
                        type="number"
                        id="capacity"
                        onChange={handleChange}
                        value={formData.capacity}
                        placeholder="Capacity"
                        required={true}
                    />
                </label>
                <div>
                    <button onClick={goBack} className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default TableForm