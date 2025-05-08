import pytest
from unittest.mock import patch, MagicMock
from drone import Drone
import time
import numpy as np


# ------------------ Tests for start ------------------

@patch.object(Drone, 'detect_seats', return_value=True)
@patch.object(Drone, 'disinfect_seats')
@patch.object(Drone, 'num_of_seats')
def test_start(mock_num_of_seats, mock_disinfect_seats, mock_detect_seats):
    drone = Drone(drone_id="DRONE001", distance=100, disinfection_time=10)
    drone.seat_count = 5  # Simulate 5 seats detected

    drone.start()

    mock_detect_seats.assert_called_once()
    mock_disinfect_seats.assert_called_once()
    mock_num_of_seats.assert_called_once()
    assert drone.seat_count == 5


@patch.object(Drone, 'detect_seats', return_value=True)
@patch.object(Drone, 'disinfect_seats')
@patch.object(Drone, 'num_of_seats')
def test_start_with_invalid_seat_count(mock_num_of_seats, mock_disinfect_seats, mock_detect_seats):
    drone = Drone(drone_id="DRONE001", distance=100, disinfection_time=10)
    drone.seat_count = -5  # Invalid seat count

    drone.start()

    mock_detect_seats.assert_called_once()
    mock_disinfect_seats.assert_not_called()
    mock_num_of_seats.assert_not_called()
    assert drone.seat_count < 0


@patch.object(Drone, 'detect_seats', return_value=False)
def test_start_no_seats_detected(mock_detect_seats):
    drone = Drone(drone_id="DRONE002", distance=100, disinfection_time=10)

    drone.start()

    mock_detect_seats.assert_called_once()
    assert drone.seat_count == 0


@patch.object(Drone, 'detect_seats', return_value=False)
def test_start_with_invalid_detection(mock_detect_seats):
    drone = Drone(drone_id="DRONE002", distance=100, disinfection_time=10)

    drone.start()

    mock_detect_seats.assert_called_once()
    assert drone.seat_count == 0


# ------------------ Tests for detect_seats ------------------

@patch('drone.YOLO')
def test_detect_seats_valid(mock_yolo):
    mock_cls = MagicMock()
    mock_cls.cpu.return_value.numpy.return_value = np.array([0, 0])

    mock_boxes = MagicMock()
    mock_boxes.cls = mock_cls

    mock_result = MagicMock()
    mock_result.boxes = mock_boxes

    mock_model = MagicMock(return_value=[mock_result])
    mock_yolo.return_value = mock_model

    drone = Drone(drone_id="DRONE001", distance=100, disinfection_time=10)
    result = drone.detect_seats()

    assert result is True
    assert drone.seat_count == 2


@patch('drone.YOLO')
def test_detect_seats_invalid(mock_yolo):
    mock_result = MagicMock()
    mock_result.boxes = None

    mock_model = MagicMock(return_value=[mock_result])
    mock_yolo.return_value = mock_model

    drone = Drone(drone_id="DRONE002", distance=100, disinfection_time=10)
    result = drone.detect_seats()

    assert result is False
    assert drone.seat_count == 0


# ------------------ Tests for disinfect_seats ------------------

def test_disinfect_seats_valid():
    drone = Drone(drone_id="DRONE003", distance=100, disinfection_time=10)
    drone.seat_count = 3

    with patch('time.sleep', return_value=None):  # Prevent delay
        drone.disinfect_seats()

    assert drone.seat_count == 3


def test_disinfect_seats_invalid():
    drone = Drone(drone_id="DRONE004", distance=100, disinfection_time=10)
    drone.seat_count = 0

    drone.disinfect_seats()

    assert drone.seat_count == 0


# ------------------ Tests for num_of_seats ------------------

@patch.object(Drone, 'detect_seats', return_value=True)
@patch('drone.supabase')
def test_num_of_seats_valid(mock_supabase, mock_detect_seats):
    mock_supabase.table.return_value.insert.return_value.execute.return_value.status_code = 201

    drone = Drone(drone_id="DRONE005", distance=100, disinfection_time=10)
    drone.seat_count = 5

    result = drone.num_of_seats()

    assert result == 5
    mock_supabase.table.assert_called_once_with("Report")


@patch.object(Drone, 'detect_seats', return_value=False)
@patch('drone.supabase')
def test_num_of_seats_invalid(mock_supabase, mock_detect_seats):
    drone = Drone(drone_id="DRONE006", distance=100, disinfection_time=10)
    drone.seat_count = 0

    result = drone.num_of_seats()

    assert result == 0
    mock_supabase.table.assert_not_called()