import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import CoronaPopup from './CoronaPopup';
import VaccinationPopup from './VaccinationPopup'

export default function CoronaDetails() {
    const { memberId } = useParams();
    const [coronaDetails, setCoronaDetails] = useState([]);

    const [vaccinationDetails, setVaccinationDetails] = useState([]);

    const [isUpdateCoronaDetailsOpen, setUpdateCoronaDetailsOpen] = useState(false);
    const [isCreateVaccinationOpen, setCreateVaccinationOpen] = useState(false);
    const [isUpdateVaccinationOpen, setUpdateVaccinationOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedVaccination, setSelectedVaccination] = useState(null);

    const handleRowClick = (index, vaccination) => {
        setSelectedRow(index);
        setSelectedVaccination(vaccination, () => {
            alert(selectedVaccination);
        });
    };

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/read_corona_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ member_id: memberId })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            setCoronaDetails(data.corona_details);

            if (data.vaccination_details) {
                setVaccinationDetails(data.vaccination_details);
            }

        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateCoronaDetails = () => {
        setUpdateCoronaDetailsOpen(true);
    };

    const handleCreateVaccination = () => {
        setCreateVaccinationOpen(true);
    }

    const handleUpdateVaccination = () => {
        if (selectedVaccination) {
            setUpdateVaccinationOpen(true);
        }
        else {
            alert("נא בחר חיסון");
        }
    }

    const closePopup = () => {
        setUpdateCoronaDetailsOpen(false);
        setCreateVaccinationOpen(false);
        setUpdateVaccinationOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return "אין";
        }
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const handleDelete = () => {
        if (selectedVaccination) {
            const confirmDelete = window.confirm('האם ברצונך למחוק את החיסון?');
            if (confirmDelete) {
                fetch('http://127.0.0.1:5000/delete_vaccination', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ vaccination_id: selectedVaccination.vaccination_id })
                })
                    .then((response) => {
                        if (response.ok) {
                            alert('חיסון הוסר בהצלחה!');
                            refreshPage();
                        } else {
                            alert('שגיאה בהסרת חיסון');
                        }
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
            }
        }
        else {
            alert("לא נבחר חיסון");
        }
    }

    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <div className='details'>
            <div className='member-details'>
                <td><Link className='linkBtn' to={`/`}>חזרה לרשימת החברים</Link></td>
                <h1>{coronaDetails.first_name} {coronaDetails.last_name}</h1>
                <div>
                    <h2><u>נתוני קורונה</u></h2>
                    <p><b>מספר זהות: </b>{memberId}</p>
                    <p><b>תאריך תשובה חיובית: </b>{formatDate(coronaDetails.positive_result)}</p>
                    <p><b>תאריך החלמה: </b>{formatDate(coronaDetails.recovery_from_disease)}</p>
                </div>
                <button onClick={handleUpdateCoronaDetails}>עדכון פרטי קורונה </button>
            </div>

            <div>
                <div>
                    <h2><u>נתוני חיסונים</u></h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>מספר זהות</th>
                                <th>מספר חיסון</th>
                                <th>תאריך חיסון</th>
                                <th>יצרן חיסון</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vaccinationDetails && vaccinationDetails.map((vaccination, index) => (
                                <tr key={vaccination.vaccination_id} onClick={() => handleRowClick(index, vaccination)} className={selectedRow === index ? 'selected' : ''}>
                                    <td>{memberId}</td>
                                    <td>{vaccination.vaccination_number}</td>
                                    <td>{formatDate(vaccination.vaccination_date)}</td>
                                    <td>{vaccination.manufacturer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleCreateVaccination}>הוספת חיסון +</button>
                    <button onClick={handleDelete}>מחיקת חיסון</button>
                    <button onClick={handleUpdateVaccination}>עדכון חיסון</button>
                </div>
            </div>
            <CoronaPopup isOpen={isUpdateCoronaDetailsOpen} onClose={closePopup} coronaDetails={coronaDetails} vaccinationDetails={vaccinationDetails} />
            <VaccinationPopup isOpen={isCreateVaccinationOpen} onClose={closePopup} actionType="create" vaccinationDetails={vaccinationDetails} member_Id={memberId} />
            <VaccinationPopup isOpen={isUpdateVaccinationOpen} onClose={closePopup} actionType="update" selectedVaccination={selectedVaccination} member_Id={memberId} />

        </div>
    )
}