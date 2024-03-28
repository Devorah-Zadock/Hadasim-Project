import React, { useState, useEffect } from 'react';
import Popup from './MemberPopup';
import './Home.css';
import './Popup.css';
import './Members'
import MembersTable from './Members';

export default function Home() {
    const [isCreateMemberOpen, setCreateMemberOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const handleRowClick = (index, member) => {
        setSelectedRow(index);
        setSelectedMember(member);
    };

    const handleCreate = () => {
        setCreateMemberOpen(true);
    };

    const handleDelete = () => {
        if (selectedMember) {
            const confirmDelete = window.confirm('האם ברצונך למחוק את החבר?');
            if (confirmDelete) {
                fetch('http://127.0.0.1:5000/delete_member', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ member_id: selectedMember.member_id })
                })
                    .then((response) => {
                        if (response.ok) {
                            alert('חבר הוסר בהצלחה!');
                            refreshPage();
                        } else {
                            alert('שגיאה בהסרת חבר');
                        }
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
            }
        }
        else {
            alert("לא נבחר חבר");
        }
    }
    
    const refreshPage = () => {
        window.location.reload();
    };

    const closePopup = () => {
        setCreateMemberOpen(false);
    };

    return (
        <div className='Home'>
            <h1>חברים בקופת החולים</h1>
            <div className='Home-content'>
                <button onClick={handleCreate}>הוספה +</button>
                <button onClick={handleDelete}>הסרה ❌</button>
            </div>
            <MembersTable onRowClick={handleRowClick} />
            <Popup isOpen={isCreateMemberOpen} onClose={closePopup} actionType="create" />

        </div>
    )
}
