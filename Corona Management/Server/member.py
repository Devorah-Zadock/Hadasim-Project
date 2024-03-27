from sqlalchemy import Column, Integer, String, Date, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
import numpy as np
import cv2
import io

Base = declarative_base()

class Member(Base):
    __tablename__ = 'members'
    member_id = Column(String(50), primary_key=True)
    last_name = Column(String(50))
    first_name = Column(String(50))
    street = Column(String(50))
    house_number = Column(Integer)
    city = Column(String(50))
    birth_date = Column(Date)
    phone = Column(String(20))
    mobile_phone = Column(String(20))
    member_image = Column(LargeBinary)

    def __init__(self, member_id, last_name, first_name, street, house_number, city, birth_date, phone, mobile_phone, member_image=None):
        self.member_id = member_id
        self.last_name = last_name
        self.first_name = first_name
        self.street = street
        self.house_number = house_number
        self.city = city
        self.birth_date = birth_date
        self.phone = phone
        self.mobile_phone = mobile_phone
        self.member_image = member_image

    def set_member_image(self, image_path):
        try:
            # Read the image using cv2
            img = cv2.imread(image_path)

            # Convert the image to binary data
            if img is not None:
                # Convert image to binary
                _, img_binary = cv2.imencode('.jpg', img)
                # Convert binary to bytes
                image_bytes = img_binary.tobytes()

                # Set the member_image attribute
                self.member_image = image_bytes
            else:
                print("Error: Unable to read image file")
        except Exception as e:
            print("Error reading image file:", e)

    def get_member_image(self):
        if self.member_image:
            try:
                # Convert image bytes to numpy array
                image_array = np.frombuffer(self.member_image, dtype=np.uint8)
                # Decode image
                img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
                return img
            except Exception as e:
                print("Error loading image:", e)
                return None
        else:
            return None