from datetime import date 

class drone:
    def __init__(self, drone_id: str, distance: int, disinfection_time: int):
        self.drone_id = drone_id
        self.distance = distance
        self.disinfection_time = disinfection_time
        self.seat_count = 0

    
    def disinfect_seats(self):
        #our code or call to start the disinfection process 
        print(f"Drone {self.drone_id} is disinfecting seats...")


    def navigate(self):
        #our code or call to start the navigation process
        print(f"Drone {self.drone_id} is navigating...")

    def detect_seats(self) -> bool:
        #call the yolo model 
        print(f"Drone {self.drone_id} is detecting seats...")
        return True
    
    def start_drone(self):
        #our code or call to start the drone
        print(f"Drone {self.drone_id} is starting...")

    def num_of_seats(self) -> int:
        #code for calculating the seats 
        print(f"Drone {self.drone_id} has processed {self.seat_count} seats.")
        return self.seat_count
