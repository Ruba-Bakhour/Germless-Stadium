import os
from ultralytics import YOLO
import cv2

# Paths
IMAGES_DIR = "C:/Users/L/Germless-Stadium/backend/trainYolo/test"
OUTPUT_DIR = "C:/Users/L/Germless-Stadium/backend/trainYolo/output_images"
os.makedirs(OUTPUT_DIR, exist_ok=True) #?

model_path = "C:/Users/L/Germless-Stadium/backend/trainYolo/runs/detect/train5/weights/last.pt"

# Load model
model = YOLO(model_path)
threshold = 0.1

# Loop over all images
for image_name in os.listdir(IMAGES_DIR):
    image_path = os.path.join(IMAGES_DIR, image_name)

    # Read image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Failed to read {image_name}")
        continue

    results = model(image)[0]

    for result in results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = result

        if score > threshold:
            cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 4)
            cv2.putText(image, results.names[int(class_id)].upper(), (int(x1), int(y1 - 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)

    # Save processed image
    output_path = os.path.join(OUTPUT_DIR, f"detected_{image_name}")
    cv2.imwrite(output_path, image)
    print(f"Processed and saved {output_path}")

cv2.destroyAllWindows()
