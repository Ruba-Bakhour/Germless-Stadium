from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/drone/move', methods=['POST'])
def move_drone():
    data = request.get_json()

    if not data or 'direction' not in data:
        return jsonify({'error': 'Direction is required'}), 400

    direction = data['direction']
    print(f"Moving drone {direction}")

    # Add your logic to communicate with the drone here
    # For example, send commands to the drone's control system

    return jsonify({'success': True, 'message': f'Drone moved {direction}'})

if __name__ == '__main__':
    app.run(debug=True)