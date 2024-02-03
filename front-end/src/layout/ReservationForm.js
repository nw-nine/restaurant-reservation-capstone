

function ReservationForm({ formData, handleChange, handleSubmit, goBack  }) {


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>First name:</p>
                <label htmlFor="first_name">
                    <input 
                        name="first_name"
                        type="text"
                        id="first_name"
                        onChange={handleChange}
                        value={formData.first_name}
                        placeholder="First Name"
                    />
                </label>
                <p>Last name:</p>
                <label htmlFor="last_name">
                    <input 
                        name="last_name"
                        type="text"
                        id="last_name"
                        onChange={handleChange}
                        value={formData.last_name}
                        placeholder="Last Name"
                    />
                </label>
                <p>Phone Number:</p>
                <label htmlFor="mobile_number">
                    <input 
                        name="mobile_number"
                        type="tel"
                        id="mobile_number"
                        onChange={handleChange}
                        value={formData.mobile_number}
                        placeholder="Phone Number"
                    />
                </label>
                <p>Date of Reservation</p>
                <label htmlFor="reservation_date">
                    <input 
                        name="reservation_date"
                        type="date"
                        pattern="\d{4}-\d{2}-\{2}"
                        id="reservation_date"
                        onChange={handleChange}
                        value={formData.reservation_date}
                        placeholder="YYYY-MM-DD"
                    />
                </label>
                <p>Time of Reservation</p>
                <label htmlFor="reservation_time">
                    <input 
                        name="reservation_time"
                        type="time"
                        pattern="[0-9]{2}:[0-9]{2}"
                        id="reservation_time"
                        onChange={handleChange}
                        value={formData.reservation_time}
                        placeholder="HH:MM"
                    />
                </label>
                <p>Party Size</p>
                <label htmlFor="poeple">
                    <input 
                        name="people"
                        type="number"
                        min="1"
                        max="22"
                        id="people"
                        onChange={handleChange}
                        value={formData.people}
                        placeholder="0"
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

export default ReservationForm