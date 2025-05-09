from datetime import date, datetime 
from ultralytics import YOLO  
from supabase import create_client, Client  
import time

# Supabase client
url = "https://umblwntwmhxwempxdrfm.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtYmx3bnR3bWh4d2VtcHhkcmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NzU5NDgsImV4cCI6MjA1NTQ1MTk0OH0.SNhe6JMa7n0zm3gUjTVtST76CYp_Zl9oI868IHJtvJ4"
supabase: Client = create_client(url, key)

class Drone:
    def __init__(self, drone_id: str, distance: int, disinfection_time: int):
        self.drone_id = drone_id
        self.distance = distance
        self.disinfection_time = disinfection_time
        self.seat_count = 0
        self.model = YOLO("C:/Users/L/Germless-Stadium/backend/trainYolo/runs/detect/train5/weights/last.pt")  # Load a pre-trained YOLO model (replace with your model path) 


    def disinfect_seats(self):
        if self.seat_count == 0:
            print(f"Drone {self.drone_id} cannot disinfect as no seats were detected.")
            return

        print(f"Drone {self.drone_id} is starting the disinfection process...")
        for seat in range(self.seat_count):
            print(f"Disinfecting seat {seat + 1} of {self.seat_count}...")
            # Simulate stopping the drone's movement for 10 seconds
            print(f"Drone {self.drone_id} is stopping for disinfection...")
            time.sleep(10)  # Stop for 10 seconds to simulate disinfection
            print(f"Disinfection of seat {seat + 1} completed.")
        print(f"Drone {self.drone_id} has completed disinfection of {self.seat_count} seats.")


    def detect_seats(self) -> bool:
        print(f"Drone {self.drone_id} is detecting seats...")

    # Run YOLO on the video
        results = self.model("C:/Users/L/Germless-Stadium/backend/trainYolo/test/video5796392827940247650.mp4")

        total_chairs = 0
        chair_class_id = 0  

        for result in results:
            if result.boxes is not None:
                # Get class IDs of all detections in this frame
                classes = result.boxes.cls.cpu().numpy()  # get as numpy array

                # Count how many are chairs (chair_class_id)
                chairs_in_frame = (classes == chair_class_id).sum()

                total_chairs += chairs_in_frame

        self.seat_count = int(total_chairs)
        print(f"Total chairs detected in the video: {self.seat_count}")
    
        return self.seat_count > 0

    

    def start(self):
        print(f"Drone {self.drone_id} is starting...")

        if not self.detect_seats():
            print(f"Drone {self.drone_id} failed to detect seats. Aborting mission.")
            return

        if self.seat_count < 0:
            print(f"Drone {self.drone_id} has an invalid seat count. Aborting operation.")
            return

        self.disinfect_seats()
        self.num_of_seats()
        

    def num_of_seats(self) -> int:
        if self.detect_seats():
            data = {
                "total_seats": self.seat_count,
                "distance": None,
                "User-ID": "db4e5bab-60e4-4ec7-9ef4-02aa7cb3aef2",
                "title": "Report - " + datetime.now().isoformat()
            }
            response = supabase.table("Report").insert(data).execute()
            if response.status_code == 201:
                print("Data successfully inserted into Supabase.")
            else:
                print("Failed to insert data into Supabase.", response)
        return self.seat_count