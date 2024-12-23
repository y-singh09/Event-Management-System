import React, { useState, useEffect } from "react";
import HomeCard from "../HomeCard/HomeCard.jsx";
import "./Home.css";

const Home = () => {
  const [eventList, setEventList] = useState([]);
  const [attendeesList, setAttendeesList] = useState({});
  const [newEvent, setNewEvent] = useState({
    id: "",
    date: "",
    heading: "",
    location: "",
    description: "",
    count: "",
    img: "",
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (response.ok) {
          const data = await response.json();
          setEventList(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const fetchAttendees = async (eventName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/attendees`);
      if (response.ok) {
        const data = await response.json();
        const eventAttendees = data.filter((attendee) => attendee.assignedEvent === eventName);
        setAttendeesList((prev) => ({
          ...prev,
          [eventName]: {
            attendees: eventAttendees,
            count: eventAttendees.length,
          },
        }));
      } else {
        console.error("Failed to fetch attendees");
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, { method: "DELETE" });
      if (response.ok) {
        setEventList(eventList.filter((event) => event.id !== id));
        setAttendeesList((prev) => {
          const newList = { ...prev };
          delete newList[id];
          return newList;
        });
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleSave = async () => {
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `http://localhost:5000/api/events/${newEvent.id}`
        : "http://localhost:5000/api/events";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const data = await response.json();
        if (editing) {
          setEventList(
            eventList.map((event) =>
              event.id === newEvent.id ? data.event : event
            )
          );
        } else {
          setEventList([...eventList, data.event]);
        }
        resetForm();
      } else {
        console.error("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEdit = (event) => {
    setNewEvent(event);
    setEditing(true);
  };

  const resetForm = () => {
    setNewEvent({
      id: "",
      date: "",
      heading: "",
      location: "",
      description: "",
      img: "",
      count: "",
    });
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const renderEventCards = () => {
    return eventList.map(({ id, date, heading, location, description, img, count }) => (
      <div key={id}>
        <HomeCard
          id={id}
          date={date}
          heading={heading}
          location={location}
          description={description}
          count={count}
          img={img}
        />
        <button onClick={() => handleEdit({ id, date, heading, location, description, img, count })}>
          Edit
        </button>
        <button onClick={() => handleDelete(id)}>Delete</button>
        <button onClick={() => fetchAttendees(heading)} style={{ color: 'white', fontSize: "1.2rem" }}>
          View Attendees
        </button>
        {attendeesList[heading] && (
          <div style={{color:"white"}}>
            <h4>Attendees ({attendeesList[heading].count}):</h4>
            <ul>
              {attendeesList[heading].attendees.map((attendee) => (
                <li key={attendee.id}>{attendee.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="title-event">
      <h1 className="event-management-title" style={{color:"white"}}>Event Management</h1>
      <div className="event-form">
        <h2 className="add-new-event-title">
          {editing ? "Edit Event" : "Add New Event"}
        </h2>
        <input
          type="text"
          name="heading"
          placeholder="Event Name"
          value={newEvent.heading}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEvent.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newEvent.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={newEvent.date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="img"
          placeholder="Image URL"
          value={newEvent.img}
          onChange={handleChange}
        />
        <button onClick={handleSave}>
          {editing ? "Update Event" : "Add Event"}
        </button>
        <button onClick={resetForm}>Reset</button>
      </div>
      <div className="event-list-wrapper">
        <div className="event-list">
          {eventList.length > 0 ? renderEventCards() : <p>No events available</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
