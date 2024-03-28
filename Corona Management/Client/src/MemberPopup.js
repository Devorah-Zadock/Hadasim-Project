import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Popup = ({ isOpen, onClose, actionType, selectedMember }) => {
    const [memberId, setMemberId] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [city, setCity] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [mobilePhone, setMobilePhone] = useState('');
    const [memberImage, setMemberImage] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        if (selectedMember) {
            setMemberId(selectedMember.member_id || '');
            setLastName(selectedMember.last_name || '');
            setFirstName(selectedMember.first_name || '');
            setStreet(selectedMember.street || '');
            setHouseNumber(selectedMember.house_number || '');
            setCity(selectedMember.city || '');
            setBirthDate(selectedMember.birth_date || '');
            setPhone(selectedMember.phone || '');
            setMobilePhone(selectedMember.mobile_phone || '');
            setMemberImage(selectedMember.memberImage || null);
        }
    }, [selectedMember]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const addMember = () => {
        var formData = new FormData();
        formData = data_filling(formData);

        fetch('http://127.0.0.1:5000/create_member', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    <label>"Member added successfully"</label>
                    alert('חבר נוסף בהצלחה!');
                    refreshPage();
                } else {
                    alert('שגיאה בהוספת חבר, יתכן שמספר הזהות כבר קיים במערכת');
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

    const updateMember = () => {
        var formData = new FormData();
        formData = data_filling(formData);

        if (formData) {
            fetch('http://127.0.0.1:5000/update_member', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        <label>"Member updated successfully"</label>
                        alert('פרטי חבר התעדכנו בהצלחה!');
                        refreshPage();
                    } else {
                        alert('שגיאה בעדכון חבר');
                    }
                })
                .catch((error) => {
                    console.log('Error:', error);
                });
        }
    }

    const data_filling = (formData) => {
        if (memberId != '' && lastName != '' && firstName != '' && street != '' && houseNumber != '' && city != '' && birthDate != '' && phone != '' && mobilePhone != '') {
            handleClose();

            formData.append('memberId', memberId);
            formData.append('lastName', lastName);
            formData.append('firstName', firstName);
            formData.append('street', street);
            formData.append('houseNumber', houseNumber);
            formData.append('city', city);
            formData.append('birthDate', birthDate);
            formData.append('phone', phone);
            formData.append('mobilePhone', mobilePhone);

            if (memberImage) {
                formData.append('memberImage', memberImage);
            }

            return (formData);
        }

        else {
            alert("נא מלא את כל הפרטים");
        }
    }

    const refreshPage = () => {
        window.location.reload();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setMemberImage(file);
    };

    const handleClose = () => {
        onClose();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (actionType === 'create') {
                addMember();
            }
            else {
                updateMember();
            }
        }
    }

    const performAction = () => {
        switch (actionType) {
            case 'create':
                addMember();
                break;
            case 'updateMember':
                updateMember();
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
                <input
                    type="text"
                    placeholder="מספר זהות"
                    value={memberId}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setMemberId(value);
                    }}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="text"
                    placeholder="שם פרטי"
                    value={firstName}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\d/g, '');
                        setFirstName(value);
                    }}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="text"
                    placeholder="שם משפחה"
                    value={lastName}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\d/g, '');
                        setLastName(value);
                    }}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="text"
                    placeholder="רחוב"
                    value={street}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\d/g, '');
                        setStreet(value);
                    }}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="text"
                    placeholder="מספר בית"
                    value={houseNumber}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setHouseNumber(value);
                    }}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="text"
                    placeholder="עיר"
                    value={city}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\d/g, '');
                        setCity(value);
                    }}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="date"
                    placeholder="תאריך לידה"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="text"
                    placeholder="טלפון"
                    value={phone}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPhone(value);
                    }}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="text"
                    placeholder="טלפון נייד"
                    value={mobilePhone}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setMobilePhone(value);
                    }}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <br />

                <button onClick={performAction}>אישור</button>
            </div>
        </div >
    )
}

export default Popup;