import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CoronaPopup = ({ isOpen, onClose, coronaDetails }) => {
    const [memberId, setMemberId] = useState('');
    const [positiveResult, setPositiveResult] = useState('');
    const [recoveryFromDisease, setRecoveryFromDisease] = useState('');

    const inputRef = useRef(null);

    useEffect(() => {
        if (coronaDetails) {
            setMemberId(coronaDetails.member_id || '');
            setPositiveResult(coronaDetails.positive_result || '');
            setRecoveryFromDisease(coronaDetails.recovery_from_disease || '');
        }
    }, [coronaDetails]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const updateCoronaDetails = () => {
        var formData = new FormData();
        formData = data_filling(formData);

        if (formData) {

            fetch('http://127.0.0.1:5000/update_corona_details', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to update corona details');
                    }
                })
                .then((data) => {
                    alert('פרטי קורונה התעדכנו בהצלחה!');
                    refreshPage();
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('שגיאה בעדכון פרטי קורונה');
                });
        }
    }


    const data_filling = (formData) => {
        handleClose();
        formData.append('memberId', memberId);
        formData.append('positiveResult', positiveResult);
        formData.append('recoveryFromDisease', recoveryFromDisease);
        return (formData);
    }

    const refreshPage = () => {
        window.location.reload();
    };

    const handleClose = () => {
        onClose();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            updateCoronaDetails();
        }
    }

    if (!isOpen) return null;

    return (
        <div className="popup">
            <div className="popup-content">
                <button className="close-btn" onClick={handleClose}>x</button>
                <br />
                <p><b>מספר זהות: </b>{memberId}</p>

                <input
                    type="date"
                    placeholder="תאריך לידה"
                    value={positiveResult}
                    onChange={(e) => setPositiveResult(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="date"
                    placeholder="תאריך לידה"
                    value={recoveryFromDisease}
                    onChange={(e) => setRecoveryFromDisease(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <br />

                <button onClick={updateCoronaDetails}>אישור</button>
            </div>
        </div >
    )
}

export default CoronaPopup;