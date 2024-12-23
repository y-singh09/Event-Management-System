from flask import Flask, request, jsonify
import os
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
EVENTS_FILE = 'events.json'
TASKS_FILE = 'tasks.json'
ATTENDEES_FILE = 'attendees.json'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

def load_file(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            return json.load(f)
    return []

def save_file(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

for file in [EVENTS_FILE, TASKS_FILE, ATTENDEES_FILE]:
    if not os.path.exists(file):
        save_file(file, [])

@app.route('/api/events', methods=['GET'])
def get_events():
    events = load_file(EVENTS_FILE)
    return jsonify(events), 200

@app.route('/api/events', methods=['POST'])
def create_event():
    event_data = request.json
    events = load_file(EVENTS_FILE)
    event_data['id'] = str(len(events) + 1)
    events.append(event_data)
    save_file(EVENTS_FILE, events)
    return jsonify({'message': 'Event created', 'event': event_data}), 201

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    events = load_file(EVENTS_FILE)
    event = next((e for e in events if e['id'] == event_id), None)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    events = [e for e in events if e['id'] != event_id]
    save_file(EVENTS_FILE, events)
    return jsonify({'message': 'Event deleted'}), 200

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = load_file(TASKS_FILE)
    return jsonify(tasks), 200

@app.route('/api/tasks', methods=['POST'])
def create_task():
    task_data = request.json
    tasks = load_file(TASKS_FILE)
    task_data['id'] = str(len(tasks) + 1)
    tasks.append(task_data)
    save_file(TASKS_FILE, tasks)
    return jsonify({'message': 'Task created', 'task': task_data}), 201

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    updated_task_data = request.json
    tasks = load_file(TASKS_FILE)
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    allowed_statuses = ["Pending", "Completed", "In Progress"]
    new_status = updated_task_data.get('status')
    if new_status and new_status not in allowed_statuses:
        return jsonify({'error': f"Invalid status value. Allowed values are: {', '.join(allowed_statuses)}."}), 400

    if new_status:
        task['status'] = new_status

    task.update({k: v for k, v in updated_task_data.items() if k != 'status'})

    save_file(TASKS_FILE, tasks)
    return jsonify({'message': 'Task updated successfully', 'task': task}), 200

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_file(TASKS_FILE)
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    tasks = [t for t in tasks if t['id'] != task_id]
    save_file(TASKS_FILE, tasks)
    return jsonify({'message': 'Task deleted'}), 200

@app.route('/api/attendees', methods=['GET'])
def get_attendees():
    attendees = load_file(ATTENDEES_FILE)
    return jsonify(attendees), 200

@app.route('/api/attendees', methods=['POST'])
def create_attendee():
    attendee_data = request.json
    attendees = load_file(ATTENDEES_FILE)
    attendee_data['id'] = str(len(attendees) + 1)
    attendees.append(attendee_data)
    save_file(ATTENDEES_FILE, attendees)
    return jsonify({'message': 'Attendee created', 'attendee': attendee_data}), 201

@app.route('/api/attendees/<attendee_id>', methods=['PUT'])
def update_attendee(attendee_id):
    updated_attendee = request.json
    attendees = load_file(ATTENDEES_FILE)
    for attendee in attendees:
        if attendee['id'] == attendee_id:
            attendee.update(updated_attendee)
            break
    else:
        return jsonify({'error': 'Attendee not found'}), 404
    save_file(ATTENDEES_FILE, attendees)
    return jsonify({'message': 'Attendee updated', 'attendee': updated_attendee}), 200

@app.route('/api/attendees/<attendee_id>', methods=['DELETE'])
def delete_attendee(attendee_id):
    attendees = load_file(ATTENDEES_FILE)
    attendee = next((a for a in attendees if a['id'] == attendee_id), None)
    if not attendee:
        return jsonify({'error': 'Attendee not found'}), 404
    attendees = [a for a in attendees if a['id'] != attendee_id]
    save_file(ATTENDEES_FILE, attendees)
    return jsonify({'message': 'Attendee deleted'}), 200

@app.route('/api/events/<event_id>/attendees', methods=['GET'])
def get_attendees_by_event(event_id):
    attendees = load_file(ATTENDEES_FILE)
    event_attendees = [attendee for attendee in attendees if attendee.get('assignedEvent') == event_id]
    return jsonify({'attendees': event_attendees, 'count': len(event_attendees)}), 200

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
