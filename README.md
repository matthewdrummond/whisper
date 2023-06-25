# Positive Thoughts App

The Positive Thoughts App is a web application built with Node.js that aims to introduce positive thoughts and phrases of encouragement into the minds of users. By leveraging the Chat GPT API, the app generates personalized positive messages based on user-entered posts. Additionally, the app integrates with an ESP8266 board and a connected speaker, enabling the positive words of encouragement to be played audibly through the speakers.

## Features

- Users can enter posts or messages into the web app.
- The app utilizes the Chat GPT API to generate personalized positive phrases of encouragement based on user input.
- Positive messages are tailored to the user, providing a personalized experience.
- The app supports integration with an ESP8266 board and a connected speaker to play the positive words of encouragement audibly.

## Technologies Used

- Node.js
- Express.js (Node.js web framework)
- Chat GPT API (for generating positive phrases of encouragement)
- ESP8266 board
- Wi-Fi connectivity
- Speaker (connected to the ESP8266 board)

## Getting Started

### Prerequisites

- Node.js (https://nodejs.org)
- Access to the Chat GPT API
- ESP8266 board with Wi-Fi connectivity
- Speaker connected to the ESP8266 board

### Installation

1. Clone this repository to your local machine:

   ```shell
   git clone https://github.com/matthewdrummond/whisper.git

2. Navigate to the project directory
   
   cd whisper

3. Install the required dependencies:

   npm install
   
4. Set up the Chat GPT API by following the instructions provided by the API provider. Update the necessary API credentials or endpoints in the app's configuration files.

5. Configure the ESP8266 board to connect to your Wi-Fi network, and ensure the speaker is properly connected.
6. Start the Node.js server:
   npm start
7. Open a web browser and visit http://localhost:3000 to access the Positive Thoughts App.

8. Enter your posts or messages into the web app and submit them.

9. The app will utilize the Chat GPT API to generate positive phrases of encouragement based on your input.

10. The positive messages will be played through the speakers connected to the ESP8266 board, providing an audible experience of encouragement.

**Contributing**

Contributions to the Positive Thoughts App are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

License

MIT License

Feel free to customize and modify the README further to match your specific app details, installation steps, and technologies used with Node.js.
