import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from supabase import create_client, Client

import cv2
import time
from ultralytics import YOLO
from drone import Drone

app = Flask(__name__)
CORS(app)

# Supabase project info
SUPABASE_URL = 'https://umblwntwmhxwempxdrfm.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtYmx3bnR3bWh4d2VtcHhkcmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NzU5NDgsImV4cCI6MjA1NTQ1MTk0OH0.SNhe6JMa7n0zm3gUjTVtST76CYp_Zl9oI868IHJtvJ4'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load YOLO model
model_path = "C:/Users/L/Germless-Stadium/backend/trainYolo/runs/detect/train5/weights/last.pt"
video_path = "C:/Users/L/Germless-Stadium/backend/trainYolo/test/video5796392827940247650.mp4"
model = YOLO(model_path)
threshold = 0.4

# Initialize drone
drone = Drone(drone_id="1", distance=5, disinfection_time=10)

# --------------------- Global Variables ---------------------
cap = cv2.VideoCapture(video_path)
total_chairs_detected = 0  # Global counter
counted_frames = False    # To not recount if video restarts

# --------------------- Drone Movement ---------------------
@app.route('/api/drone/move', methods=['POST'])
def move_drone():
    data = request.get_json()
    if not data or 'direction' not in data:
        return jsonify({'error': 'Direction is required'}), 400

    direction = data['direction']

    if direction == 'disinfect':
        print("Starting disinfection process...")

        # Use the chairs already counted
        drone.seat_count = total_chairs_detected
        drone.start()

        return jsonify({'success': True, 'message': f'Disinfection started. Detected {total_chairs_detected} chairs.'})

    print(f"Moving drone {direction}")
    return jsonify({'success': True, 'message': f'Drone moved {direction}'})

# --------------------- Video Feed + Counting ---------------------
def generate_frames():
    global total_chairs_detected, counted_frames

    while True:
        success, frame = cap.read()
        if not success:
            print("End of video.")
            break

        # Resize for performance
        frame = cv2.resize(frame, (480, 360))

        # Run YOLO detection
        results = model(frame)[0]

        # Count chairs once during the video
        if not counted_frames:
            for result in results.boxes.data.tolist():
                x1, y1, x2, y2, score, class_id = result
                if score > threshold:
                    label = results.names[int(class_id)]
                    if label.lower() == 'chair':
                        total_chairs_detected += 1

        # Draw boxes
        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = result
            if score > threshold:
                label = results.names[int(class_id)].upper()
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                cv2.putText(frame, label, (int(x1), int(y1) - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        # Encode as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        time.sleep(1 / 30)  # Control framerate

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    counted_frames = True  # Mark that counting is done after video finishes

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# --------------------- Run Server ---------------------
if __name__ == '__main__':
    app.run(debug=True, threaded=True)
