import React, { useState, useEffect } from "react";
import './Attendees.css';

const AttendeeManagement = () => {
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState({
    name: "",
    assignedEvent: "",
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    fetch("http://localhost:5000/api/attendees")
      .then((response) => response.json())
      .then((data) => setAttendees(data))
      .catch((error) => console.error("Error fetching attendees:", error));
  }, []);

  const handleAddAttendee = async () => {
    if (!newAttendee.name || !newAttendee.assignedEvent) {
      alert("Please fill out all fields.");
      return;
    }

    const newAttendeeData = {
      ...newAttendee,
      id: Date.now(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/attendees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAttendeeData),
      });

      if (response.ok) {
        const data = await response.json();
        setAttendees([...attendees, data.attendee]);
        setNewAttendee({ name: "", assignedEvent: "" });
      } else {
        console.error("Failed to save attendee");
      }
    } catch (error) {
      console.error("Error saving attendee:", error);
    }
  };

  const handleRemoveAttendee = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/attendees/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAttendees(attendees.filter((attendee) => attendee.id !== id));
      } else {
        console.error("Failed to delete attendee");
      }
    } catch (error) {
      console.error("Error deleting attendee:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendee({ ...newAttendee, [name]: value });
  };

  const renderAttendeeList = () => {
    return attendees.map(({ id, name, assignedEvent }) => (
      <div key={id} className="attendee-card">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Event:</strong> {assignedEvent}</p>
        <button
          className="remove-button"
          onClick={() => handleRemoveAttendee(id)}
        >
          Remove
        </button>
      </div>
    ));
  };

  const countAttendeesForEvent = (eventName) => {
    return attendees.filter((attendee) => attendee.assignedEvent === eventName).length;
  };

  return (
    <div className="attendee-management">
      <h1 className="title" style={{ color: 'white' }}>Attendee Management</h1>

      <div className="attendee-form">
        <h2 className="subtitle text-3xl">Add Attendee</h2>
        <input
          type="text"
          name="name"
          placeholder="Attendee Name"
          value={newAttendee.name}
          onChange={handleInputChange}
        />
        <select
          className="select"
          name="assignedEvent"
          value={newAttendee.assignedEvent}
          onChange={handleInputChange}
        >
          <option value="">Select Event</option>
          {events.map((event, index) => (
            <option key={index} value={event.heading}>
              {event.heading}
            </option>
          ))}
        </select>
        <button className="add-button" onClick={handleAddAttendee}>
          Add Attendee
        </button>
      </div>

      <div className="attendee-list">
        <h2 className="subtitle">Attendee List</h2>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-section">
              <h3 className="event-title">
                {event.heading} (Attendees: {countAttendeesForEvent(event.heading)})
              </h3>
              <div>
                {attendees.filter((attendee) => attendee.assignedEvent === event.heading).length === 0
                  ? <p>No attendees for this event</p>
                  : attendees
                      .filter((attendee) => attendee.assignedEvent === event.heading)
                      .map(({ id, name, assignedEvent }) => (
                        <div key={id} className="attendee-card">
                          <p><strong>Name:</strong> {name}</p>
                          <p><strong>Event:</strong> {assignedEvent}</p>
                          <button
                            className="remove-button"
                            onClick={() => handleRemoveAttendee(id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
              </div>
            </div>
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>
    </div>
  );
};

export default AttendeeManagement;
