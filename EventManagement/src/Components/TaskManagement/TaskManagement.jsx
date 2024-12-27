import React, { useState, useEffect } from "react";
import "./TaskTracker.css";

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [newTask, setNewTask] = useState({
    event: "",
    name: "",
    deadline: "",
    status: "Pending",
    assignedAttendee: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const eventsResponse = await fetch("http://localhost:5000/api/events");
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);

        const tasksResponse = await fetch("http://localhost:5000/api/tasks");
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);

        const attendeesResponse = await fetch("http://localhost:5000/api/attendees");
        const attendeesData = await attendeesResponse.json();
        setAttendees(attendeesData);
      } catch (error) {
        setError("Error fetching data, please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.event || !newTask.name || !newTask.deadline || !newTask.assignedAttendee) {
      alert("Please provide all task details.");
      return;
    }

    const newTaskData = {
      id: Date.now(),
      ...newTask,
    };

    setTasks([...tasks, newTaskData]);

    try {
      await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskData),
      });
      setNewTask({
        event: "",
        name: "",
        deadline: "",
        status: "Pending",
        assignedAttendee: "",
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleStatusChange = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const updatedStatus = taskToUpdate.status === "Pending" ? "Completed" : "Pending";

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: updatedStatus } : task
      )
    );

    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const renderTasks = () => {
    const groupedEvents = [...new Set(tasks.map((task) => task.event))];

    return groupedEvents.map((event) => (
      <div key={event} className="event-section">
        <h2 className="event-title">{event}</h2>
        <ul className="task-list">
          {tasks
            .filter((task) => task.event === event)
            .map(({ id, name, status, deadline, assignedAttendee }) => (
              <li key={id} className="task-item">
                <span className="task-name">{name}</span>
                <span className="task-deadline">Deadline: {deadline}</span>
                <span className={`task-status ${status.toLowerCase()}`}>{status}</span>
                <span className="assigned-attendee">
                  Assigned to: {assignedAttendee}
                </span>
                <button
                  className="status-toggle"
                  onClick={() => handleStatusChange(id)}
                >
                  Toggle Status
                </button>
              </li>
            ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="task-tracker">
      <h1 className="title">Task Tracker</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="add-task-form">
        <h2>Add New Task</h2>
        <select
          value={newTask.event}
          onChange={(e) => setNewTask({ ...newTask, event: e.target.value })}
        >
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event.id} value={event.heading}>
              {event.heading}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />

        <input
          type="date"
          placeholder="Deadline"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
        />

        <select
          value={newTask.assignedAttendee}
          onChange={(e) => setNewTask({ ...newTask, assignedAttendee: e.target.value })}
        >
          <option value="">Select Attendee</option>
          {attendees.map((attendee) => (
            <option key={attendee.id} value={attendee.name}>
              {attendee.name}
            </option>
          ))}
        </select>

        <button onClick={handleAddTask} disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>

      {tasks.length > 0 ? renderTasks() : <p>No tasks available</p>}
    </div>
  );
};

export default TaskTracker;
