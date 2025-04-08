import cv2
from ultralytics import YOLO

class YOLOModel:
    def __init__(self, model_path: str, threshold: float = 0.1):
        self.model = YOLO(model_path)
        self.threshold = threshold

    def detect(self, frame):
        results = self.model(frame)[0]
        detections = []

        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = result
            if score > self.threshold:
                detections.append({
                    'box': (int(x1), int(y1), int(x2), int(y2)),
                    'class_id': int(class_id),
                    'score': score,
                    'label': results.names[int(class_id)].upper()
                })

        return detections
