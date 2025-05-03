import pytest
from unittest.mock import patch, MagicMock
from drone import Drone

@patch('drone.Drone.detect_seats')
@patch('drone.Drone.disinfect_seats')
@patch('drone.Drone.num_of_seats')
def test_start(mock_num_of_seats, mock_disinfect_seats, mock_detect_seats):
    # Arrange
    mock_detect_seats.return_value = True  # seats being detected
    drone = Drone(drone_id="DRONE001", distance=100, disinfection_time=10)
    drone.seat_count = 5  # 5 seats detected

    # Act
    drone.start()

    # Assert
    mock_detect_seats.assert_called_once()  # Ensure detect_seats was called
    mock_disinfect_seats.assert_called_once()  # Ensure disinfect_seats was called
    mock_num_of_seats.assert_called_once()  # Ensure num_of_seats was called
    assert drone.seat_count == 5  # Ensure seat_count is correct

@patch('drone.Drone.detect_seats')
def test_start_no_seats_detected(mock_detect_seats):
    # Arrange
    mock_detect_seats.return_value = False  # no seats detected
    drone = Drone(drone_id="DRONE002", distance=100, disinfection_time=10)

    # Act
    drone.start()

    # Assert
    mock_detect_seats.assert_called_once()  # Ensure detect_seats was called
    assert drone.seat_count == 0  # Ensure seat_count remains 0






    