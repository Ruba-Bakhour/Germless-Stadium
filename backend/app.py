from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/drone/move', methods=['POST'])
def move_drone():
    data = request.get_json()

    if not data or 'direction' not in data:
        return jsonify({'error': 'Direction is required'}), 400

    direction = data['direction']
    print(f"Moving drone {direction}")

    # Add your drone control logic here

    return jsonify({'success': True, 'message': f'Drone moved {direction}'})

if __name__ == '__main__':
    app.run(debug=True)