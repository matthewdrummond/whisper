function generateWhisper() {
  const systemPosts = [
    "You are doing great! Keep up the good work!",
    "Believe in yourself. You can achieve anything!",
    "Remember to take care of yourself. Self-care is important!",
    "Stay positive and keep a smile on your face!",
    "You are unique and special. Embrace your individuality!",
    "Don't be afraid to chase your dreams. You can make them a reality!",
  ];

  const randomIndex = Math.floor(Math.random() * systemPosts.length);
  const postContent = systemPosts[randomIndex];

  return postContent;
}


//generate response
//add message to the whisper db for user
//pick random speaker from set of speakers (devices in range)
//send message to that speaker
//speak message
  //play from the whisper list, the last message added, speak this message 
