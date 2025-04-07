from datetime import date 

class drone:
    def __init__(self, drone_id: str, distance: int, disinfection_time: int):
        self.drone_id = drone_id
        self.distance = distance
        self.disinfection_time = disinfection_time

    
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
