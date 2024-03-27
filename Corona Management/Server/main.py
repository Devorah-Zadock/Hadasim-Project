import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
from access_data import AccessData
from member import Member
from corona_details import CoronaDetails
from vaccination_details import VaccinationDetails
import tempfile
import base64

app = Flask(__name__)
CORS(app)
accessData = AccessData()

@app.route('/read_members', methods=['POST'])
def read_members():
    try:
        members = accessData.read_members()
        members_list = []
        for member in members:
            m = {
                'member_id': member.member_id,
                'last_name': member.last_name,
                'first_name': member.first_name,
                'street': member.street,
                'house_number': member.house_number,
                'city': member.city,
                'birth_date': member.birth_date.strftime('%d.%m.%Y'),
                'phone': member.phone,
                'mobile_phone': member.mobile_phone
            }
            members_list.append(m)

        return jsonify({'members': members_list}), 200

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

@app.route('/create_member', methods=['POST'])
def create_member():
    try:
        member_id = request.form.get('memberId')
        last_name = request.form.get('lastName')
        first_name = request.form.get('firstName')
        street = request.form.get('street')
        house_number = request.form.get('houseNumber')
        city = request.form.get('city')
        birth_date = request.form.get('birthDate')
        phone = request.form.get('phone')
        mobile_phone = request.form.get('mobilePhone')
        member_image = request.files['memberImage'] if 'memberImage' in request.files else None

        if member_image:
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                member_image.save(temp_file)
                temp_file_path = temp_file.name

            # Create the Member object
        member = Member(member_id, last_name, first_name, street, house_number, city, birth_date, phone, mobile_phone)

        # Set the member image if available
        if member_image:
            member.set_member_image(temp_file_path)
        coronaDetails = CoronaDetails(member_id=member_id)

        if accessData.create_member(member, coronaDetails):
            return jsonify({'success': 'Member added successfully'}), 200
        else:
            return jsonify({'error': 'Failed to add member'}), 400

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

@app.route('/read_member', methods=['POST'])
def read_member():
    try:
        data = request.get_json()
        if data is None or 'member_id' not in data:
            raise ValueError("Invalid request format or missing member_id")

        member_id = data.get('member_id')
        member = accessData.read_member(member_id)

        member_image = member.get_member_image()
        member_image_base64 = None
        if member_image is not None:
            _, buffer = cv2.imencode('.jpg', member_image)
            member_image_base64 = base64.b64encode(buffer).decode('utf-8')
        m = {
                'member_id': member.member_id,
                'last_name': member.last_name,
                'first_name': member.first_name,
                'street': member.street,
                'house_number': member.house_number,
                'city': member.city,
                'birth_date': member.birth_date.strftime('%d.%m.%Y'),
                'phone': member.phone,
                'mobile_phone': member.mobile_phone,
                'member_image': member_image_base64,
        }

        return jsonify({'member': m}), 200

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

@app.route('/update_member', methods=['POST'])
def update_member():
    try:
        member_id = request.form.get('memberId')
        last_name = request.form.get('lastName')
        first_name = request.form.get('firstName')
        street = request.form.get('street')
        house_number = request.form.get('houseNumber')
        city = request.form.get('city')
        birth_date = request.form.get('birthDate')
        phone = request.form.get('phone')
        mobile_phone = request.form.get('mobilePhone')

        member = Member(member_id, last_name, first_name, street, house_number, city, birth_date, phone, mobile_phone)
        accessData.update_member(member)

        return jsonify({'success': 'Member updated successfully'}), 200

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

@app.route('/delete_member', methods=['POST'])
def delete_member():
    try:
        member_id = request.json.get('member_id')
        accessData.delete_member(member_id)

        return jsonify({'success': 'Member removed successfully'}), 200

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400


@app.route('/read_corona_details', methods=['POST'])
def read_corona_details():
    try:
        request_data = request.get_json()
        member_id = request_data.get('member_id')

        if member_id is None:
            raise ValueError("Invalid request format or missing member_id")

        m = accessData.read_member(member_id)
        member_corona_details = accessData.read_corona_details(member_id)

        if member_corona_details is not None:
            corona_details = {
                'member_id': m.member_id,
                'last_name': m.last_name,
                'first_name': m.first_name,
                'positive_result': member_corona_details.positive_result,
                'recovery_from_disease': member_corona_details.recovery_from_disease,
            }
        else:
            corona_details = None

        member_vaccination_details = accessData.read_vaccination_details(member_id)
        member_all_vaccination_details = []

        if member_vaccination_details is not None:
            for vaccination_details in member_vaccination_details:
                vd = {
                    'vaccination_id': vaccination_details.vaccination_id,
                    'vaccination_number': vaccination_details.vaccination_number,
                    'vaccination_date': vaccination_details.vaccination_date,
                    'manufacturer': vaccination_details.manufacturer,
                }
                member_all_vaccination_details.append(vd)
        else:
            print("No vaccination details found for member ID:", member_id)

        return jsonify({'corona_details': corona_details, 'vaccination_details': member_all_vaccination_details}), 200

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

@app.route('/update_corona_details', methods=['POST'])
def update_corona_details():
    try:
        member_id = request.form.get('memberId')
        positive_result = request.form.get('positiveResult')
        recovery_from_disease = request.form.get('recoveryFromDisease')

        corona_details = CoronaDetails(member_id, positive_result, recovery_from_disease)
        accessData.update_corona_details(corona_details)

        return jsonify({'success': 'Corona details updated successfully'}), 200

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

@app.route('/next_vaccination_number', methods=['POST'])
def next_vaccination_number():
    try:
        data = request.get_json()
        if data is None or 'member_id' not in data:
            raise ValueError("Invalid request format or missing member_id")

        member_id = data.get('member_id')
        next_vaccination = accessData.get_next_vaccination(member_id)
        return jsonify({'nextVaccinationNumber': next_vaccination}), 200

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

@app.route('/create_vaccination', methods=['POST'])
def create_vaccination():
    try:
        member_id = request.form.get('memberId')
        vaccination_number = request.form.get('vaccinationNumber')
        vaccination_date = request.form.get('vaccinationDate')
        manufacturer = request.form.get('manufacturer')

        vaccinationDetails = VaccinationDetails(member_id, vaccination_number, vaccination_date, manufacturer)
        if accessData.create_vaccination(vaccinationDetails):
            return jsonify({'success': 'Vaccination added successfully'}), 200
        else:
            return jsonify({'error': 'Failed to add vaccination'}), 400

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

@app.route('/update_vaccination', methods=['POST'])
def update_vaccination():
    try:
        # vaccination_id = request.form.get('vaccinationId')
        member_id = request.form.get('memberId')
        vaccination_number = request.form.get('vaccinationNumber')
        vaccination_date = request.form.get('vaccinationDate')
        manufacturer = request.form.get('manufacturer')

        vaccination = VaccinationDetails(member_id, vaccination_number, vaccination_date, manufacturer)
        accessData.update_vaccination(vaccination)

        return jsonify({'success': 'Vaccination updated successfully'}), 200

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

@app.route('/delete_vaccination', methods=['POST'])
def delete_vaccination():
    try:
        vaccination_id = request.json.get('vaccination_id')
        accessData.delete_vaccination(vaccination_id)

        return jsonify({'success': 'Vaccination removed successfully'}), 200

    except Exception as e:
        # Print the error message
        print(str(e))
        # Return an error response
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Run the application in debug mode
    app.run(debug=True)

