SET SEARCH_PATH TO public;


-- Academic table
CREATE TABLE IF NOT EXISTS academics (
    academic_key SERIAL PRIMARY KEY,
    academic_level VARCHAR(40) NOT NULL
);

--creating academic year table

CREATE TABLE IF NOT EXISTS academic_year (
	academic_year_key SERIAL PRIMARY KEY,
	academic_year INT NOT NULL,
	academic_key INT REFERENCES academics(academic_key)
);

--major table 

CREATE TABLE IF NOT EXISTS major (
	major_key SERIAL PRIMARY KEY,
	major_name VARCHAR(50)
);

-- Course table
CREATE TABLE IF NOT EXISTS course (
    course_key SERIAL PRIMARY KEY,
    course_subjects VARCHAR(150) NOT NULL,
	major_key INT REFERENCES major(major_key)
);

-- Mood table
CREATE TABLE IF NOT EXISTS mood (
    mood_key SERIAL PRIMARY KEY,
    mood_desc VARCHAR(50)
);

-- PHQ question table
CREATE TABLE IF NOT EXISTS patient_health_questionary (
    phq_key SERIAL PRIMARY KEY,
    phq_question_description VARCHAR(500),
	is_current VARCHAR(1) CHECK (LOWER(is_current) IN ('y','n'))
);

-- GAD question table
CREATE TABLE IF NOT EXISTS general_anxiety_disorder (
    gad_key SERIAL PRIMARY KEY,
    gad_question_description VARCHAR(500),
	is_current VARCHAR(1) CHECK (LOWER(is_current) IN ('y','n'))
);

-- Severity table
CREATE TABLE IF NOT EXISTS severity (
    severity_key SERIAL PRIMARY KEY,
    severity_description VARCHAR(150),
    severity_level INT
);

-- Difficulty table
CREATE TABLE IF NOT EXISTS difficulty (
    difficulty_key SERIAL PRIMARY KEY,
    difficulty_level VARCHAR(50)
);

-- Response table
CREATE TABLE IF NOT EXISTS response (
    response_key SERIAL PRIMARY KEY,
    response_description VARCHAR(150),
    response_start_level INT,
    response_end_level INT
);

-- Health service table
CREATE TABLE IF NOT EXISTS ud_health_service (
    udhs_key SERIAL PRIMARY KEY,
    phone_number BIGINT NOT NULL,
    address VARCHAR(250) NOT NULL,
	is_current VARCHAR(1) CHECK (LOWER(is_current) IN ('y','n'))
);

-- Activity category table
CREATE TABLE IF NOT EXISTS activity_category (
    category_key SERIAL PRIMARY KEY,
    category_name VARCHAR(100)
);

-- Activity table
CREATE TABLE IF NOT EXISTS activity (
    activity_key SERIAL PRIMARY KEY,
    category_key INT REFERENCES activity_category(category_key),
    activity_name VARCHAR(150)
);

-- Student table
CREATE TABLE IF NOT EXISTS student (
    student_key SERIAL PRIMARY KEY ,
    student_id INT NOT NULL UNIQUE CHECK (LENGTH(student_id :: TEXT) = 6 ),
    date_of_birth DATE NOT NULL CHECK (date_of_birth < CURRENT_DATE),
    academic_year_key INT REFERENCES academic_year(academic_year_key),
    course_key INT REFERENCES course(course_key)
);

-- Login table
CREATE TABLE IF NOT EXISTS login (
    login_key SERIAL PRIMARY KEY,
    student_key INT REFERENCES student(student_key),
    email VARCHAR(250),
    login_password VARCHAR(250),
	is_current VARCHAR(1) CHECK (LOWER(is_current) IN ('y','n'))
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    session_key SERIAL PRIMARY KEY,
    login_key INT REFERENCES login(login_key),
    login_time TIMESTAMP,
    log_out TIMESTAMP,
    mood_login INT REFERENCES mood(mood_key),
    mood_logout INT REFERENCES mood(mood_key)
);

-- Text input table
CREATE TABLE IF NOT EXISTS text_input (
    text_key SERIAL PRIMARY KEY,
    input_text TEXT
);

-- Session assessment table
CREATE TABLE IF NOT EXISTS session_assessment (
    session_assessment_key SERIAL PRIMARY KEY,
    session_key INT REFERENCES sessions(session_key),
    questionary_type VARCHAR(10) CHECK (questionary_type IN ('gad', 'phq')),
    total_score INT,
    text_key INT REFERENCES text_input(text_key),
    difficulty_key INT REFERENCES difficulty(difficulty_key)
);

-- Assessment table
CREATE TABLE IF NOT EXISTS assessment (
    assessment_key SERIAL PRIMARY KEY,
    session_assessment_key INT REFERENCES session_assessment(session_assessment_key),
    phq_key INT REFERENCES patient_health_questionary(phq_key),
    gad_key INT REFERENCES general_anxiety_disorder(gad_key),
    severity_key INT REFERENCES severity(severity_key)
);

-- Remedies table
CREATE TABLE IF NOT EXISTS remedies (
    remedies_key SERIAL PRIMARY KEY,
    phq_key INT REFERENCES patient_health_questionary(phq_key),
    gad_key INT REFERENCES general_anxiety_disorder(gad_key),
    severity_key INT REFERENCES severity(severity_key),
    remedies_text TEXT
);
