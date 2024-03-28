import sqlalchemy as db
import urllib
from sqlalchemy.orm import sessionmaker
from corona_details import CoronaDetails
from member import Member
from vaccination_details import VaccinationDetails

class AccessData():
    """
    Class for accessing data from the database.

    Attributes:
        engine (sqlalchemy.engine.base.Engine): SQLAlchemy engine for database connection.
        Session (sqlalchemy.orm.session.sessionmaker): Session maker for creating database sessions.
        session (sqlalchemy.orm.session.Session): Database session object.
    """

    def __init__(self):
        """
        Initializes AccessData with database connection parameters.
        """
        quoted = urllib.parse.quote_plus("DRIVER={SQL Server Native Client 11.0};SERVER=DEVORAH\SQLEXPRESS;DATABASE=Corona;Trusted_Connection=yes;")
        self.engine = db.create_engine('mssql+pyodbc:///?odbc_connect={}'.format(quoted))
        self.Session = sessionmaker(bind=self.engine)
        self.session = self.Session()

    def read_members(self):
        """
        Reads all members from the database.

        Returns:
            list: List of Member objects if successful, otherwise None.
        """
        try:
            with self.Session() as session:
                return session.query(Member).all()
        except Exception as e:
            print("Error occurred during member retrieval:", str(e))
            return None

    def create_member(self, member, coronaDetails):
        """
        Creates a new member and associated corona details in the database.

        Args:
            member (Member): Member object to be created.
            coronaDetails (CoronaDetails): CoronaDetails object associated with the member.

        Returns:
            bool: True if member creation is successful, False otherwise.
        """
        try:
            with self.Session() as session:
                session.add(member)
                session.commit()
                session.add(coronaDetails)
                session.commit()
                return True
        except Exception as e:
            print("Error occurred during member creation:", str(e))

    def read_member(self, member_id):
        """
        Reads a member from the database based on member ID.

        Args:
            member_id (int): ID of the member to retrieve.

        Returns:
            Member: Member object if found, otherwise None.
        """
        try:
            with self.Session() as session:
                return session.query(Member).filter(Member.member_id == member_id).first()
        except Exception as e:
            print("Error occurred during member retrieval:", str(e))
            return None

    def update_member(self, member):
        """
        Updates member details in the database.

        Args:
            member (Member): Member object with updated details.
        """
        try:
            with self.Session() as session:
                session.merge(member)
                session.commit()
        except Exception as e:
            print("Error occurred during member update:", str(e))

    def delete_member(self, member_id):
        """
        Deletes a member from the database.

        Args:
            member_id (int): ID of the member to delete.
        """
        try:
            with self.Session() as session:
                member = session.query(Member).filter(Member.member_id == member_id).first()
                session.delete(member)
                session.commit()
        except Exception as e:
            print("Error occurred during member deletion:", str(e))
            self.session.rollback()

    def read_corona_details(self, member_id):
        """
        Reads corona details of a member from the database.

        Args:
            member_id (int): ID of the member to retrieve corona details for.

        Returns:
            CoronaDetails: CoronaDetails object if found, otherwise None.
        """
        try:
            with self.Session() as session:
                return session.query(CoronaDetails).filter(CoronaDetails.member_id == member_id).first()
        except Exception as e:
            print("Error occurred during corona details retrieval:", str(e))
            return None

    def update_corona_details(self, corona_details):
        """
        Updates corona details of a member in the database.

        Args:
            corona_details (CoronaDetails): CoronaDetails object with updated details.
        """
        try:
            with self.Session() as session:
                session.merge(corona_details)
                session.commit()
        except Exception as e:
            print("Error occurred during corona details update:", str(e))

    def get_next_vaccination(self, member_id):
        """
        Gets the next vaccination number for a member.

        Args:
            member_id (int): ID of the member.

        Returns:
            int: Next vaccination number.
        """
        try:
            with self.Session() as session:
                max_vaccination_number = session.query(db.func.max(VaccinationDetails.vaccination_number)).filter(VaccinationDetails.member_id == member_id).scalar()
                return max_vaccination_number + 1 if max_vaccination_number else 1
        except Exception as e:
            print("Error fetching next vaccination number:", str(e))
            return None

    def read_vaccination_details(self, member_id):
        """
        Reads vaccination details of a member from the database.

        Args:
            member_id (int): ID of the member to retrieve vaccination details for.

        Returns:
            list: List of VaccinationDetails objects if found, otherwise None.
        """
        try:
            with self.Session() as session:
                return session.query(VaccinationDetails).filter(VaccinationDetails.member_id == member_id).all()
        except Exception as e:
            print("Error occurred during vaccination details retrieval:", str(e))
            return None

    def create_vaccination(self, vaccinationDetails):
        """
        Creates a new vaccination record in the database.

        Args:
            vaccinationDetails (VaccinationDetails): VaccinationDetails object to be created.

        Returns:
            bool: True if vaccination creation is successful, False otherwise.
        """
        try:
            with self.Session() as session:
                session.add(vaccinationDetails)
                session.commit()
                return True
        except Exception as e:
            print("Error occurred while adding vaccination details:", str(e))
            self.session.rollback()

    def update_vaccination(self, vaccination):
        """
        Updates vaccination details in the database.

        Args:
            vaccination (VaccinationDetails): VaccinationDetails object with updated details.
        """
        try:
            with self.Session() as session:
                session.merge(vaccination)
                session.commit()
        except Exception as e:
            print("Error occurred during vaccination update:", str(e))

    def delete_vaccination(self, vaccination_id):
        """
        Deletes a vaccination record from the database.

        Args:
            vaccination_id (int): ID of the vaccination record to delete.
        """
        try:
            with self.Session() as session:
                vaccination = session.query(VaccinationDetails).filter(VaccinationDetails.vaccination_id == vaccination_id).first()
                session.delete(vaccination)
                session.commit()
        except Exception as e:
            print("Error occurred during vaccination deletion:", str(e))
            self.session.rollback()
