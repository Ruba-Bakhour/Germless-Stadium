from datetime import date 
from ultralytics import YOLO  # Import YOLO library


class drone:
    def __init__(self, drone_id: str, distance: int, disinfection_time: int):
        self.drone_id = drone_id
        self.distance = distance
        self.disinfection_time = disinfection_time
        self.seat_count = 0
        self.model = YOLO("C:/Users/L/Germless-Stadium/backend/trainYolo/runs/detect/train5/weights/last.pt")  # Load a pre-trained YOLO model (replace with your model path) 


    
    def disinfect_seats(self):
        #our code or call to start the disinfection process 
        print(f"Drone {self.drone_id} is disinfecting seats...")


    def navigate(self):
        #our code or call to start the navigation process
        print(f"Drone {self.drone_id} is navigating...")

    def detect_seats(self) -> bool:
        # Code to detect seats using YOLO model
        # Load the YOLO model and perform detection
        print(f"Drone {self.drone_id} is detecting seats...")
        results = self.model("C:/Users/L/Germless-Stadium/backend/trainYolo/test/images (2).jpg")  # Replace with the path to your image or video frame
        seats_detected = 0

        # Process the results to count seats
        for result in results:
            for box in result.boxes:
                if box.cls == "chair":  # Assuming "chair" is the class name for seats in your model
                    seats_detected += 1

        self.seat_count = seats_detected
        print(f"Detected {self.seat_count} seats.")
        return seats_detected > 0
    
    def start_drone(self):
        #our code or call to start the drone
        print(f"Drone {self.drone_id} is starting...")

    def num_of_seats(self) -> int:
       # Ensure the seat count is updated before returning
      if self.detect_seats():
          print(f"Drone {self.drone_id} has processed {self.seat_count} seats.")
      else:
            print(f"Drone {self.drone_id} could not detect any seats.")
      return self.seat_count