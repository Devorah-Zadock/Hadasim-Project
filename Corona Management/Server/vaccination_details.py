from sqlalchemy import Column, Integer, String, Date, ForeignKey, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class VaccinationDetails(Base):
    __tablename__ = 'vaccination_details'
    vaccination_id = Column(Integer, primary_key=True, autoincrement=True)
    member_id = Column(String(50))
    vaccination_number = Column(Integer)
    vaccination_date = Column(Date)
    manufacturer = Column(String)

    # member = relationship("Member")  # Assuming you have a Member class defined for the 'members' table

    __table_args__ = (
        CheckConstraint('vaccination_number BETWEEN 1 AND 4', name='chk_vaccination_number'),
    )

    def __init__(self, member_id, vaccination_number, vaccination_date, manufacturer):
        self.member_id = member_id
        self.vaccination_number = vaccination_number
        self.vaccination_date = vaccination_date
        self.manufacturer = manufacturer
