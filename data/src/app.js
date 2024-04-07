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
        <li><a href="#" id="fuelManagementLink">Fuel Management</a></li>
        <select id="aircraftType">
          <option value="1">Boeing 737-700</option>
          <option value="2">Boeing 777-300ER</option>  
          <option value="3">Boeing 757</option>
        </select>
      </ul>
      <div id="chatContainer" style="display: none;">
        <h2 class="geofs-f-r-p-title">Air Traffic Control</h2>
        <div id="chatMessages"></div>
        <div id="chatOptions">  
          <button onclick="handleChatInput('request_takeoff')">Request Takeoff</button>
          <button onclick="handleChatInput('request_landing')">Request Landing</button>
          <button onclick="handleChatInput('mayday')">Mayday</button>
          <button onclick="handleChatInput('missed_approach')">Missed Approach</button>
        </div>
      </div>
      <div id="paActionsContainer" style="display: none;">
        <h2 class="geofs-f-r-p-title">Take off and landing Voice Actions</h2>
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
        <textarea id="flightRouteWaypoints" placeholder="Enter your own waypoints (ex.: 2540S,2545S,ABEPI)" style="display: block"></textarea>
      </div>
      <div id="fuelManagementContainer">
        <h2 class="geofs-f-r-p-title">Fuel Management</h2>
        <div id="leftACP">
          <h3>Engine 1</h3>
          <span id="fuelGauge">
            <div id="needleContainer"></div>
          </span>
          <p>Fuel Level: <span id="fuelLevel">50%</span></p>
          <input type="number" id="fuelInput" placeholder="Enter fuel percentage" min="0" max="100">
          <button onclick="addFuel()" id="setFuelButton">Set Fuel Amount</button>
          <h6 style="display: none" id="fuelError">You must input a number between 1 and 100</h6>
          <h6 style="display:none" id="lowFuel">Fuel level is getting low</h6>
        </div>


        <div id="rightACP">
          <h3>Engine 2</h3>
          <span id="fuelGauge2">
            <div id="needleContainer2"></div>
          </span>
          <p>Fuel Level: <span id="fuelLevel2">50%</span></p>
          <input type="number" id="fuelInput2" placeholder="Enter fuel percentage" min="0" max="100">
          <button onclick="addFuel2()" id="setFuelButton2">Set Fuel Amount</button>
          <h6 style="display: none" id="fuelError2">You must input a number between 1 and 100</h6>
          <h6 style="display:none" id="lowFuel2">Fuel level is getting low</h6>
        </div>


      </div>
      <div id="settingsContainer" display="none">
        <h2 class="geofs-f-r-p-title">Settings</h2>
        <label for="darkModeCheckbox">Dark Mode:</label>
        <input type="checkbox" id="darkModeCheckbox"> 
      </div>
    `;
      

    popup.style.display = "none";
    var audioAction = new Audio('https://raw.githubusercontent.com/YousofAbdelrehim/Geofs-sounds-effects/main/2c82-dcac-4413-9fca-b8b6e8624b5e.mp3');
    var audioAction2 = new Audio('https://raw.githubusercontent.com/YousofAbdelrehim/Geofs-sounds-effects/main/bac8-24a3-4d70-a95c-d48aa030d185.mp3');
    var audioAction3 = new Audio('https://raw.githubusercontent.com/YousofAbdelrehim/Geofs-sounds-effects/main/3935-6381-4c4f-b1d9-90e6717bd096.mp3');
    
    var flightRouteWaypoints = document.getElementById("flightRouteWaypoints");
    var checkforspeedFuel = setInterval(checkSpeedFuel, 1000);

    function checkSpeedFuel() {
      const groundSpeed = geofs.animation.values.groundSpeed;

      if (groundSpeed > 20) {
        const button1 = document.getElementById("setFuelButton");
        const button2 = document.getElementById("setFuelButton2");
        button1.style.display = "none";
        button2.style.display = "none";
        var removeFuel = setInterval(() => {
          const fuelAmounts = {
            ["777-300ER"]: 47000,
            ["737-700"]: 7000,
            ["757"]: 11000
          };
          const fuelGauge = document.getElementById("fuelGauge");
          const fuelGauge2 = document.getElementById("fuelGauge2");
          const fuelLevel = document.getElementById("fuelLevel");
          const fuelLevel2 = document.getElementById("fuelLevel2");
          let airCraftListType1 = document.getElementById("aircraftType");

          if (airCraftListType1.value == 1) {
            var fuelAmount = fuelAmounts["737-700"];
            let removeFuelAmount = fuelAmount - 30;
            function removeFuelAmoutFuntion() {
              var remove = setInterval(() => {
                if (fuelAmout < 1000) {
                  document.getElementById("lowFuel").style.display = "block";
                  document.getElementById("lowFuel2").style.display = "block";
                  fuelLevel.textContent = fuelLevel - 3 + "%";
                  fuelGauge.style.width = fuelGauge.style.width - 30 + "px";
                  if (fuelAmout < 50) {
                    geofs.aircraft.instance.stopEngine();
                  }
                }else {
                  fuelLevel.textContent = fuelLevel - 30 + "%";
                  fuelGauge.style.width = fuelGauge.style.width - 30 + "px";
                  document.getElementById("lowFuel").style.display = "none";
                  document.getElementById("lowFuel2").style.display = "none";
                }
                removeFuelAmoutFuntion();
              }, 1000);
            }
          }

          if (airCraft.value == 2) {
            var fuelAmout = fuelAmounts["777-300ER"];
            let removeFuelAmount = fuelAmout - 9;
            function removeFuelAmoutFuntion() {
              var remove = setInterval(() => {
                if (fuelAmout < 5000) {
                  document.getElementById("lowFuel").style.display = "block";
                  document.getElementById("lowFuel2").style.display = "block";
                  fuelLevel.textContent = fuelLevel - 90 + "%";
                  fuelGauge.style.width = fuelGauge.style.width - 90 + "px";
                  if (fuelAmout < 1000) {
                    geofs.aircraft.instance.stopEngine();
                    document.getElementById("lowFuel").style.display = "block";
                    document.getElementById("lowFuel2").style.display = "block";
                  }
                }else {
                  fuelLevel.textContent = fuelLevel - 9 + "%";
                  fuelGauge.style.width = fuelGauge.style.width - 90 + "px";
                  document.getElementById("lowFuel").style.display = "none";
                  document.getElementById("lowFuel2").style.display = "none";
                }
                removeFuelAmoutFuntion();
              }, 1000);
            }
          }

          if (airCraft.value == 3) {
            var fuelAmout = fuelAmounts["757"];
            let removeFuelAmount = fuelAmout - 10;
            function removeFuelAmoutFuntion() {
              var remove = setInterval(() => {
                if (fuelAmout < 2000) {
                  document.getElementById("lowFuel").style.display = "block";
                  document.getElementById("lowFuel2").style.display = "block";
                  fuelLevel.textContent = fuelLevel - 10 + "%";
                  fuelGauge.style.width = fuelGauge.style.width - 10 + "px";
                  if (fuelAmout < 1000) {
                    geofs.aircraft.instance.stopEngine();
                    document.getElementById("lowFuel").style.display = "block";
                    document.getElementById("lowFuel2").style.display = "block";
                  }
                }else {
                  fuelLevel.textContent = fuelLevel - 10 + "%";
                  fuelGauge.style.width = fuelGauge.style.width - 10 + "px";
                  document.getElementById("lowFuel").style.display = "none";
                  document.getElementById("lowFuel2").style.display = "none";
                }
              })
            }
          }
        }, 1000);
      }else {
        const button1 = document.getElementById("setFuelButton");
        const button2 = document.getElementById("setFuelButton2");
        button1.style.display = "inline-block";
        button2.style.display = "inline-block";
        clearInterval(removeFuel);
      }
    }
    function addFuel() {
      const fuelInput = document.getElementById("fuelInput");
      if (fuelInput.value > 100) {
        document.getElementById("fuelError").style.display = "block";
      }else {
        document.getElementById("fuelError").style.display = "none";
        const fuelLevel = parseFloat(fuelInput.value);
        const fuelGauge = document.getElementById("fuelGauge");
        fuelGauge.style.width = "10px";
        const fuelPercentage = document.getElementById("fuelLevel");
        let fuelPercentagePX = fuelLevel;

        fuelGauge.style.width = fuelPercentagePX + "%";
        fuelPercentage.textContent = fuelPercentagePX + "%";
      }
      
    }

    function addFuel2() {
      if (fuelInput2.value > 100) {
        document.getElementById("fuelError2").style.display = "block";
      }else {
        document.getElementById("fuelError2").style.display = "none";
        const fuelInput = document.getElementById("fuelInput2");
        const fuelLevel = parseFloat(fuelInput.value);
        const fuelGauge = document.getElementById("fuelGauge2");
        fuelGauge.style.width = "10px";
        const fuelPercentage = document.getElementById("fuelLevel2");
        let fuelPercentagePX = fuelLevel;

        fuelGauge.style.width = fuelPercentagePX + "%";
        fuelPercentage.textContent = fuelPercentagePX + "%";
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
    // Dark mode function
    function toggleDarkMode() {
      const body = document.body;
    }

    
    
    // Add event listener to toggle display of chat container, PA Actions container and flight planning container
    document.querySelector("#paActionsLink").addEventListener("click", function() {
      document.getElementById("chatContainer").style.display = "none";
      document.getElementById("flightPlanningContainer").style.display = "none";
      document.getElementById("paActionsContainer").style.display = "block";
    });
    document.querySelector("#atcChatLink").addEventListener("click", function() {
      document.getElementById("chatContainer").style.display = "block";
      document.getElementById("flightPlanningContainer").style.display = "none";
      document.getElementById("paActionsContainer").style.display = "none";
    });
    document.querySelector("#flightPlanningLink").addEventListener("click", function() {
      document.getElementById("chatContainer").style.display = "none";
      document.getElementById("flightPlanningContainer").style.display = "block";
      document.getElementById("paActionsContainer").style.display = "none";
    });


    // Function to send message
    
   

    // CSS for popup menu
    const style = document.createElement("style");
    style.textContent = `
      .menu-popup {
        display: none;
        max-width: 900px;
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

      .menu-popup ul select {
        width: 150px;
        height: 50px;
        font-size: 15px;
        border-radius: 7px;
        border: none;
        padding: 0 10px;
        margin-bottom: 10px;
        outline: none;
      }

      .menu-popup ul select option {
        font-size: 15px;
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
        font-size: 16px;
        font-weight: 500;
      }

      #chatOptions {
        margin-top: 20px;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
      }

      #chatOptions button{
        margin-bottom: 10px;
        margin-right: 10px;
        line-height: 1.5;
        font-size: 16px;
        font-weight: 500;
        color: rgba(66, 66, 66, .6);
        cursor: pointer;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        background-color: #f0f0f0;
        transition: background-color 0.3s ease;
      }

      #chatOptions button:hover {
        background-color: #ddd;
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

      #chatOptions li a:hover{
        font-weight: bold;
      }

      #chatoptions2 li a{
        margin-bottom: 10px;
        line-height: 1.5;
        cursor: pointer;
      }
      #settingsContainer {
        display: none;
        margin-top: 20px;
        padding: 10px;
        justify-content: center;
        align-items: center;
      }
      #settingsContainer label {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(66, 66, 66, .6);
      }
      #settingsContainer input[type="checkbox"] {
        margin-right: 10px;
        transform: scale(1.5);
        cursor: pointer;
        margin-bottom: 10px;
        color: rgba(66, 66, 66, .6);
        margin-right: 10px;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
      }
      #settingsContainer input[type="checkbox"]:checked {
        transform: scale(1.5);
        cursor: pointer;
        margin-bottom: 10px;
        color: rgba(66, 66, 66, .6);
        margin-right: 10px;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
      }
      #settingsContainer button {
        margin-top: 10px;
        padding: 8px 16px;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      #settingsContainer button:hover {
        transform: translateY(-2px);
        background-color: #0056b3;
      }

      #fuelManagementContainer {
        margin-top: 20px;
        padding: 10px;
        align-items: center;
        justify-content: center;
        align-items: center;
      }

      #fuelManagementContainer h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 26px;
        font-weight: 600;
        text-align: center;
        color: #007bff;
      }

      #fuelManagementContainer #leftACP  {
        display:inline-block;
        width: 49%;
      }

      #fuelManagementContainer #rightACP  {
        display:inline-block;
        width:50%
      }
      
      #fuelManagementContainer p {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 500;  
      }

      #fuelManagementContainer button {
        margin-top: 10px;
        padding: 8px 16px;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.3s ease;
        display: inline-block;
      }

      #fuelManagementContainer button:hover {
        transform: translateY(-2px);
        background-color: #0056b3;
      }

      #fuelManagementContainer #fuelInput, #fuelInput2 {
        width:50%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-bottom: 10px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: 500;
        color: rgba(66, 66, 66, .6);
      }

      #fuelManagementContainer #fuelGauge, #fuelGauge2 {
        height: 20px;
        border-radius: 10px;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        margin-bottom: 10px;
        margin-top: 10px;
        background: linear-gradient(to right, red 0%, yellow 50%, green 100%);
        display:inline-block;
        width: 150px;
      }

      #fuelManagementContainer #fuelLevel, #fuelLevel2 {
        font-size: 16px;
        font-weight: 500;
        font-style: italic;
      }

      #fuelManagementContainer h6 {
        font-size: 12px;
        font-weight: 500;
        font-style: italic;
        color: red;
        margin-top: 0;
      }
    `;
    document.head.appendChild(style);

    const javaforflightMenu = document.createElement("script");
      javaforflightMenu.textContent = `
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
    function handleChatInput(action) {
    switch(action) {
        case 'request_takeoff':
            clearButtons();
            sendMessage("Hello, this is the captain speaking to you. We are ready for takeoff.");
            let delay = new Promise(resolve => setTimeout(resolve, 2000));
            delay.then(() => towerMessage("Hello captain, your flight has been cleared for takeoff."));
            addButton("Request Landing", "request_landing");
            enableButtons();
            break;
        case 'request_landing':
          clearButtons();
            sendMessage("Hello, this is the captain speaking to you. We are ready for landing.");
            let delay2 = new Promise(resolve => setTimeout(resolve, 2000));
            delay2.then(() => towerMessage("Cleared for landing."));
            addButton("Missed Approach", "missed_approach");
            addButton("Mayday", "mayday");
            addButton("Request Taxi to Gate", "request_taxi_to_gate");
            enableButtons();
            break;
        case 'request_taxi':
          clearButtons();
          sendMessage("Hello, this is the captain speaking, we are ready for taxiing to for take-off.");
          let delay3 = new Promise(resolve => setTimeout(resolve, 2000));
          delay3.then(() => towerMessage("Please wait, there are other planes ahead of you on the requested route."));
          let delay4 = new Promise(resolve => setTimeout(resolve, 6000));
          delay4.then(() => towerMessage("Cleared for taxiing."));
            addButton("Request Takeoff", "request_takeoff");
            addButton("Request Landing", "request_landing");
            addButton("Request Taxi to Gate", "request_taxi_to_gate");
            enableButtons();
            break;
        case 'request_taxi_to_gate':
          clearButtons();
          sendMessage("Hello, this is the captain speaking, we are ready for taxiing to the gate.");
          let delay5 = new Promise(resolve => setTimeout(resolve, 5000));
          delay5.then(() => towerMessage("Cleared for taxiing."));
            addButton("Request Taxi", "request_taxi");
            enableButtons();
            break;
        case 'mayday':
          clearButtons();
            sendMessage("MAYDAY, MAYDAY, MAYDAY. We have an engine failure. We are losing speed!!!");
            let delay6 = new Promise(resolve => setTimeout(resolve, 2000));
            delay6.then(() => towerMessage("When able tell us how many souls and the amount of fuel on the plane."));
            addButton("Request Emergency Landing", "request_emergency_landing");
            enableButtons();
            break;
        case 'missed_approach':
          clearButtons();
            sendMessage("Hello, this is the captain speaking. We've missed our approach to land. Requesting another approach");
            let delay20 = new Promise(resolve => setTimeout(resolve, 2000));
            delay20.then(() => towerMessage("Cleared for another approach. Climb to about 3000 feet and tell us how many souls and the amount of fuel on the plane."));
            addButton("Request Another Approach", "request_another_approach");
            enableButtons();
            break;
        case 'request_emergency_landing':
          clearButtons();
            sendMessage("Hello, this is the captain speaking. Requesting an Emergancy landing");
            let delay7 = new Promise(resolve => setTimeout(resolve, 2000));
            delay7.then(() => towerMessage("You are cleared to land on any prefered runway."));            
            addButton("Request Taxi to Maintenance", "request_taxi_to_maintenance");
            break;
        case 'request_another_approach':
          clearButtons();
            sendMessage("Hello, this is the captain speaking. Requesting another approach");
            let delay8 = new Promise(resolve => setTimeout(resolve, 2000));
            delay8.then(() => towerMessage("Cleared for another approach. When able tell us how many souls and the amount of fuel on the plane."));
            addButton("Request Landing", "request_landing");
            addButton("Mayday", "mayday");
            break;
        case 'request_taxi_to_maintenance':
          clearButtons();
            sendMessage("Hello, this is the captain speaking, we have thankfully landed. Requesting taxi to maintenance");
            let delay9 = new Promise(resolve => setTimeout(resolve, 2000));
            delay9.then(() => towerMessage("Captain please wait for a toll to arrive."));
            addButton("Arrived at Maintenance", "arrived_maintenance");
            break;
        case 'arrived':
          clearButtons();
          appendMessage("Captain", "Great job pilot, you have completed your flight.");
        case 'arrived_maintenance':
          clearButtons();
          sendMessage("Hello, this is the captain speaking. We are shutting down the aircraft for maintenance.");
          let delay10 = new Promise(resolve => setTimeout(resolve, 2000));
          delay10.then(() => towerMessage("Rorger that, stairs are comming down to your aircraft."));
          sendMessage("Thank you for your service. Good day.");
            break; // No further actions
    }
  }
  function disableButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}
    function clearButtons() {
      const button_container = document.getElementById("chatOptions");
      button_container.innerHTML = "";
    }
    function addButton(lable, action) {
      const button_container = document.getElementById("chatOptions");
      const newButton = document.createElement("button");
      newButton.textContent = lable;
      newButton.onclick = function() {
        handleChatInput(action);
      }
      button_container.appendChild(newButton);
    }
    function sendMessage(message) {
      if (message !== "") {
        appendMessage("You", message);
      }
    }

    // Function to append message to chat interface
    function appendMessage(sender, message) {
      const chatMessages = document.getElementById("chatMessages");
      const messageDiv = document.createElement("div");
      messageDiv.textContent = sender + ": " + message + " " + new Date().toLocaleTimeString();
      chatMessages.appendChild(messageDiv);
    }

    function towerMessage(message) {
      
      if (message !== "") {
        appendMessage("Tower", message);
         // Clear input field after sending message
      }
    }
    towerMessage("Hello, How can I help you?");
      `;
      document.head.appendChild(javaforflightMenu);