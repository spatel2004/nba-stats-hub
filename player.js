async function getPlayer() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const userInput = urlParams.get('userInput');
        console.log(userInput);
        
        const response = await fetch(`http://rest.nbaapi.com/api/PlayerDataTotals/query?playerName=${userInput}&season=2025`);
        console.log(response);

        if (!response.ok) {
            throw new Error("Could not find player in the current season");
        }

        const data = await response.json();
        console.log(data);

        if (data[0].team === "BRK") {
            data[0].team = "BKN";
        }

        if (data[0].team === "CHO") {
            data[0].team = "CHA";
        }

        fetchPlayerImage(data[0].playerName, data[0].team);
        fetchPlayerGameStats(data);
        fetchCareerInformation(data);
    }

    catch (error) {
        console.error(error);
    }

}

async function fetchPlayerImage(playerName, teamName) {
    try {
        const response1 = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamName.toLowerCase()}/roster`)
        if (!response1.ok) {
            throw new Error("Could not find this NBA player based on his name");
        }
        const data1 = await response1.json();
        console.log(data1);

        const players = data1.athletes;
        console.log(players);

        const fullTeamName = data1.team.displayName;

        let requiredPlayer = null;

        for (let i = 0; i < players.length; i ++) {
            let currentPlayer = players[i];
            if (currentPlayer.fullName === playerName) {
                requiredPlayer = currentPlayer;
                break;
            }
            else if (currentPlayer.firstName === "Nikola") {
                requiredPlayer = currentPlayer;
                break;
            }
        }

        const teamColor = data1.team.color;

        //updating player personal info here 

        console.log(requiredPlayer);

        document.querySelector(".playerName").textContent = requiredPlayer.displayName;
        document.querySelector(".playerTeam").textContent = fullTeamName + document.querySelector(".playerTeam").textContent;
        document.querySelector(".playerNumber").textContent = "#" + requiredPlayer.jersey;

        document.querySelector(".playerContainer").style.backgroundColor = hexToRgb(`${teamColor}`);

        if (requiredPlayer.position.parent) {
            document.querySelector(".playerPosition").textContent = requiredPlayer.position.parent.displayName;
        }
        else {
            document.querySelector(".playerPosition").textContent = requiredPlayer.position.displayName;
        }

        document.querySelector(".playerHeight").textContent = requiredPlayer.displayHeight;
        document.querySelector(".playerWeight").textContent = requiredPlayer.displayWeight;

        document.querySelector(".playerPicture").src = requiredPlayer.headshot.href;
        document.querySelector(".playerPicture").style.backgroundColor = hexToRgb(`${teamColor}`);
        const stats = document.querySelectorAll(".statContainer");
        for (let i = 0; i < stats.length; i ++) {
            stats[i].style.backgroundColor = hexToRgb(`${teamColor}`);
        }

        document.querySelector(".playerPic").src = data1.team.logo;
    }
    catch(error) {
        console.error(error);
    }
}



function fetchPlayerGameStats(data) {
    const pointsPerGame = ((data[0].points) / (data[0].games)).toFixed(1);
    const reboundsPerGame = ((data[0].totalRb) / (data[0].games)).toFixed(1);
    const assistsPerGame = ((data[0].assists) / (data[0].games)).toFixed(1);
    const stealsPerGame = ((data[0].steals) / (data[0].games)).toFixed(1);

    document.querySelector(".ppg").textContent = pointsPerGame;
    document.querySelector(".rbg").textContent = reboundsPerGame;
    document.querySelector(".apg").textContent = assistsPerGame;
    document.querySelector(".spg").textContent = stealsPerGame;
    
}

function fetchCareerInformation(data) {

}

function hexToRgb(hex) {
    // Remove the leading '#' if present
    hex = hex.replace(/^#/, '');
  
    // Parse the hex string into integer values for red, green, and blue
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
  
    return `rgb(${r}, ${g}, ${b})`;
}

getPlayer();
