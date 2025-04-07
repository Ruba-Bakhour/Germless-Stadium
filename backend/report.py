from datetime import date 


class Report:
    def __init__(self, report_id: str, report_date: date, total_distance: int, num_of_seats: int, total_disinfection_time:int):
        self.id = report_id
        self.date = report_date
        self.total_distance = total_distance
        self.num_of_seats = num_of_seats
        self.total_disinfection_time = total_disinfection_time


    def generate_report(self):
        print(f"Report ID: {self.id}")
        print(f"Date: {self.date}")
        print(f"Total Distance: {self.total_distance}")
        print(f"Number of Seats: {self.num_of_seats}")
        print(f"Total Disinfection Time: {self.total_disinfection_time}")