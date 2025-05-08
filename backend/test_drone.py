import pytest
from unittest.mock import patch, MagicMock
from drone import Drone
import time


# ------------------ Tests for start ------------------

@patch('drone.Drone.detect_seats')
@patch('drone.Drone.disinfect_seats')
@patch('drone.Drone.num_of_seats')
def test_start(mock_num_of_seats, mock_disinfect_seats, mock_detect_seats):
    # Arrange
    mock_detect_seats.return_value = True  # Simulate seats being detected
    drone = Drone(drone_id="DRONE001", distance=100, disinfection_time=10)
    drone.seat_count = 5  # Simulate 5 seats detected

    # Act
    drone.start()

    # Assert
    mock_detect_seats.assert_called_once()  # Ensure detect_seats was called
    mock_disinfect_seats.assert_called_once()  # Ensure disinfect_seats was called
    mock_num_of_seats.assert_called_once()  # Ensure num_of_seats was called
    assert drone.seat_count == 5  # Ensure seat_count is correct

@patch('drone.Drone.detect_seats')
@patch('drone.Drone.disinfect_seats')
@patch('drone.Drone.num_of_seats')
def test_start_with_invalid_seat_count(mock_num_of_seats, mock_disinfect_seats, mock_detect_seats):
    # Arrange
    mock_detect_seats.return_value = True  # Simulate seats being detected
    drone = Drone(drone_id="DRONE001", distance=100, disinfection_time=10)
    drone.seat_count = -5  # Invalid seat count (negative value)

    # Act
    drone.start()

    # Assert
    mock_detect_seats.assert_called_once()  # Ensure detect_seats was called
    mock_disinfect_seats.assert_not_called()  # Disinfection should not proceed with invalid data
    mock_num_of_seats.assert_not_called()  # Database insertion should not proceed with invalid data
    assert drone.seat_count < 0  # Ensure seat_count remains invalid


@patch('drone.Drone.detect_seats')
def test_start_no_seats_detected(mock_detect_seats):
    # Arrange
    mock_detect_seats.return_value = False  # Simulate no seats detected
    drone = Drone(drone_id="DRONE002", distance=100, disinfection_time=10)

    # Act
    drone.start()

    # Assert
    mock_detect_seats.assert_called_once()  # Ensure detect_seats was called
    assert drone.seat_count == 0  # Ensure seat_count remains 0

@patch('drone.Drone.detect_seats')
def test_start_with_invalid_detection(mock_detect_seats):
    # Arrange
    mock_detect_seats.return_value = False  # Simulate detection failure
    drone = Drone(drone_id="DRONE002", distance=100, disinfection_time=10)

    # Act
    drone.start()

    # Assert
    mock_detect_seats.assert_called_once()  # Ensure detect_seats was called
    assert drone.seat_count == 0  # Ensure seat_count remains 0

# ------------------ Tests for detect_seats ------------------

@patch('drone.YOLO')
def test_detect_seats_valid(mock_yolo):
    mock_yolo.return_value = MagicMock()
    mock_yolo.return_value.return_value = [
        MagicMock(boxes=MagicMock(cls=MagicMock(cpu=MagicMock(return_value=[0, 0]))))
    ]
    drone = Drone(drone_id="DRONE001", distance=100, disinfection_time=10)
    result = drone.detect_seats()
    assert result is True 
    assert drone.seat_count == 2  # Assuming 2 seats detected

@patch('drone.YOLO')
def test_detect_seats_invalid(mock_yolo):
    mock_yolo.return_value = MagicMock()
    mock_yolo.return_value.return_value = [MagicMock(boxes=None)]
    drone = Drone(drone_id="DRONE002", distance=100, disinfection_time=10)
    result = drone.detect_seats()
    assert result is False
    assert drone.seat_count == 0  # No seats detected

# ------------------ Tests for disinfect_seats ------------------

def test_disinfect_seats_valid():
    # Arrange
    drone = Drone(drone_id="DRONE003", distance=100, disinfection_time=10)
    drone.seat_count = 3  # Simulate 3 seats detected

    # Act
    with patch('time.sleep', return_value=None):  # Mock time.sleep to avoid delays
        drone.disinfect_seats()

    # Assert
    # Ensure the disinfection process completes without errors
    assert drone.seat_count == 3  # Seat count remains unchanged


def test_disinfect_seats_invalid():
    # Arrange
    drone = Drone(drone_id="DRONE004", distance=100, disinfection_time=10)
    drone.seat_count = 0  # No seats detected

    # Act
    drone.disinfect_seats()

    # Assert
    # Ensure the method exits early without errors
    assert drone.seat_count == 0  # Seat count remains 0


# ------------------ Tests for num_of_seats ------------------

@patch('drone.supabase')
def test_num_of_seats_valid(mock_supabase):
    # Arrange
    mock_supabase.table.return_value.insert.return_value.execute.return_value.status_code = 201
    drone = Drone(drone_id="DRONE005", distance=100, disinfection_time=10)
    drone.seat_count = 5  # Simulate 5 seats detected

    # Act
    result = drone.num_of_seats()

    # Assert
    assert result == 5  # Ensure the seat count is returned
    mock_supabase.table.assert_called_once_with("Report")  # Ensure data is inserted


@patch('drone.supabase')
def test_num_of_seats_valid(mock_supabase):
    # Arrange
    mock_supabase.table.return_value.insert.return_value.execute.return_value.status_code = 400
    drone = Drone(drone_id="DRONE006", distance=100, disinfection_time=10)
    drone.seat_count = 0  # No seats detected

    # Act
    result = drone.num_of_seats()

    # Assert
    assert result == 0  # Ensure the seat count is returned as 0
    mock_supabase.table.assert_not_called()  # Ensure no data is inserted