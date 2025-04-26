from datetime import date 
from ultralytics import YOLO  
from supabase import create_client, Client  

# Supabase client
url = "https://umblwntwmhxwempxdrfm.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtYmx3bnR3bWh4d2VtcHhkcmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NzU5NDgsImV4cCI6MjA1NTQ1MTk0OH0.SNhe6JMa7n0zm3gUjTVtST76CYp_Zl9oI868IHJtvJ4"
supabase: Client = create_client(url, key)

class drone:
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
        # Code to detect seats using YOLO model
        # Load the YOLO model and perform detection
        print(f"Drone {self.drone_id} is detecting seats...")
        results = self.model("C:/Users/L/Germless-Stadium/backend/trainYolo/test/oM2J9YjeIzPvYfqHxn5gSAUBDpeViACXzQAgqA.mp4") 
        seats_detected = 0

        # Process the results to count seats
        for result in results:
            for box in result.boxes:
                if box.cls == "chair":  #  "chair" is the class name for seats in your model
                    seats_detected += 1

        self.seat_count = seats_detected
        print(f"Detected {self.seat_count} seats.")
        return seats_detected > 0
    

    def start(self):
        print(f"Drone {self.drone_id} is starting...")
    
        # Step 1: Detect seats
        print("Detecting seats...")
        if not self.detect_seats():
            print(f"Drone {self.drone_id} could not detect any seats. Aborting operation.")
            return
    
        # Step 2: Start disinfection process
        print(f"Drone {self.drone_id} detected {self.seat_count} seats. Starting disinfection process...")
        self.disinfect_seats()
    
        # Step 3: Complete operation
        print(f"Drone {self.drone_id} has completed its operation.")
        
        

def num_of_seats(self) -> int:
    # Call the detect_seats method to get the number of seats detected
    if self.detect_seats():
        print(f"Drone {self.drone_id} has processed {self.seat_count} seats.")

        data = {
            "total_seats": self.seat_count,
            "distance": null,  # Placeholder for distance
            "User-ID": "db4e5bab-60e4-4ec7-9ef4-02aa7cb3aef2",  
            "title": "Report - "+datetime.now().isoformat()  
        }
        response = supabase.table("Report").insert(data).execute()

        if response.status_code == 201:
            print("Data successfully inserted into Supabase.")
        else:
            print("Failed to insert data into Supabase.", response)

    else:
        print(f"Drone {self.drone_id} could not detect any seats.")

    return self.seat_count  # Corrected indentation
