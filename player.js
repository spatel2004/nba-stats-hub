async function getStats() {
    try {
        const userInput = localStorage.getItem('userInput');
        console.log(userInput);
        
        const response = await fetch(`http://b8c40s8.143.198.70.30.sslip.io/api/PlayerDataTotals/query?playerName=${userInput}&season=2025&ascending=true&pageNumber=1&pageSize=1`);
        console.log(response);

        const data = await response.json();
        console.log(data);

        const playerName = document.querySelector(".playerName");
        playerName.textContent = data[0].playerName;

        const playerId = data[0].playerId;
        console.log(playerId);

        const playerPicture = document.querySelector(".nbaPlayerImage");
        playerPicture.src = `https://www.basketball-reference.com/req/202106291/images/headshots/${playerId}.jpg`;

    }

    catch (error) {
        console.error(error);
    }

}

async function fetchPlayerImage() {
    const teamAbbr = "hou"; // Replace with the team's abbreviation
    const apiUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamAbbr}/roster`;

    const response = await fetch(apiUrl);
    console.log(response);

    const data = await response.json();
    console.log(data);

    const pName = "Jalen Green";
    const player = data.athletes.find(eachPlayer => eachPlayer.fullName === pName);
    console.log(player);

    if (player) {
        const headShotUrl = player.headshot.href;
        document.querySelector(".nbaPlayerImage").src = `${headShotUrl}`;
    }

//     })
//   .catch(error => console.error("Error fetching data:", error));
}
fetchPlayerImage();