from sqlalchemy import Column, String, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CoronaDetails(Base):
    __tablename__ = 'corona_details'
    member_id = Column(String(50), primary_key=True)
    positive_result = Column(Date)
    recovery_from_disease = Column(Date)

    def __init__(self, member_id, positive_result=None, recovery_from_disease=None):
        self.member_id = member_id
        self.positive_result = positive_result
        self.recovery_from_disease = recovery_from_disease
        pass