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