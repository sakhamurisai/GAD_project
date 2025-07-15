CREATE PROCEDURE signup (
	p_first_name VARCHAR(250),
	p_last_name VARCHAR(250),
	p_date_of_birth DATE,
	p_academic_year VARCHAR(250),
	p_academic_level VARCHAR(250),
	p_course_level VARCHAR(250),
	p_course_subject VARCHAR(250),
	p_email VARCHAR(150),
	p_password VARCHAR(150)
)
LANGUAGE PLPGSQL
AS
$$
	DECLARE 
		v_academic_key INT := 0; 
	BEGIN
		--starting the transaction
		BEGIN TRANSACTION
		
		-- getting the acdemic_key from the given acdemic level
		
		SELECT academic_key INTO v_acdemic_key
		FROM academics
		WHERE academic_level LIKE LOWER(p_academic_level);

		-- If not found raise error 
		IF NOT FOUND THEN 
			RAISE EXCEPTION 'no matching entry found for name : %',p_name;
		END IF;

		--query the 