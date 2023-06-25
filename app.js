const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const session = require('express-session');
const openai = require('openai');

const port = 3000;
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'schizi',
  password: 'password',
  port: '5432',
})

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

const checkAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    return res.redirect(303, '/login')
  }
}



// Define your routes and middleware
app.get('/login', async (req, res) => {

  console.log("DEBUG LOGIN GET REQ")

  try {
    res.set('Content-Type', 'text/html');
    console.log("SENDING FILE")
    res.sendFile(__dirname + '/html/login.html');
  } catch(error) {
    console.error("FAILED TO SEND PAGE")
  }
});

app.get('/register', async (req, res) => {
  res.sendFile(__dirname + '/html/register.html')
});

app.get('/register-success', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store'); // Disable caching
  res.sendFile(__dirname + '/html/register-success.html')
  
});



app.get('/signup', checkAuth, async (req, res) => {
  res.sendFile(__dirname + '/html/register.html')
});

app.get('/', checkAuth, async (req, res) => {

  //res.redirect('/register-success')
  res.sendFile(__dirname + '/html/app.html')
});

app.get('/styles.css', checkAuth, async (req, res) => {
  res.sendFile(__dirname + '/css/styles.css')
});

app.get('/data.js', checkAuth, async (req, res) => {
  res.sendFile(__dirname + '/js/data.js')
});

app.get('/whisper.js', checkAuth, async (req, res) => {
  res.sendFile(__dirname + '/js/whisper.js')
});

app.get('/view.js', checkAuth, async (req, res) => {
  res.sendFile(__dirname + '/js/view.js')
});



app.get('/db/users/:userId', checkAuth, async (req, res) => {
  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const query = 'SELECT * FROM users WHERE id = $1';
  const results = await pool.query(query, [userId]);
  res.json(results.rows);
});


app.get('/db/users/this', checkAuth, async (req, res) => {
  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const query = 'SELECT * FROM users WHERE id = $1';
  const results = await pool.query(query, [userId]);
  res.json(results.rows);
});


/*
app.get('/db/chats/:userId/:chatId', checkAuth, async (req, res) => {
  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const chatId = req.params['chatId'];
  const query = 'SELECT * FROM chats WHERE user_id = $1 AND id = $2';
  const results = await pool.query(query, [userId, chatId]);

  res.json(results.rows);
})
*/

app.get('/db/chats/:chatId', checkAuth, async (req, res) => {
  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const chatId = req.params['chatId'];
  const query = 'SELECT * FROM chats WHERE user_id = $1 AND id = $2';
  const results = await pool.query(query, [userId, chatId]);

  res.json(results.rows);
})


app.get('/db/chats', checkAuth, async (req, res) => {
  const userId = req.session.userId;
  const query = 'SELECT * FROM chats WHERE user_id = $1 ORDER BY id asc';
  const results = await pool.query(query, [userId]);
  res.json(results.rows);
});

app.get('/db/devices', checkAuth, async (req, res) => {
  const userId = req.session.userId;
  const query = 'SELECT * FROM devices WHERE user_id = $1';
  const results = await pool.query(query, [userId]);
  res.json(results.rows);
});

app.get('/db/devices/:deviceId', checkAuth, async (req, res) => {
  const userId = req.session.userId;
  const deviceId = req.params["deviceId"];
  const query = 'SELECT * FROM devices WHERE id = $1';
  const results = await pool.query(query, [deviceId]);
  res.json(results.rows);
});

app.get('/db/posts/:chatId', checkAuth, async (req, res) => {

  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const chatId = req.params['chatId'];

  const query = 'SELECT * FROM posts WHERE user_id = $1 AND chat_id = $2 order by id asc';

  const results = await pool.query(query, [userId, chatId]);

  console.log("DEBUG POSTS");
  console.log(results.rows);



  res.json(results.rows);

});

app.get('/db/settings', checkAuth, async (req, res) => {
  
  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const query = 'SELECT name, username, email, phone, nicknames, whisper_frequency, whisper_filter, devices FROM users WHERE id = $1';
  const results = await pool.query(query, [userId]);
  res.json(results.rows);

});

app.put('/db/settings', checkAuth, async (req, res) => {
  
  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const query = 'UPDATE users SET name = $1, username = $2, email = $3, phone = $4, nicknames = $5, whisper_frequency = $6, whisper_filter = $7 WHERE id = $8';

  const results = await pool.query(query, [req.body['name'], req.body['username'], req.body['email'], req.body['phone'], req.body['nicknames'], req.body['whisperFrequency'], req.body['whisperFilter'], userId]);

});

app.get('/db/survey', checkAuth, async (req, res) => {

  console.log("DEBUG SURVEY")
  
  const userId = req.session.userId;
  console.log(userId)
  const query = 'SELECT one, two, three, four, five FROM survey WHERE user_id = $1';
  const results = await pool.query(query, [userId]);

  console.log("DEBUG RESULTS")
  console.log(results);

  res.json(results.rows);

});

app.put('/db/survey', checkAuth, async (req, res) => {

  console.log("DEBUG UPDATE SURVEY")
  console.log(req.body)

  const textBlock = `ABOUT: ${req.body["one"]}. 
  HOBBIES: ${req.body["two"]}. 
  HANDLE CRITICISM: ${req.body["three"]}. 
  LONG TERM GOALS: ${req.body["four"]}. 
  HANDLE STRESS: ${req.body["five"]}`;
 
  console.log("DEBUG TEXT BLOCK")
  console.log(textBlock)

  const prompt = `Based on the responses to the opening survey in this block of text, generate 10 compliments, 10 messages of encouragement, and 10 pointed pieces of advice about how the user can better their lives:
  ${textBlock}`;

  const userId = req.session.userId;
  const query = 'UPDATE survey SET one = $1, two = $2, three = $3, four = $4, five = $5 WHERE user_id = $6';
  const results = await pool.query(query, [req.body['one'], req.body['two'], req.body['three'], req.body['four'], req.body['five'], userId]);

});



app.get('/db/whispers', checkAuth, async (req, res) => {

  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const query = 'SELECT * FROM whispers WHERE user_id = $1 order by id asc';  
  const results = await pool.query(query, [userId]);

  res.json(results.rows);

});

app.get('/db/settings/whisperfreq', checkAuth, async (req, res) => {

  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const query = 'SELECT whisper_frequency FROM users WHERE id = $1';  
  const results = await pool.query(query, [userId]);

  res.json(results.rows);

});



// POST /register
app.post('/register', (req, res) => {
  // Extract user data from the request body
  registerUser(req, res);

});

async function registerUser(req, res) {
  const { name, username, password, profilePic, nicknames, whisperFrequency, whisperFilter, devices, email } = req.body;

  try {

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the user into the database, storing the hashed password
    const query = 'INSERT INTO users (name, username, password_hash, profile_pic_src, nicknames, whisper_frequency, whisper_filter, devices, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    const values = [name, username, hashedPassword, profilePic, nicknames, whisperFrequency, whisperFilter, devices, email];
    const results = await pool.query(query, values)

    return res.redirect(303, '/register-success');

  } catch(error) {

    console.error('Error registering user:', error);
    // Send an error response
    res.status(500).json({ error: 'Failed to register user' });

  }
}






app.post('/login', async (req, res) => {

  const { username, password } = req.body;

  try {

    const query = 'SELECT id, username, password_hash FROM users WHERE username = $1';

    const results = await pool.query(query, [username]);

    console.log("DEBUG LOGIN")
    console.log(results.rows[0])

    const userObject = results.rows[0]

    if (!userObject) {

      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, userObject["password_hash"]);

    console.log("DEBUG PASSWORD")
    console.log(isPasswordValid)

    if (!isPasswordValid) {
      // Invalid password
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.userId = userObject["id"];

    return res.redirect(303, '/');

  } catch (error) {

    console.error('Error during login:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
});



app.post('/logout', checkAuth, async (req, res) => {
  const userId = req.session.userId;

  req.session.destroy((err) => {
    if (err) {
      // Handle error
      res.sendStatus(500);
    } else {

      /*
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');

      res.clearCookie('sessionID');
      //res.sendStatus(200);
      */
      return res.redirect(302, '/login');
    }
  });

  
})



//STORE POST 
app.post('/db/posts/:chatId', checkAuth, async (req, res) => {


  //const userId = req.params['userId'];
  const userId = req.session.userId;
  
  const chatId = req.params['chatId'];

  console.log("DEBUG POST")
  console.log(req.body)

  const query = 'INSERT INTO posts (user_id, chat_id, date, sender, post_text, media_src) VALUES ($1, $2, $3, $4, $5, $6)';

  fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

  const results = await pool.query(query, [userId, chatId, req.body["date"], userId, req.body["post_text"], req.body["media_src"]]);
})

app.post('/db/chats/newChat', checkAuth, async (req, res) => {

  //const userId = req.params['userId'];
  const userId = req.session.userId;

  const query = 'INSERT INTO chats (user_id, title, last_modified) VALUES ($1, $2, $3) RETURNING id';

  const results = await pool.query(query, [userId, req.body['postTitle'], req.body['postLastModified']]);

  res.json(results["rows"]);

});

app.post('/trainGPT', checkAuth, async (req, res) => {
  
  const userId = req.session.userId;
  const apiKey = 'YOUR_API_KEY';
  const text = req.body["text"];
  /*
  const query = 'SELECT * FROM users where id = $1';
  const results = await pool.query(query, [userId]);
  const name = results["rows"][0]["name"];
  const nicknames = results["rows"][0]["nicknames"];
  const prompt = `Based on the following block of text, generate 3 compliments, 3 messages of encouragement, and 3 pointed pieces of advice about how the user can better their lives: ${text}. In the post, refer to the user by their name: ${name} or nicknames: ${nicknames}`;
  */
  let userMessages = [
    {"role": "system", "content": "You are an encouraging friend"},
    {"role": "user", "content": "Today was a bad day. I cannot wait to get home"},
    {"role": "friend", "content": "Things will definately get better for you. Keep your head up. Fight on. You are strong."},
    {"role": "user", "content": "I saw the funniest thing in the vegetable aisle today"},
    {"role": "friend", "content": "Remember that thing you saw today?"},
  ];
  userMessages.push({"role": "user", "content": `${text}`})
  response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=userMessages,
    temperature=0.8,
    max_tokens=30,
    top_p=0.5,
    frequency_penalty=0.0
  )
  const whisper = response['choices'][0]['message']['content'];

  /*
  const params = {
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 50,
  };
  const openaiClient = new openai.OpenAI(apiKey);
  openaiClient.Completion.create(params)
    .then(response => {
      const answer = response.choices[0].text.trim();
      console.log('Response:', answer);

      //should be new line seperated list 

      //split on new line 
      //find length, loop length, insert into db
    })
    .catch(error => {
      console.error('Error:', error);
    });
  console.log("DEBUG PROMPT");
  console.log(prompt);
  */
  
});

async function insertWhisper(whisper) {
  const userId = req.session.userId;
  const query = 'INSERT INTO whispers (user_id, message, date) VALUES ($1, $2, $3)';
  const results = await pool.query(query, [userId, whisper, getCurrentDate()]);
}

function insertWhispers(whispers) {
  const whispersLen = whispers.length;
  for (var i = 0; i < whispersLen; i++) {
    insertWhisper(whispers[i]);
  }
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return currentDate.toLocaleDateString('en-US', options);
}

app.post('/db/feedback', checkAuth, async (req, res) => {

  const userId = req.session.userId;

  const query = 'INSERT INTO feedback (user_id, date, sender, post_text, media_src) VALUES ($1, $2, $3, $4, $5)';
  const results = await pool.query(query, [userId, req.body['last_modified'], userId, req.body['post_text'], req.body['media_src']]);

  //res.sendStatus(200);

})

app.post('/db/whisper', checkAuth, async (req, res) => {

  const userId = req.session.userId;

  const query = 'INSERT INTO whispers (user_id, message, date) VALUES ($1, $2, $3)';
  const results = await pool.query(query, [userId, req.body['last_modified'], userId, req.body['post_text'], req.body['media_src']]);

  //res.sendStatus(200);

})


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//module.exports = router;