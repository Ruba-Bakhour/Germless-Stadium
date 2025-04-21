import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

import cv2
import time
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)


# Load your trained YOLO model
model_path = "C:/Users/L/Germless-Stadium/backend/trainYolo/runs/detect/train5/weights/last.pt"
video_path = "C:/Users/L/Germless-Stadium/backend/trainYolo/test/oM2J9YjeIzPvYfqHxn5gSAUBDpeViACXzQAgqA.mp4"
model = YOLO(model_path)
threshold = 0.4

# Open the video file (replace with 0 if using webcam)
cap = cv2.VideoCapture(video_path)

# --------------------- Drone Movement ---------------------
@app.route('/api/drone/move', methods=['POST'])
def move_drone():
    data = request.get_json()
    if not data or 'direction' not in data:
        return jsonify({'error': 'Direction is required'}), 400

    direction = data['direction']
    print(f"Moving drone {direction}")
    return jsonify({'success': True, 'message': f'Drone moved {direction}'})


# --------------------- Video Feed with YOLO ---------------------
def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        # Resize for performance
        frame = cv2.resize(frame, (480, 360))

        # Run YOLO detection
        results = model(frame)[0]

        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = result
            if score > threshold:
                # Draw box and label
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                label = results.names[int(class_id)].upper()
                cv2.putText(frame, label, (int(x1), int(y1) - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        # Encode as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        # Add frame rate control (~30 FPS)
        time.sleep(1 / 30)

        # Stream the frame
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# --------------------- Run ---------------------
if __name__ == '__main__':
    app.run(debug=True, threaded=True)

