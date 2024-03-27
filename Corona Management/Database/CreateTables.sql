CREATE TABLE members (
  member_id varchar(50) PRIMARY KEY,
  last_name varchar(MAX),
  first_name varchar(MAX),
  street varchar(MAX),
  house_number int,
  city varchar(MAX),
  birth_date date,
  phone varchar(20),
  mobile_phone varchar(20),
  member_image varbinary(MAX)
)

CREATE TABLE corona_details (
  member_id VARCHAR(50),
  positive_result date,
  recovery_from_disease date,

  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
)

CREATE TABLE vaccination_details (
  vaccination_id INT PRIMARY KEY IDENTITY,
  member_id VARCHAR(50),
  vaccination_number INT,
  vaccination_date DATE,
  manufacturer VARCHAR(MAX),
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE,
  CONSTRAINT chk_vaccination_number CHECK (vaccination_number BETWEEN 1 AND 4)
);