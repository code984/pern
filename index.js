
// ===============================================MainvMainvvMainMainvvvvvMainMainMainMainMainMainMainMainMain=========================================================
const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');




app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname +"/public")))

// Create a PostgreSQL connection pool
const pool = new Pool({
            user: 'postgres',
            password: '000000',
            database:'formsystem',
            hostname: 'localhost',
            port: 5432,
            
    })
    
// Endpoint for user registration
app.post('/signup', async (req, res) => {
  try {
    const { name, email,password } = req.body;
    // Insert the new user into the database
    const query = 'INSERT INTO signup_table (name,email,password) VALUES ($1, $2,$3)';
    await pool.query(query, [name,email, password]);
    res.status(201).send('User registered successfully!');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('An error occurred during registration.');
  }
});


// Login=========================form
app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Query the database to check if the user exists
      const query = 'SELECT * FROM signup_table WHERE email = $1 AND password = $2';
      const { rows } = await pool.query(query, [email, password]);
      if (rows.length > 0) {
        res.status(200).send('Login successful!');
      } else {
        res.status(401).send('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('An error occurred during login.');
    }
  });


  app.get('/home', async (req, res) => {
    try {
      const query = 'SELECT * FROM signup_table';
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      console.error('Error during user fetch:', error);
      res.sendStatus(500);
    }
  });


  


   // Update user=======================update//


    app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;
  
    // Perform database update operation
    const query = 'UPDATE signup_table SET name = $1, email = $2, password = $3 WHERE id = $4';
    const values = [name, email, password, id];
  
    pool.query(query, values, (err, result) => {
      if (err) {
        console.error('Error during update:', err);
        res.status(500).json({ error: 'Failed to update user' });
      } else {
        console.log('User updated successfully');
        res.status(200).json({ message: 'User updated successfully' });
      }
    });
  });
  





//=======================view==================================//
app.get('/view/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve the user details from the database
    const query = 'SELECT * FROM signup_table WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);

    // Check if user found
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json(user); // Send the user details as JSON response
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


      
  // Delete user
  app.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const query = 'DELETE FROM signup_table WHERE id = $1';
      await pool.query(query, [id]);
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error during user deletion:', error);
      res.sendStatus(500);
    }
  });
  


// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

// =================================================================================================================================================================================


