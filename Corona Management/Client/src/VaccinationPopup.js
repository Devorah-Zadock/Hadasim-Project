import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const VaccinationPopup = ({ isOpen, onClose, actionType, selectedVaccination, member_Id }) => {
    const [vaccinationId, setVaccinationId] = useState('');
    const [memberId, setMemberId] = useState('');
    const [vaccinationNumber, setVaccinationNumber] = useState('');
    const [vaccinationDate, setVaccinationDate] = useState('');
    const [manufacturer, setManufacturer] = useState('');

    const inputRef = useRef(null);

    useEffect(() => {
        setMemberId(member_Id);

        if (isOpen && actionType === 'create') {
            fetchNextVaccinationNumber();
        }
        else {
            if (selectedVaccination) {
                setVaccinationId(selectedVaccination.vaccination_id)
                setVaccinationNumber(selectedVaccination.vaccination_number)
                setVaccinationDate(selectedVaccination.vaccination_date);
                setManufacturer(selectedVaccination.manufacturer);
            }
        }
    }, [selectedVaccination, member_Id, isOpen, actionType]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const fetchNextVaccinationNumber = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/next_vaccination_number', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ member_id: memberId })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch next vaccination number');
            }
            const data = await response.json();
            setVaccinationNumber(data.nextVaccinationNumber);
        } catch (error) {
            console.error('Error fetching next vaccination number:', error);
        }
    };

    const addVaccination = () => {
        var formData = new FormData();
        formData = data_filling(formData);
        if (formData) {

            fetch('http://127.0.0.1:5000/create_vaccination', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        <label>"Vaccination added successfully"</label>
                        alert('חיסון נוסף בהצלחה!');
                        refreshPage();
                    } else {
                        alert('שגיאה בהוספת חיסון');
                    }
                })
                .catch((error) => {
                    console.log('Error:', error);
                });
        }
    }

    const updateVaccination = () => {
        var formData = new FormData();
        formData = data_filling(formData);

        if (formData) {

            fetch('http://127.0.0.1:5000/update_vaccination', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        <label>"Vaccination updated successfully"</label>
                        alert('פרטי חיסון התעדכנו בהצלחה!');
                        refreshPage();
                    } else {
                        alert('שגיאה בעדכון חיסון');
                    }
                })
                .catch((error) => {
                    console.log('Error:', error);
                });
        }
    }

    const data_filling = (formData) => {
        if (vaccinationNumber != '' && vaccinationDate != '' && manufacturer != '') {
            handleClose();

            formData.append('vaccinationId', vaccinationId);
            formData.append('memberId', memberId);
            formData.append('vaccinationNumber', vaccinationNumber);
            formData.append('vaccinationDate', vaccinationDate);
            formData.append('manufacturer', manufacturer);

            return (formData);
        }
        else {
            alert("נא מלא את כל הפרטים");
            return null;
        }
    }

    const refreshPage = () => {
        window.location.reload();
    };

    const handleClose = () => {
        onClose();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (actionType === 'create') {
                addVaccination();
            }
            else {
                updateVaccination();
            }
        }
    }

    const performAction = () => {
        switch (actionType) {
            case 'create':
                addVaccination();
                break;
            case 'update':
                updateVaccination();
                break;
            default:
                break;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup">
            <div className="popup-content">
                <button className="close-btn" onClick={handleClose}>x</button>
                <br />
                <p>מספר זהות: {memberId}</p>
                <p>מספר חיסון: {vaccinationNumber}</p>
                <input
                    type="date"
                    placeholder="תאריך חיסון"
                    value={vaccinationDate}
                    onChange={(e) => setVaccinationDate(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="text"
                    placeholder="יצרן חיסון"
                    value={manufacturer}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\d/g, '');
                        setManufacturer(value);
                    }}
                    onKeyPress={handleKeyPress}
                />
                <br />
                <button onClick={performAction}>אישור</button>
            </div>
        </div >
    )
}

export default VaccinationPopup;