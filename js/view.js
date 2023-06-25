let currentView = 0;
const SYSTEM_POST_ID = 0;
let whisperIntervalId = null;

const views = document.getElementsByClassName("view");
const menuIcon = document.getElementById('menu-icon');
const newChatIcon = document.getElementsByClassName("new-chat-icon")[0];
const drawer = document.getElementById('drawer');
const messageList = document.getElementsByClassName('message-list');
const messageInput = document.getElementsByClassName('message-input');
const sendButton = document.getElementsByClassName('send-button');
const imagePreview = document.getElementsByClassName('image-preview');
const menuOptions = document.getElementsByClassName("menu-option");
const cameraIcon = document.getElementsByClassName("camera-icon");
const imageInput = document.getElementsByClassName('image-input');
let selectedImageFile = null;
const microphoneIcon = document.getElementsByClassName("microphone-icon");
const chatList = document.getElementsByClassName("chat-list")[0];
const deviceList = document.getElementsByClassName("device-list")[0];

const modal = document.getElementById('newChatModal');
const closeBtn = document.querySelector('.close');
const createChatIcon = document.getElementById('createChatBtn');
const chatTitleInput = document.getElementById('chatTitleInput');



menuIcon.addEventListener('click', function(event) {
  event.stopPropagation(); // Prevent click event from propagating to the document
  drawer.classList.toggle('open');
  document.addEventListener('click', function(event) {
    closeMenu(event)
  });
});

function showNewChatModal() {

  modal.style.display = 'block';
}
function hideNewChatModal() {
  modal.style.display = 'none';
}
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

createChatIcon.addEventListener('click', function() {

  

  const chatTitle = chatTitleInput.value;

  if (chatTitle) {
    selectView(0);
    messageList[0].innerHTML = "";
    postNewChat(chatTitle, getCurrentDate())
    .then((data) => {
      const chatId = data[0]['id'];
      loadCurrentChat(0, chatId);
    })

    chatTitleInput.value = "";

    hideNewChatModal();
  }

});


newChatIcon.addEventListener('click', function(event) {

  showNewChatModal();

})

menuOptions[0].addEventListener('click', function(event) {
  event.stopPropagation();
  //selectView(0);

  newChatIcon.click();

  //create a new diary post chat for the user
})

menuOptions[1].addEventListener('click', function(event) {
  event.stopPropagation();
  selectView(1);
  closeMenu(event);
  setTitle("Diary Chats");
  clearChatList(chatList)
  createChatTiles()
  //bring up a list of diary chats the user has
});

menuOptions[2].addEventListener('click', function(event) {
  event.stopPropagation();
  closeMenu(event);
  selectView(2);

  setTitle("Whispers");
  clearMessageList(1)
  loadWhispers(1);
  //open up the chat that contains all the messages the AI has sent the user
});

menuOptions[3].addEventListener('click', function(event) {
  event.stopPropagation();
  closeMenu(event);
  selectView(3);

  setTitle("Survey");
  loadSurveyView();
  
});

menuOptions[4].addEventListener('click', function(event) {
  event.stopPropagation();
  closeMenu(event);
  selectView(4);
  setTitle("Settings");
  loadSettingsView();
  //open up the settings of the app
});

menuOptions[5].addEventListener('click', function(event) {
  event.stopPropagation();
  closeMenu(event);
  selectView(5);
  setTitle("Devices");

  loadDevicesView();
})

menuOptions[6].addEventListener('click', function(event) {
  event.stopPropagation();
  closeMenu(event);

  logout()
})




function logout() {

  const url = '/logout'

  return fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    redirect: 'follow',

  })
    .then((response) => {
      if (response.ok) {
        location.href = '/login';
      } else {

      }
    })
    .catch(error => {
      console.error('Error posting data:', error);
    })

}



function setTitle(title) {
  document.getElementsByClassName("title")[0].innerText = title;
}

function loadSurveyView() {

  const userSurvey = getUserSurvey();

  console.log("DEBUG USER SURVYE")
  console.log(userSurvey)

  userSurvey.then((survey) => {

    const surveyForm = document.getElementsByClassName("survey-form")[0];
    const surveyInputs = surveyForm.getElementsByClassName("survey-input");
    const saveButton = surveyForm.getElementsByTagName("button")[0];
    saveButton.innerText = "HELLO";

    if (survey.length > 0) {
      surveyInputs[0].value = survey[0]["one"];
      surveyInputs[1].value = survey[0]["two"];
      surveyInputs[2].value = survey[0]["three"];
      surveyInputs[3].value = survey[0]["four"];
      surveyInputs[4].value = survey[0]["five"]; 

    }

    saveButton.addEventListener("click", function(event) {        

      console.log("HELLO");
      event.preventDefault();
      updateSurvey([surveyInputs[0].value, surveyInputs[1].value, surveyInputs[2].value, surveyInputs[3].value, surveyInputs[4].value]);

      this.innerText = "Saved";
      setTimeout(function() {
        saveButton.innerText = "Save Answers";
      }, 1000)
    })
  })
}

function loadSettingsView() {

  const userSettings = getUserSettings();

  userSettings.then((settings) => {

    const settingsForm = document.getElementsByClassName("settings-form")[0];
    const nameInput = settingsForm.getElementsByClassName("name")[0];
    const usernameInput = settingsForm.getElementsByClassName("username")[0];
    const emailInput = settingsForm.getElementsByClassName("email")[0];
    const phoneInput = settingsForm.getElementsByClassName("phone")[0];
    const nicknamesInput = settingsForm.getElementsByClassName("nicknames")[0];
    const whisperFrequencyInput = settingsForm.getElementsByClassName("whisper-frequency")[0];
    const whisperFilterInput = settingsForm.getElementsByClassName("whisper-filter")[0];
    const saveButton = settingsForm.getElementsByTagName("button")[0];

    nameInput.value = settings[0]['name'];
    usernameInput.value = settings[0]['username'];
    emailInput.value = settings[0]['email'];
    phoneInput.value = settings[0]['phone'];
    nicknamesInput.value = settings[0]['nicknames'];
    whisperFrequencyInput.value = settings[0]['whisper_frequency'];
    whisperFilterInput.value = settings[0]['whisper_filter'];



    saveButton.addEventListener("click", function(event) {
      event.preventDefault();

      console.log("DEBUG UPDATE")
      console.log(nameInput.value)

      updateSettings(nameInput.value, usernameInput.value, emailInput.value, phoneInput.value, nicknamesInput.value, whisperFrequencyInput.value, whisperFilterInput.value);

      this.innerText = "Saved";

      setTimeout(function() {
        saveButton.innerText = "Save Settings";
      }, 1000);

      console.log("DEBUG WHISPER INTEVAL ID")
      console.log(whisperIntervalId);

      clearInterval(whisperIntervalId);

      whisperIntervalId = setInterval(function() {
        whisper()
        console.log("RESTARTING THE WHISPERS");
        console.log(whisperFrequencyInput.value)
      }, getWhisperFreqValue(parseInt(whisperFrequencyInput.value)))
      
    })

  })



}

function updateSurvey(answers) {
  const url = `/db/survey`;

  const data = {
    one: answers[0],
    two: answers[1],
    three: answers[2],
    four: answers[3],
    five: answers[4],
  }

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)

  })
    .then((response) => {


      return response.json()
    })
    .catch(error => {
      console.error('Error posting data:', error);
    })
}

function updateSettings(updateName, updateUsername, updateEmail, updatePhone, updateNicknames, updateWhisperFrequency, updateWhisperFilter) {

  const url = `/db/settings`;

  const data = {
    name: updateName,
    username: updateUsername,
    email: updateEmail,
    phone: updatePhone,
    nicknames: updateNicknames,
    whisperFrequency: updateWhisperFrequency,
    whisperFilter: updateWhisperFilter,
  }

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)

  })
    .then((response) => {


      return response.json()
    })
    .catch(error => {
      console.error('Error posting data:', error);
    })

}

function closeMenu(event) {
  if (drawer.classList.contains('open')) {
    if (event.target != drawer) {
      drawer.classList.remove('open');
      document.removeEventListener('click', closeMenu)
    }
  }
}

function selectView(view) {
  views[currentView].classList.add("hidden");
  currentView = view;
  views[currentView].classList.remove("hidden");
}

// Function to create and append a new post element
function createPost(type, profilePic, user, date, msgText, imgSrc) {

  // Retrieve dynamic data from the input and other sources
  const messageText = msgText;
  const currentDate = date;
  const profilePictureSrc = profilePic;
  const username = user; // Replace with dynamic username from the database
  const postImageSrc = imgSrc;

  // Create the post element
  const postElement = document.createElement('div');
  postElement.classList.add('thought-bubble-post');

  // Create the post header
  const postHeader = document.createElement('div');
  postHeader.classList.add('post-header');


  /*
  // Create the profile picture icon
  const profilePictureIcon = document.createElement('div');
  profilePictureIcon.classList.add('profile-picture-icon');
  const profilePictureImg = document.createElement('img');
  profilePictureImg.src = profilePictureSrc;
  profilePictureImg.alt = 'Profile Picture';
  profilePictureIcon.appendChild(profilePictureImg);
  postHeader.appendChild(profilePictureIcon);
  */

  // Create the username
  const userName = document.createElement('span');
  userName.classList.add('user-name');
  userName.textContent = username;
  postHeader.appendChild(userName);
  

  // Create the microphone icon
  const speakerSpan = document.createElement('span');
  speakerSpan.classList.add('speaker-icon')
  const speakerIcon = document.createElement('i');
  speakerIcon.classList.add('fas', 'fa-volume-up');
  speakerSpan.appendChild(speakerIcon);

  speakerSpan.addEventListener('click', function() {
    speakPostContent(messageText);
  });


  postHeader.appendChild(speakerSpan);


  // Create the microphone icon
  const trainSpan = document.createElement('span');
  trainSpan.classList.add('train-icon')
  const trainIcon = document.createElement('i');
  trainIcon.classList.add('fas', 'fa-volume-up');
  trainSpan.appendChild(trainIcon);

  trainSpan.addEventListener('click', function() {
    trainGPT(messageText);
  });

  postHeader.appendChild(trainSpan);

  postElement.appendChild(postHeader);

  // Create the post date
  const postDate = document.createElement('div');
  postDate.classList.add('post-date');
  postDate.textContent = convertTimestamp(currentDate);
  postElement.appendChild(postDate);

  // Create the post square
  const postSquare = document.createElement('div');
  postSquare.classList.add('post-square');
  const postText = document.createElement('div');
  postText.classList.add('post-text');
  postText.textContent = messageText;
  postSquare.appendChild(postText);
  postElement.appendChild(postSquare);

  console.log("POST MEDIA SRC")
  console.log(postImageSrc)

  /*
  // Create the post media container
  if (postImageSrc != "") {
    const postMediaContainer = document.createElement('div');
    postMediaContainer.classList.add('post-media-container');
    const postImage = document.createElement('img');
    postImage.src = postImageSrc;
    postImage.alt = 'Post Image';
    postMediaContainer.appendChild(postImage);
    postElement.appendChild(postMediaContainer);
  }
  */

  // Append the post element to the message container
  messageList[type].appendChild(postElement);
  messageList[type].scrollTop = messageList[type].scrollHeight;

}

function clearMessageInput(type) {
  // Clear the message input
  messageInput[type].value = '';
  messageInput[type].style.height = "initial";
  imageInput[type].value = null;
  imagePreview[type].src = "";
  imagePreview[type].style.display = 'none';
}


function trainGPT(content) {

  console.log("TRAIN GPT ON THIS POST")

  const url = '/trainGPT'

  data = {
    text: content
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      console.log('Data posted successfully:', result);
    })
    .catch(error => {
      console.error('Error posting data:', error);
    })

}

function speakPostContent(content) {

  const speech = new SpeechSynthesisUtterance(content);

  console.log(speech)
  
  speech.lang = 'en-US';
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);

}

function convertTimestamp(timestamp) {
  const dateObj = new Date(timestamp);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };

  return dateObj.toLocaleString('en-US', options);
}

function clearChatList() {
  chatList.innerHTML = "";
}

function loadChatInterface(type, chatId) {

  /*
  cameraIcon[type].addEventListener('click', function() {
    imageInput[type].click();
  });
  */

  microphoneIcon[type].addEventListener('click', function() {

    // Handle the click event for the microphone icon
    // Open the speech-to-text interface
    // Check browser support
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {

      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configure recognition properties
      recognition.lang = 'en-US'; // Set the language

      // Handle recognition result
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Recognized text:', transcript);
      };

      console.log("MIC")

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        console.log("MEDIA DEVICES")

        navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          // Connect the microphone stream to the speech recognition instance
          recognition.stream = stream;

          // Start recognition
          recognition.start();
        })
        .catch((error) => {
          console.log('Error accessing microphone:', error);
        });
      }

      // Start recognition
      recognition.start();
    } else {
      console.log('Speech recognition not supported in this browser.');
    }
  });

  messageInput[type].addEventListener('input', function() {
    adjustTextareaHeight(messageInput[type]);
  });

  imageInput[type].addEventListener('change', function(event) {
    selectedImageFile = event.target.files[type];
    showSelectedimagePreview(selectedImageFile);
  });
  //SEND BUTTON FOR A DIARY POST CHAT OR WHISPER FEEDBACK

  //use on click instead of addEventListener because everytime loadCurrentChat calls, we will update 
  //the onclick function replacing its value. cannot keep adding listeners.
  sendButton[type].onclick = function() {
    sendCallback(type, chatId)
  };
  
}

function loadCurrentChat(type, chatId) {

  const currentChatPromise = getChat(chatId);
  const chatPostsPromise = getPosts(chatId);
  

  let username = "";
  let profilePicSrc = "";

  
  currentChatPromise.then((chats) => {

    document.getElementsByClassName("title")[0].innerText = chats[0]["title"];
  })

  chatPostsPromise.then((posts) => {
    const postsLen = posts.length;
    for (let i = 0; i < postsLen; i++) {
      let post = posts[i];
      let sender = post["sender"];
      const userPromise = getUserById(sender);
      userPromise.then((user) => {
        profilePicSrc = user[0]["profile_pic_src"];
        username = user[0]["username"];
        createPost(0, profilePicSrc, username, post["date"], post["post_text"], post["media_src"]);

      });
    }
  })

  //use on click instead of addEventListener because everytime loadCurrentChat calls, we will update 
  //the onclick function replacing its value. cannot keep adding listeners.
  sendButton[type].onclick = function() {
    sendCallback(type, chatId)
  };

}


function sendCallback(type, chatId) {
  // Create the post using the message input and selected image file

  const userPromise = getSignedInUser();

  let username = "";
  let profilePicSrc = "";

  const msgText = messageInput[type].value;

  userPromise.then((user) => {
    profilePicSrc = user[0]["profile_pic_src"];
    username = user[0]["username"];
    console.log("IMAGE PREVIEW SRC");
    console.log(imagePreview[type].src)
    console.log(imagePreview[type].getAttribute("src"));

    createPost(type, profilePicSrc, username, getCurrentDate(), msgText, imagePreview[type].getAttribute("src"));
  });

  clearMessageInput(type);

  if (type == 0) {

    console.log("DEBUG ID STORE")
    console.log(chatId)

    storePost(chatId, getCurrentDate(), msgText, imagePreview[type].src);

  } else if (type == 1) {

    storeFeedback(getCurrentDate(), msgText, imagePreview[type].src);
  }

};


function loadWhispers(type) {
  
  messageList.innerHTML = "";
  const whispers = getUserWhispers();

  whispers.then((whisperPosts) => {

    console.log("DEBUG WHISPER POSTS")
    console.log(whisperPosts)

    const whisperPostsLen = whisperPosts.length;
    for (let i = 0; i < whisperPostsLen; i++) {
      const userPromise = getUserById(whisperPosts[i]['sender']);
      userPromise.then((user) => {
        profilePicSrc = user[0]["profile_pic_src"];
        username = user[0]["username"];
        createPost(type, profilePicSrc, username, whisperPosts[i]['date'], whisperPosts[i]['post_text'], whisperPosts[i]['media_src']);
      });
    }
  })
}

// Function to adjust textarea height based on content
function adjustTextareaHeight(textarea) {
  textarea.style.height = ''; // Reset the height to auto
  textarea.style.height = textarea.scrollHeight + 'px';
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return currentDate.toLocaleDateString('en-US', options);
}

function showSelectedimagePreview(imageFile) {
  const reader = new FileReader();

  reader.onload = function(event) {
    imagePreview[0].src = event.target.result;
    imagePreview[0].style.display = 'block';
  };

  reader.readAsDataURL(imageFile);
}

function storePost(chatId, postDate, msgText, imgSrc) {

  const data = {
    date: postDate,
    post_text: msgText, 
    media_src: imgSrc
  }

  const url = `/db/posts/${chatId}`;
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      console.log('Data posted successfully:', result);
    })
    .catch(error => {
      console.error('Error posting data:', error);
    })
}

function storeFeedback(_date, _msgText, _mediaSrc) {
  
  const url = `/db/feedback`;

  const data = {
    date : _date,
    post_text: _msgText,
    media_src: _mediaSrc,
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)


  })
    .then((response) => {
      return response.json()
    })
    .catch(error => {
      console.error('Error posting data:', error);
    })
}



function createChatTile(chatTitle, date, lastMsg, id) {

  const div = document.createElement("DIV");
  div.classList.add("chat-tile");
  let p = document.createElement("p");
  p.innerText = chatTitle;
  div.appendChild(p);
  p = document.createElement("p");
  p.innerText = date;
  div.appendChild(p);
  p = document.createElement("p");
  p.innerText = lastMsg;
  div.appendChild(p);

  //assign click listener to the diary list tile
  div.addEventListener('click', function() {
    selectView(0);
    //change to chat view
    //load up the selected chat
    clearMessageList(0);
    loadCurrentChat(0, id);
  })
  const firstChild = chatList.firstElementChild;
  chatList.insertBefore(div, firstChild)
}

function createDeviceTiles() {
  deviceList.innerHTML = "";
  const devicesPromise = getUserDevices();
  devicesPromise.then((devices) => {
    let devicesLen = devices.length; 
    for (let i = 0; i < devicesLen; i++) {
      console.log("DEBUG DEVICE")
      console.log(devices[i])
      let currentDevice = devices[i];
      deviceList.appendChild(createDeviceTile(currentDevice["name"], currentDevice["ip_address"], currentDevice["sku"], currentDevice["id"]));
    }
    //deviceList.append(createNewDeviceTile());
  })
}

function createAddDeviceForm() {
  const div = document.createElement("form");
  div.classList.add("device-tile");

  // Create the form element
  var formElement = document.createElement('div');
  formElement.id = 'deviceForm';

  // Create the form structure
  var form = document.createElement('form');
  form.classList.add("device-form");

  // Form inputs for device information
  var input = document.createElement('input');
  input.type = 'text';
  input.name = 'deviceName';
  input.placeholder = 'Device Name';
  form.appendChild(input);

  input = document.createElement('input');
  input.type = 'text';
  input.name = 'deviceSku';
  input.placeholder = 'Device SKU';
  form.appendChild(input);

  input = document.createElement('input');
  input.type = 'text';
  input.name = 'deviceIpAddress';
  input.placeholder = 'Device IP Address';
  form.appendChild(input);

  input = document.createElement('input');
  input.type = 'text';
  input.name = 'deviceId';
  input.placeholder = 'Device ID';
  form.appendChild(input);

  // Add more form inputs as needed

  var submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Device';
  form.appendChild(submitButton);

  var button = document.createElement('button');
  button.textContent = 'Cancel';
  form.appendChild(button);  

  submitButton.addEventListener("click", function(event) {
    event.preventDefault();

    /*const device = getDeviceById(deviceIdInput.value);
    device.then((response) => {
      console.log("DEBUG GET DEVICE")
      console.log(response)
    })*/

    console.log("IF device ID in the database, add device user id of user to the device, this is a put req");
    this.parentElement.replaceWith(createNewDeviceTile());

  })

  button.addEventListener("click", function(event) {
    this.parentElement.replaceWith(createNewDeviceTile());
  })

  // Append the form to the deviceForm element
  formElement.appendChild(form);

  return formElement;

}

function getDeviceById(deviceId) {
  const url = `/db/devices/${deviceId}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data
    });
}

function createDeviceTile(deviceTitle, ipAddress, serial, deviceId) {

  const div = document.createElement("DIV");
  div.classList.add("device-tile");
  let p = document.createElement("p");
  p.innerText = deviceTitle;
  div.appendChild(p);
  p = document.createElement("p");
  p.innerText = "IP Address: " + ipAddress;
  div.appendChild(p);
  p = document.createElement("p");
  p.innerText = "Serial: " + serial;
  div.appendChild(p);
  p = document.createElement("p");
  p.innerText = "Device ID: " + deviceId;
  div.appendChild(p);

  //assign click listener to the diary list tile
  div.addEventListener('click', function() {
    
    console.log("DEVICE INTERACTED WITH")
    console.log(deviceId)

  })

  return div;
}

function createNewDeviceTile() {

  const div = document.createElement("DIV");
  div.classList.add("device-tile");
  let p = document.createElement("p");
  p.innerText = "Add A Device";
  div.appendChild(p);
  
  //assign click listener to the diary list tile
  div.addEventListener('click', function() {
    
    console.log("ADD DEVICE")
    this.replaceWith(createAddDeviceForm())
    
  })

  return div;
}

function clearMessageList(type) {
  messageList[type].innerHTML = "";
}

function getUserById(userId) {
  const url = `/db/users/${userId}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data
    });
}

function getSignedInUser() {
  const url = `/db/users/this`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data
    });
}

async function getUserChats() {

  const url = `/db/chats`;
  let response = await fetch(url);
  let res = await response.json();

  return res;
}

async function getUserDevices() {

  const url = `/db/devices`;
  let response = await fetch(url);
  let res = await response.json();

  return res;
}

async function getUserWhispers() {
  const url = `/db/whispers`;
  let response = await fetch(url);
  let res = await response.json();

  return res;
}

function getChat(chatId) {

  const url = `/db/chats/${chatId}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data
    });
}

function postNewChat(title, lastModified) {
  const url = `/db/chats/newChat`;

  data = {
    postTitle: title,
    postLastModified: lastModified
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)


  })
    .then((response) => {


      return response.json()
    })
    .catch(error => {
      console.error('Error posting data:', error);
    })
}



function getPosts(chatId) {
  const url = `/db/posts/${chatId}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data
    });
}

function getUserSurvey() {
  const url = `/db/survey`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data
    });
}

function getUserSettings() {
  const url = `/db/settings`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data
    });
}

function loadDevicesView() {
  createDeviceTiles();
  //createNewDeviceTile();
}

function createChatTiles() {

  const chatsPromise = getUserChats();

  console.log("DEBUG CREATE CHAT TILES")
  console.log(chatsPromise)

  chatsPromise.then((chats) => {
    let chatsLen = chats.length; 
    for (let i = 0; i < chatsLen; i++) {
      let currentPost = getPosts(chats[i]["id"]);

      currentPost.then((post) => {

        const currentPostLen = post.length;

        let dateString = new Date(chats[i]["last_modified"]).toLocaleString();

        let postText = "";

        if (currentPostLen) {
          postText = post[currentPostLen - 1]["post_text"]
        } else {
          postText = ""
        }

        createChatTile(chats[i]["title"], dateString, postText, chats[i]["id"]);

      })
    }
  })
}

function createNewChatTile() {
  const div = document.createElement("DIV");
  div.classList.add("chat-tile");
  let p = document.createElement("p");
  p.innerText = "New Chat";
  div.appendChild(p);
  return div;
}

function generateWhisperPost() {

  const whisperMessages = getUserWhispers();

  return whisperMessages.then((whispers) => {


      const randomIndex = Math.floor(Math.random() * whispers.length);
      const postContent = whispers[randomIndex]["message"];
      return postContent;
    })
}

async function whisper() {

  //creates a post from the system
  //store post in the whispers table under the users id
  let date = getCurrentDate();
  let sender = SYSTEM_POST_ID;
  let msgText = await generateWhisperPost();
  let imgSrc = "";

  const userPromise = getUserById(sender);

  userPromise.then((user) => {
    let profilePic = user[0]['profile_pic_src'];
    let username = user[0]['username'];
    createPost(1, profilePic, username, date, msgText, imgSrc);

    //Should we store these to the database??
  })

  speakPostContent(msgText);
  sendWhisperToSpeaker(msgText);

}

function sendWhisperToSpeaker(message) {

  const url = `http://192.168.1.213/speak`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',

    },
    body: `message=${message}`,


  })
    .then((response) => {

      console.log("DEBUG RESPONSE")
      console.log(response)


      return response.text()
    })
    .catch(error => {
      console.error('Error posting data:', error);
    })

}

async function getWhisperFrequency() {
  const url = "/db/settings/whisperfreq";
  const freq = await fetch(url);
  let res = await freq.json();

  console.log("DEBUG RES")
  console.log(res)
  return res;
}

function getWhisperFreqValue(freq) {

  console.log("DEBUG WHISP VQLU")
  console.log(freq)

  switch(freq) {
  case 1:
    return 100000;
    break;
  case 2:
    return 90000;
    break;
  case 3:
    return 80000;
    break;
  case 4:
    return 70000;
    break;
  case 5:
    return 60000;
    break;
  case 6:
    return 50000;
    break;
  case 7:
    return 40000;
    break;
  case 8:
    return 30000;
    break;
  case 9:
    return 20000;
    break;
  case 10:
    return 10000;
    break;
  default:
    return 5000;
    break;
  }
}

(function() {

  //grab the set of chats the user has, since app initializes to the latest chat 
  //cannot store in global because of Promise, so grab when needed?
  getUserChats().then((chats) => {

    console.log("DEBUG CHATS")
    console.log(chats)

    if (chats.length > 0) {
      let chatsLen = chats.length; 
      currentChatId = chats[chatsLen - 1]["id"];

      loadChatInterface(0, currentChatId);
      loadChatInterface(1, currentChatId);
      loadCurrentChat(0, currentChatId);
    } else {
      menuOptions[3].click();
    }
  })

  const whisperFrequency = getWhisperFrequency();

  

  whisperFrequency.then((response) => {
    console.log("DEBUG WHISPER FREQ");
    console.log(response[0])
    whisperIntervalId = setInterval(function() {
      whisper()
      console.log("WHISPERING")
      
    }, getWhisperFreqValue(response[0]["whisper_frequency"]))
  })
})();
