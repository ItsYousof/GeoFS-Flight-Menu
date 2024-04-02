// ==UserScript==
// @name         Flight Menu
// @namespace    http://tampermonkey.net/
// @version      2024-2-2
// @description  Game more relistic
// @author       Yousof
// @match        https://www.geo-fs.com/geofs.php?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        none
// @license      MIT
// ==/UserScript==


(function() {
    'use strict';

    var cloudflareLink = document.createElement("link");
    cloudflareLink.rel = "stylesheet";
    cloudflareLink.href = "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.min.css";
    document.head.appendChild(cloudflareLink);
    // Create button element
    const button = document.createElement("button");
    button.textContent = "Flight Menu";
    button.classList.add("mdl-button", "mdl-js-button", "mdl-button--raised", "geofs-f-standard-ui"); // Added MDL classes
    button.setAttribute("data-upgraded", ",MaterialButton");

    // Create popup menu
    const popup = document.createElement("div");
    popup.classList.add("menu-popup");

    popup.innerHTML = `
      <ul>
        <li><a href="#" id="paActionsLink">PA Actions</a></li>
        <li><a href="#" id="atcChatLink">ATC</a></li>
        <li><a href="#" id="flightPlanningLink">Flight Planning</a></li>
      </ul>
      <div id="chatContainer" style="display: none;">
        <div id="chatMessages"></div>
        <ul id="chatOptions">
          <li><a id="option1">Landing Clearance</a></li>
          <li><a id="option2">Take-off Clearance</a></li>
          <li><a id="option3">Leave Airspace clearance</a></li>
        </ul>
      </div>
      <div id="paActionsContainer">
        <h2>Take off and landing Voice Actions</h2>
        <ul>
          <li><a href="#" onclick="audioPlayFunction()">Safety Breiefing(4min)</a></li>
          <li><a href="#" onclick="audioPlayFunction3()">Take off Clearance(15sec)</a></li>
          <li><a href="#" onclick="audioPlayFunction2()">Landing Clearance(15sec)</a></li>
        </ul>
      </div>
      <div id="flightPlanningContainer" display="none">
        <h2 class="geofs-f-r-p-title">Flight Route Planning</h2>
        <input type="text" style="text-transform: uppercase" maxlength="4" id="flightRouteInput1" placeholder="Enter airport 4 letter ICAO code">
        <input type="text" style="text-transform: uppercase" maxlength="4" id="flightRouteInput2" placeholder="Enter destination 4 letter ICAO code">
        <input type="text" style="text-transform: uppercase" maxlength="7" id="flightname" placeholder="Flight Name">
        <button onclick="generateFlightRoute()">Generate Route</button>
        <button id="copyToClipboardButton" onclick="copyToClipboard()" style="display: none">Copy Route</button>
        <textarea id="flightRouteOutput" readonly placeholder="Flight Route" style="display: block"></textarea>
        <textarea id="flightRouteWaypoints" placeholder="Enter your own waypoints (ex.: 2540S 2545S ABEPI)" style="display: block"></textarea>
      </div>
    `;
    popup.style.display = "none";
    var audioAction = new Audio('https://raw.githubusercontent.com/YousofAbdelrehim/Geofs-sounds-effects/main/2c82-dcac-4413-9fca-b8b6e8624b5e.mp3');
    var audioAction2 = new Audio('https://raw.githubusercontent.com/YousofAbdelrehim/Geofs-sounds-effects/main/bac8-24a3-4d70-a95c-d48aa030d185.mp3');
    var audioAction3 = new Audio('https://raw.githubusercontent.com/YousofAbdelrehim/Geofs-sounds-effects/main/3935-6381-4c4f-b1d9-90e6717bd096.mp3');

    var flightRouteWaypoints = document.getElementById("flightRouteWaypoints");

    function generateFlightRoute() {
    // Get form inputs
        let departureAirport = document.getElementById("flightRouteInput1").value.trim();
        let destinationAirport = document.getElementById("flightRouteInput2").value.trim();
        let flightNumber = document.getElementById("flightname").value.trim();
        let waypointsInput = document.getElementById("flightRouteWaypoints").value.trim();
        let copyButton = document.getElementById("copyToClipboardButton");
        var copyText = document.getElementById("flightRouteOutput");
        copyText.select();
        document.execCommand("copy");

        // Parse waypoints input
        let waypoints = [];
        if (waypointsInput !== "") {
            waypoints = waypointsInput.split(",").map(waypoint => waypoint.trim());
        }

        // Fetch waypoints data from waypoints.json
        fetch('https://raw.githubusercontent.com/YousofAbdelrehim/GeoFS-Flight-Menu/main/data/waypoints.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Construct flight route
            let flightRoute = [
                "" + departureAirport,
                "" + destinationAirport,
                flightNumber,
                []
            ];

            // Add waypoints to flight route with coordinates from JSON data
            waypoints.forEach(waypoint => {
                if (data[waypoint]) {
                    let coordinates = data[waypoint][0];
                    flightRoute[3].push([waypoint, coordinates[0], coordinates[1], 0, false, null]);
                } else {
                    console.error("Waypoint " + waypoint + " not found in waypoints data.");
                }
            });

            // Display flight route
            document.getElementById("flightRouteOutput").innerText = JSON.stringify(flightRoute);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
    function audioPlayFunction() {
      if (audioAction.paused) {
        audioAction.play();
      }else {
        audioAction.pause();
      }
    }
    function audioPlayFunction2() {
      if (audioAction2.paused) {
        audioAction2.play();
      }else {
        audioAction2.pause();
      }
    }
    function audioPlayFunction3() {
      if (audioAction3.paused) {
        audioAction3.play();
      }else {
        audioAction3.pause();
      }
    }
    // Get the div with the class geofs-ui-bottom
    const bottomDiv = document.querySelector(".geofs-ui-bottom");

    // Append button and popup menu to the bottom div
    bottomDiv.appendChild(button);
    bottomDiv.appendChild(popup);

    // Add event listener to toggle popup menu
    button.addEventListener("click", function() {
      if (popup.style.display === "none") {
        popup.style.display = "block";
      } else {
        popup.style.display = "none";
      }
    });

    // Add event listener to show chat when "ATC" is clicked
    document.getElementById("atcChatLink").addEventListener("click", function(event) {
      event.preventDefault();
      if (document.getElementById("chatContainer").style.display === "none" ) {
        if (document.getElementById("paActionsContainer").style.display === "block") {
          document.getElementById("chatContainer").style.display = "block";
          document.getElementById("paActionsContainer").style.display = "none";
        }else {
          document.getElementById("chatContainer").style.display = "none";
          document.getElementById("paActionsContainer").style.display = "block";
        }
      }
    });



    // Add event listener to show PA Actions when "PA Actions" is clicked
    document.getElementById("paActionsLink").addEventListener("click", function(event) {
      event.preventDefault();
      if (document.getElementById("paActionsContainer").style.display === "none") {
        if (document.getElementById("chatContainer").style.display === "block") {
          document.getElementById("paActionsContainer").style.display = "block";
          document.getElementById("chatContainer").style.display = "none";
        }else {
          document.getElementById("paActionsContainer").style.display = "block";
          document.getElementById("chatContainer").style.display = "none";
        }
      }else {
        document.getElementById("paActionsContainer").style.display = "none";
      }
    });

    document.getElementById("flightPlanningLink").addEventListener("click", function(event) {
      event.preventDefault();
      if (document.getElementById("flightPlanningContainer").style.display === "none" && document.getElementById("paActionsContainer").style.display === "block") {
        document.getElementById("flightPlanningContainer").style.display = "block";
        document.getElementById("paActionsContainer").style.display = "none";
        document.getElementById("chatContainer").style.display = "none";
      }else {
        if (document.getElementById("flightPlanningContainer").style.display === "none") {
          document.getElementById("flightPlanningContainer").style.display = "block";
          document.getElementById("paActionsContainer").style.display = "none";
          document.getElementById("chatContainer").style.display = "none";
        }
        document.getElementById("flightPlanningContainer").style.display = "none";
        document.getElementById("paActionsContainer").style.display = "block";
        document.getElementById("chatContainer").style.display = "none";
      }
    });

    // Function to send message
    function sendMessage(message) {
      if (message !== "") {
        appendMessage("You", message);
      }
    }

    // Function to append message to chat interface
    function appendMessage(sender, message) {
      const chatMessages = document.getElementById("chatMessages");
      const messageDiv = document.createElement("div");
      messageDiv.textContent = `${sender}: ${message}`;
      chatMessages.appendChild(messageDiv);
    }

    function towerMessage(message) {

      if (message !== "") {
        appendMessage("Tower", message);
         // Clear input field after sending message
      }
    }
    towerMessage("Welcome. How can I help you?");
    document.getElementById('option1').addEventListener('click', function() {
      sendMessage("Hello, this is the captain speaking. I'm requesting for clearance to land.");
      let delay = new Promise(resolve => setTimeout(resolve, 3000));
      delay.then(() => towerMessage("Clear to land. Good day!"));
      let delay2 = new Promise(resolve => setTimeout(resolve, 3000));
      delay2.then(() => sendMessage("Cleared to land. Good day!"));
    });

    document.getElementById('option2').addEventListener('click', function() {
      sendMessage("Hello, this is the captain speaking. I'm requesting for clearance to take off.");
      let delay = new Promise(resolve => setTimeout(resolve, 4000));
      delay.then(() => towerMessage("Clear to take off. Good day"));
      let delay2 = new Promise(resolve => setTimeout(resolve, 4000));
      delay2.then(() => sendMessage("Going to 5 thousands feet. Good day!"));
    });

    document.getElementById('option3').addEventListener('click', function() {
      sendMessage("Hello, We've reached our cruising altitude leaving your airspace heading to our destination. Good day.");
      let delay = new Promise(resolve => setTimeout(resolve, 4000));
      delay.then(() => towerMessage("Approved. Good day"));
    });

    // Close the popup when clicking outside of it
    window.addEventListener("click", function(event) {
      if (event.target !== button && !popup.contains(event.target)) {
        popup.style.display = "none";
        document.getElementById("chatContainer").style.display = "none"; // Hide chat if shown
      }
    });

    // CSS for popup menu
    const style = document.createElement("style");
    style.textContent = `
      .menu-popup {
        display: none;
        max-width: 1000px;
        padding: 14px 14px;
        border: none;
        border-radius: 7px;
        position: fixed;
        top: 10%;
        left: 0px;
        right: 0px;
        height: fit-content;
        height: -moz-fit-content;
        height: -webkit-fit-content;
        color: black;
        margin: auto;
        background: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }

      .menu-popup h4 {
        font-size: 28px;
        text-align: center;
        line-height: 32px;
        -moz-osx-font-smoothing: grayscale;
        margin: 24px 0 16px;
      }

      .menu-popup p {
        font-size: 16px;
        line-height: 24px;
        margin: 0;
      }

      .menu-popup ul {
        list-style-type: none;
        padding: 0;
        display: flex;
      }

      .menu-popup ul li {
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        flex: 1;
        border-radius: 7px;
      }

      .menu-popup ul li a {
        margin: 0;
        border: none;
        padding: 0 24px;
        text-decoration: none;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-weight: 500;
        font-size: 16px;
        text-transform: uppercase;
        color: rgba(66, 66, 66, .6);
      }

      .menu-popup ul li a:hover {
        color: #666;
        font-weight: bold;
      }

      .menu-popup.show {
        display: block;
      }

      #chatContainer {
        margin-top: 20px;
      }

      #chatMessages {
        height: 200px;
        overflow-y: auto;
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
      }

      #messageInput {
        width: calc(100% - 90px); /* Adjust width as needed */
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-right: 10px;
        box-sizing: border-box;
      }

      button {
        cursor: pointer;
        padding: 8px 16px;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 4px;
      }

      button:hover {
        background-color: #0056b3;
      }

      #paActionsContainer {
        margin-top: 20px;
        padding: 10px;
      }

      #paActionsContainer h2 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 22px;
        font-weight: 600;
        text-align: center;
        color: rgba(66, 66, 66, .6);
      }
      #paActionsContainer ul li a{
        margin-bottom: 10px;
        line-height: 1.5;
      }

      .geofs-f-r-p-title {
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 22px;
        font-weight: 600;
        text-align: center;
        color: rgba(66, 66, 66, .6);
      }

      #flightPlanningContainer {
        display: none;
        margin-top: 20px;
        padding: 10px;
        justify-content: center;
        align-items: center;
      }

      #flightPlanningContainer h2 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 26px;
        font-weight: 600;
        text-align: center;
      }

      #flightPlanningContainer input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-bottom: 10px;
        box-sizing: border-box;
        width:auto;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        text-transform: uppercase;
        color: rgba(66, 66, 66, .6);
        margin-right: 10px;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
      }

      #flightPlanningContainer button {
        margin-top: 10px;
        padding: 8px 16px;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.3s ease;
      }

      #flightPlanningContainer button:hover {
        transform: translateY(-2px);
        background-color: #0056b3;
      }

      #flightPlanningContainer textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-bottom: 10px;
        box-sizing: border-box;
        height: 100px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(66, 66, 66, .6);
        resize: none;
        margin-top: 10px;
      }

      #chatOptions li a{
        margin-bottom: 10px;
        line-height: 1.5;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
})();