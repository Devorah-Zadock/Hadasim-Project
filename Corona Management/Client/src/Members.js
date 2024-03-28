import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MemberDetails from './MemberDetails';

const MembersTable = ({ onRowClick }) => {

    const [members, setMembers] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const handleRowClick = (index, member) => {
        setSelectedRow(index);
        setSelectedMember(member);
        onRowClick(index, member);
    };

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/read_members', { method: 'POST' });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setMembers(data.members);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {/* <h1>פרטי חברים בקופת החולים</h1> */}
            <table className="table">
                <thead>
                    <tr>
                        <th>מספר זהות</th>
                        <th>שם משפחה</th>
                        <th>שם פרטי</th>
                        <th>עיר</th>
                        <th>טלפון</th>
                        <th>טלפון נייד</th>
                        <th>אפשרויות</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr key={member.member_id} onClick={() => handleRowClick(index, member)} className={selectedRow === index ? 'selected' : ''}>
                            <td>{member.member_id}</td>
                            <td>{member.last_name}</td>
                            <td>{member.first_name}</td>
                            <td>{member.city}</td>
                            <td>{member.phone}</td>
                            <td>{member.mobile_phone}</td>
                            <td><Link to={`/MemberDetails/${member.member_id}`}>פרטים נוספים</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MembersTable;
