async function getPlayer() {
    try {
        const userInput = localStorage.getItem('userInput');
        console.log(userInput);
        
        const response = await fetch(`http://b8c40s8.143.198.70.30.sslip.io/api/PlayerDataTotals/query?playerName=${userInput}&season=2025&ascending=true&pageNumber=1&pageSize=1`);
        console.log(response);

        const data = await response.json();
        console.log(data);

        const playerName = document.querySelector(".playerName");
        playerName.textContent = data[0].playerName;

        fetchPlayerImage(data[0].playerName, data[0].team);
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

        const players = data1.athletes;
        console.log(players);

        let requiredPlayer = null;

        for (let i = 0; i < players.length; i ++) {
            let currentPlayer = players[i];
            if (currentPlayer.fullName === playerName) {
                requiredPlayer = currentPlayer;
                break;
            }
        }
        console.log(requiredPlayer);

        document.querySelector(".playerPicture").src = requiredPlayer.headshot.href;
        document.querySelector(".playerPicture").style.backgroundColor = hexToRgb(`${data1.team.color}`);
    }
    catch(error) {
        console.error(error);
    }
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