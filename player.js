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
        fetchPlayerPrimaryStats(data);
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

        let requiredPlayer = null;

        for (let i = 0; i < players.length; i ++) {
            let currentPlayer = players[i];
            if (currentPlayer.fullName === playerName) {
                requiredPlayer = currentPlayer;
                break;
            }
        }
        console.log(requiredPlayer);

        const teamColor = data1.team.color;

        document.querySelector(".playerPicture").src = requiredPlayer.headshot.href;
        document.querySelector(".playerPicture").style.backgroundColor = hexToRgb(`${teamColor}`);
        const stats = document.querySelectorAll(".stat");
        for (let i = 0; i < stats.length; i ++) {
            stats[i].style.borderColor = hexToRgb(`${teamColor}`);
        }
    }
    catch(error) {
        console.error(error);
    }
}

function fetchPlayerPrimaryStats(data) {
    const pointsPerGame = ((data[0].points) / (data[0].games)).toFixed(1);
    const reboundsPerGame = ((data[0].totalRb) / (data[0].games)).toFixed(1);
    const assistsPerGame = ((data[0].assists) / (data[0].games)).toFixed(1);
    const stealsPerGame = ((data[0].steals) / (data[0].games)).toFixed(1);
    const blocksPerGame = ((data[0].blocks) / (data[0].games)).toFixed(1);

    const statsArray = [pointsPerGame, reboundsPerGame, assistsPerGame, stealsPerGame, blocksPerGame];
    const listStats = document.querySelectorAll(".stat1");

    let i = 0;

    for (const stat of listStats) {
        stat.textContent = statsArray[i];
        i += 1;
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

async function fetchNews() {
    const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard");
    console.log(response);

    const data = await response.json();
    console.log(data);
}
getPlayer();
fetchNews();
