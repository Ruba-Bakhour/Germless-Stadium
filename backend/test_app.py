import pytest
import numpy as np
from unittest.mock import patch, MagicMock
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# ------------------- TEST /api/drone/move -------------------

@patch('app.drone')
def test_move_drone_valid_direction(mock_drone, client):
    response = client.post('/api/drone/move', json={'direction': 'left'})
    assert response.status_code == 200
    assert response.get_json()['message'] == 'Drone moved left'

@patch('app.drone')
def test_move_drone_disinfect(mock_drone, client):
    mock_instance = MagicMock()
    mock_drone.seat_count = 10
    mock_drone.start = MagicMock()
    
    with patch('app.drone', mock_instance):
        response = client.post('/api/drone/move', json={'direction': 'disinfect'})
        assert response.status_code == 200
        assert 'Disinfection started' in response.get_json()['message']

def test_move_drone_missing_direction(client):
    response = client.post('/api/drone/move', json={})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Direction is required'

# ------------------- TEST /video_feed -------------------

@patch('app.cap')
@patch('app.model')
def test_video_feed(mock_model, mock_cap, client):
    # Create a fake image frame (a black image)
    fake_frame = np.zeros((480, 640, 3), dtype=np.uint8)

    # Mock cap.read to return the fake frame
    mock_cap.read.return_value = (True, fake_frame)

    # Mock YOLO model output
    mock_results = MagicMock()
    mock_results.boxes.data.tolist.return_value = []
    mock_results.names = {0: 'chair'}
    mock_model.return_value = [mock_results]

    # Call the endpoint
    response = client.get('/video_feed')
    
    # Read one chunk from the generator to simulate streaming
    assert response.status_code == 200
    assert b'Content-Type: image/jpeg' in next(response.response)