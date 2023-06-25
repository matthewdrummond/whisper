#include <Arduino.h>
#include <ESP8266SAM.h>
#include <AudioOutputI2S.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

AudioOutputI2S *out = NULL;

// Replace with your network credentials
const char* ssid = "SpectrumSetup-C8";
const char* password = "smartbunny278";

ESP8266WebServer server(80);

void handleRoot() {
  String html = "<html><body>";
  html += "<h1>ESP8266 Web Server</h1>";
  html += "<form method='post' action='/speak'>";
  html += "<input type='text' name='message' placeholder='Enter your message'>";
  html += "<input type='submit' value='Submit'>";
  html += "</form>";
  html += "</body></html>";

  server.send(200, "text/html", html);
}

void handleSpeak() {
  
  server.sendHeader("Access-Control-Allow-Origin", "http://192.168.1.153:3000");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  //HTTP_OPTIONS contains the preflight header, so we send a 200 OK to that request
  if (server.method() == HTTP_OPTIONS) {
    server.send(200); // Respond with HTTP status code 200 (OK) for the preflight request
  }

  if (server.method() == HTTP_POST) {
    
    String message = server.arg("message");
    Serial.println(message);
    // Use the 'message' variable to implement text-to-speech functionality
    // Call your TTS function here with the 'message' parameter
    out = new AudioOutputI2S();
    out->begin();
    ESP8266SAM *sam = new ESP8266SAM;
    
    sam->Say(out, message.c_str());
    delete sam;

    server.send(200, "text/plain", "Message received");
  } else {
    server.send(405, "text/plain", "Method Not Allowed");
  }
}


void handleConfigure() {
  // Extract the new IP address from the request parameters
  String newIpAddress = server.arg("new_ip");

  // Change the IP address of the device
  // Implement your logic here
  IPAddress ip;
  ip.fromString(newIpAddress);
  WiFi.config(ip);

  server.send(200, "text/plain", "IP address changed");
}

void handleStats() {
  IPAddress ip = WiFi.localIP();
  String ipAddress = ip.toString();

  // Construct the response with the IP address
  String response = "Server IP address: " + ipAddress;

  // Send the response
  server.send(200, "text/plain", response);
}

void handleOff() {
  // Turn off the device
  // Implement your logic here
  server.send(200, "text/plain", "Device turned off");
  WiFi.disconnect();
}

void setup()
{

  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  server.on("/", handleRoot);
  server.on("/speak", handleSpeak);
  server.on("/off", handleOff);
  server.on("/configure", handleConfigure);
  server.on("/stats", handleStats);
  server.begin();
  Serial.println("HTTP server started");

}

void loop()
{
  server.handleClient();
}