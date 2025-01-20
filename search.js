// saves input from search bar in the user
function saveInput() {
  const userInput = document.getElementById("headerSearchBar").value;
  localStorage.setItem('userInput', userInput);
  window.location.href = `playercard.html?userInput=${encodeURIComponent(userInput)}`;
}

// loads the current news from NBA news API
async function loadNews() {
  try {
    const newsResponse = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news");

    if (!newsResponse.ok) {
      throw new Error("Could not fetch resource at this time!");
    }

    const newsData = await newsResponse.json();
    const articles = newsData.articles;

    console.log(articles);

    // setting the news in each of the news sections, updating descriptions and headlines for news
    for (let i = 0; i < 6; i ++) {
      const news = articles[i];
      if (news.images.length === 0) {
        continue;
      }
      if (i === 0) {
        updateNews("newsImg1", "newsDescription1", "newsHeadline1", "seeMoreBtn1", news);
      }
      else if (i === 1) {
        updateNews("newsImg2", "newsDescription2", "newsHeadline2", "seeMoreBtn2", news);
      }
      else if (i === 2) {
        updateNews("newsImg3", "newsDescription3", "newsHeadline3", "seeMoreBtn3", news);
      }
      else if (i === 3) {
        updateNews("newsImg4", "newsDescription4", "newsHeadline4", "seeMoreBtn4", news);
      }
      else if (i === 4) {
        updateNews("newsImg5", "newsDescription5", "newsHeadline5", "seeMoreBtn5", news);
      }
      else{
        updateNews("newsImg6", "newsDescription6", "newsHeadline6", "seeMoreBtn6", news);
      }
    }
  }

  catch(error) {
    console.error(error);
  }
}

function updateNews(newsImg, newsDescription, newsHeadline, btnName, news) {
  document.querySelector(`.${newsImg}`).src = news.images[0].url;
  document.querySelector(`.${newsImg}`).height = 250;
  document.querySelector(`.${newsImg}`).width = 390;
  document.querySelector(`.${newsDescription}`).textContent = news.description;
  document.querySelector(`.${newsHeadline}`).textContent = news.headline;
  document.querySelector(`.${btnName}`).href = news.links.web.href;
}

async function fetchTeam(teamName) {
  try {
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamName}/roster`);
    if (!response.ok) {
      throw new Error("Could not fetch team");
    }
    const data = await response.json();
    return data;
  }

  catch(error) {
    console.error(error);
  }
}

function findPlayer(data, targetPlayerName) {
  let requiredPlayer = null;
  for (let i = 0; i < data.athletes.length; i ++) {
    let currentPlayerName = data.athletes[i].firstName;
    if (currentPlayerName === targetPlayerName) {
      requiredPlayer = data.athletes[i];
    }
  }
  return requiredPlayer;
}

function setPlayerCard1(teamData, athleteData) {
  document.querySelector(".giannis").textContent = athleteData.fullName;
  const bucksColor = teamData.team.color;
  document.querySelector(".player1").style.backgroundColor = hexToRgb(bucksColor);
  document.querySelector(".player1Image").src = `${athleteData.headshot.href}`;
  document.querySelector(".pointsContainer1").style.backgroundColor = darkenHexColor(bucksColor, 0.75);
  document.querySelector(".reboundsContainer1").style.backgroundColor = darkenHexColor(bucksColor, 0.75);
  document.querySelector(".assistsContainer1").style.backgroundColor = darkenHexColor(bucksColor, 0.75);
}

function setPlayerCard2(teamData, athleteData) {
  document.querySelector(".lebron").textContent = athleteData.fullName;
  const lakersColor = teamData.team.color;
  document.querySelector(".player2").style.backgroundColor = hexToRgb(lakersColor);
  document.querySelector(".player2Image").src = `${athleteData.headshot.href}`;
  document.querySelector(".pointsContainer2").style.backgroundColor = darkenHexColor(lakersColor, 0.75);
  document.querySelector(".reboundsContainer2").style.backgroundColor = darkenHexColor(lakersColor, 0.75);
  document.querySelector(".assistsContainer2").style.backgroundColor = darkenHexColor(lakersColor, 0.75);
}


function setPlayerCard3(teamData, athleteData) {
  document.querySelector(".curry").textContent = athleteData.fullName;
  const warriorsColor = teamData.team.color;
  document.querySelector(".player3").style.backgroundColor = hexToRgb(warriorsColor);
  document.querySelector(".player3Image").src = `${athleteData.headshot.href}`;
  document.querySelector(".pointsContainer3").style.backgroundColor = darkenHexColor(warriorsColor, 0.75);
  document.querySelector(".reboundsContainer3").style.backgroundColor = darkenHexColor(warriorsColor, 0.75);
  document.querySelector(".assistsContainer3").style.backgroundColor = darkenHexColor(warriorsColor, 0.75);
}


async function loadStarPlayers() {
  const bucks = await fetchTeam("mil");
  const lakers = await fetchTeam("lal");
  const warriors = await fetchTeam("gsw");

  console.log(bucks);

  const giannis = findPlayer(bucks,"Giannis");
  const lebron = findPlayer(lakers, "LeBron");
  const curry = findPlayer(warriors, "Stephen");

  setPlayerCard1(bucks, giannis);
  setPlayerCard2(lakers, lebron);
  setPlayerCard3(warriors, curry);

  try {
    const giannisresponse = await fetch(`https://cors-anywhere.herokuapp.com/http://rest.nbaapi.com/api/PlayerDataTotals/query?playerName=${giannis.fullName}&season=2025`);
    const giannisData = await giannisresponse.json();

    const lebronresponse = await fetch(`https://cors-anywhere.herokuapp.com/http://rest.nbaapi.com/api/PlayerDataTotals/query?playerName=${lebron.fullName}&season=2025`);
    const lebronData = await lebronresponse.json();

    const curryresponse = await fetch(`https://cors-anywhere.herokuapp.com/http://rest.nbaapi.com/api/PlayerDataTotals/query?playerName=${curry.fullName}&season=2025`);
    const curryData = await curryresponse.json();

    updateCard1Information(giannisData);
    updateCard2Information(lebronData);
    updateCard3Information(curryData);
  }

  catch(error) {
    console.error(error);
  }

}

// loads the 3 best/popular players from each team
async function loadTeamPlayers() {
  try {
    const userTeam = document.querySelector(".teamSelection").value;
    
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${userTeam}/roster`);
    if (!response.ok) {
      throw new Error("Please enter an NBA team");
    }
    const data = await response.json();
    const players = data.athletes; // all players

    let highestPlayer = null;
    let secondHighestPlayer = null;
    let thirdHighestPlayer = null;

    for (let i = 0; i < players.length; i++) {
      if (!players[i].contract || players[i].contract.salary === undefined || players[i].contract.incomingTradeValue === undefined) {
        continue;
      }

      const playerSalary = players[i].contract.salary;
      const tradeValue = players[i].contract.incomingTradeValue;
  
      // Calculate the effective sum
      let sum = (tradeValue === playerSalary) ? playerSalary : playerSalary + tradeValue;

      // Update the top 3 players based on the sum
      if (!highestPlayer || sum > (highestPlayer.contract.salary + (highestPlayer.contract.incomingTradeValue === highestPlayer.contract.salary ? 0 : highestPlayer.contract.incomingTradeValue))) {
        // Shift down
        thirdHighestPlayer = secondHighestPlayer;
        secondHighestPlayer = highestPlayer;

        // Update highest
        highestPlayer = players[i];
      } 
      else if (!secondHighestPlayer || sum > (secondHighestPlayer.contract.salary + (secondHighestPlayer.contract.incomingTradeValue === secondHighestPlayer.contract.salary ? 0 : secondHighestPlayer.contract.incomingTradeValue))) {
        // Shift down
        thirdHighestPlayer = secondHighestPlayer;

        // Update second highest
        secondHighestPlayer = players[i];
      } 
      else if (!thirdHighestPlayer || sum > (thirdHighestPlayer.contract.salary + (thirdHighestPlayer.contract.incomingTradeValue === thirdHighestPlayer.contract.salary ? 0 : thirdHighestPlayer.contract.incomingTradeValue))) {
        // Update third highest
        thirdHighestPlayer = players[i];
      }
    }

    const player1Picture = document.querySelector(".player1Image");
    const player2Picture = document.querySelector(".player2Image");
    const player3Picture = document.querySelector(".player3Image");

    player1Picture.src = `${highestPlayer.headshot.href}`;
    player2Picture.src = `${secondHighestPlayer.headshot.href}`;
    player3Picture.src = `${thirdHighestPlayer.headshot.href}`;

    const playerContainerList = document.querySelectorAll(".playerContainer");
    const teamColor = data.team.color;
    for (let i = 0; i < playerContainerList.length; i ++) {
      playerContainerList[i].style.backgroundColor = hexToRgb(`${teamColor}`);
    }

    if (highestPlayer.fullName === "Luka Doncic") {
      highestPlayer.fullName = "Luka Dončić";
    }

    if (highestPlayer.fullName === "Nikola Jokic") {
      highestPlayer.fullName = "Nikola Jokić";
    }

    if (thirdHighestPlayer.fullName === "Nikola Vucevic") {
      thirdHighestPlayer.fullName = "Nikola Vučević";
    }

    const containers = document.querySelectorAll(".container");
    for (let i = 0; i < containers.length; i ++) {
      containers[i].style.backgroundColor = darkenHexColor(teamColor, 0.75);
    }

    const highestPlayerData = await fetchPlayerStats(`${highestPlayer.fullName}`);
    const secondHighestPlayerData = await fetchPlayerStats(`${secondHighestPlayer.fullName}`);
    const thirdHighestPlayerData = await fetchPlayerStats(`${thirdHighestPlayer.fullName}`);

    updateCard1Information(highestPlayerData);
    updateCard2Information(secondHighestPlayerData);
    updateCard3Information(thirdHighestPlayerData);
  }

  catch(error) {
    console.error(error);
  }

}

async function fetchPlayerStats(playerName) {
  try {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/http://rest.nbaapi.com/api/PlayerDataTotals/query?playerName=${playerName}&season=2025`);
    if (!response.ok) {
      throw new Error("Could not find player. Please enter the correct spelling of the player.");
    }
    const data = await response.json();
    return data;
  }
  catch(error) {
    console.error(error);
  }
}

function updateCard1Information(data) {
  document.querySelector(".teamPlayer1").textContent = data[0].playerName;
  document.querySelector(".p1points").textContent = (data[0].points / data[0].games).toFixed(1);
  document.querySelector(".p1rebounds").textContent = (data[0].totalRb / data[0].games).toFixed(1);
  document.querySelector(".p1assists").textContent = (data[0].assists / data[0].games).toFixed(1);
}

function updateCard2Information(data) {
  document.querySelector(".teamPlayer2").textContent = data[0].playerName;
  document.querySelector(".p2points").textContent = (data[0].points / data[0].games).toFixed(1);
  document.querySelector(".p2rebounds").textContent = (data[0].totalRb / data[0].games).toFixed(1);
  document.querySelector(".p2assists").textContent = (data[0].assists / data[0].games).toFixed(1);
}

function updateCard3Information(data) {
  document.querySelector(".teamPlayer3").textContent = data[0].playerName;
  document.querySelector(".p3points").textContent = (data[0].points / data[0].games).toFixed(1);
  document.querySelector(".p3rebounds").textContent = (data[0].totalRb / data[0].games).toFixed(1);
  document.querySelector(".p3assists").textContent = (data[0].assists / data[0].games).toFixed(1);
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

function darkenHexColor(hex, factor) {
  // Remove '#' if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Apply the darkening factor
  r = Math.max(0, Math.min(255, Math.floor(r * factor)));
  g = Math.max(0, Math.min(255, Math.floor(g * factor)));
  b = Math.max(0, Math.min(255, Math.floor(b * factor)));
  
  // Convert back to hex
  const toHex = (value) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function movePlayersDown() {
  document.querySelector(".mostPopularPlayersContainer").style.marginTop = "45%";
}

document.querySelector(".teamSelection").onclick = movePlayersDown;

document.querySelector(".teamSelection").addEventListener("change",function() {
  const selectedValue = this.value;
  if (selectedValue === "0") {
    loadStarPlayers();
  }
  loadTeamPlayers();
  if (selectedValue) {
    document.querySelector(".mostPopularPlayersContainer").style.marginTop = "50%";
  }
});

document.addEventListener("visibilitychange", () => {
  document.querySelector(".teamSelection").selectedIndex = 0;
})

document.addEventListener("visibilitychange", () => {
    document.getElementById("headerSearchBar").placeholder = "Search Here...";
    document.getElementById("headerSearchBar").value = '';
});

document.querySelector(".teamSelection").addEventListener("mouseout",function() {
  document.querySelector(".mostPopularPlayersContainer").style.marginTop = "3%";
});

loadNews();