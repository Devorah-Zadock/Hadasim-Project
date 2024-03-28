import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import Popup from './MemberPopup';
import './Home.css'
import CoronaDetails from './CoronaDetails';

export default function MemberDetails() {
    const [member, setMember] = useState([]);
    const { memberId } = useParams();
    const [isUpdateMemberOpen, setUpdateMemberOpen] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/read_member', {
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
            setMember(data.member);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateMember = () => {
        setUpdateMemberOpen(true);
    };

    const closePopup = () => {
        setUpdateMemberOpen(false);
    };

    return (
        <div className='details'>
            <div className='member-details'>
                <td><Link className='linkBtn' to={`/`}>חזרה לרשימת החברים</Link></td>
                <h2>{member.first_name} {member.last_name}</h2>
                <p><b>מספר זהות: </b>{member.member_id}<p><b>שם פרטי: </b>{member.first_name}</p>
                    <b> שם משפחה: </b>{member.last_name}</p>
                <p><b>רחוב: </b>{member.street}
                    <p><b>מספר בית: </b>{member.house_number}</p>
                    <b>עיר: </b>{member.city}</p>
                <p><b>תאריך לידה: </b>{member.birth_date}</p>
                <p><b>טלפון: </b>{member.phone}</p>
                <p><b>טלפון נייד: </b>{member.mobile_phone}</p>
            </div>
            {member.member_image &&
                <img src={`data:image/jpeg;base64,${member.member_image}`} alt="Member Image" style={{ width: '100px', height: 'auto' }} />
            }
            <button onClick={handleUpdateMember}>עדכון פרטים אישיים </button>
            <td><Link className='linkBtn' to={`/CoronaDetails/${member.member_id}`}>תיק קורונה</Link></td>
            <Popup isOpen={isUpdateMemberOpen} onClose={closePopup} actionType="updateMember" selectedMember={member} />
        </div>
    )
}