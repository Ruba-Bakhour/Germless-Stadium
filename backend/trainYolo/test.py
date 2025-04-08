# test_yolo_video.py
import cv2
from YoloModel import YOLOModel 

model_path = "C:/Users/L/Germless-Stadium/backend/trainYolo/runs/detect/train5/weights/last.pt"
video_path = "C:/Users/L/Downloads/youtube_Mi9kUQbC2KM_1080x1920_h264_mute.mp4"

yolo = YOLOModel(model_path)
cap = cv2.VideoCapture(video_path)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    detections = yolo.detect(frame)

    for det in detections:
        x1, y1, x2, y2 = det['box']
        label = det['label']
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 3)
        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)

    cv2.imshow("YOLO Video Detection", frame)
    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
