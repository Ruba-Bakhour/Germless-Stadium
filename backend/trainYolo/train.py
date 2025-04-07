from ultralytics import YOLO

#load a model
model = YOLO("yolov8n.yaml")

#use the model
results = model.train(data="C:/Users/L/Germless-Stadium/backend/trainYolo/data.yaml", epochs=200)
