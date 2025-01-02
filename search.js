function saveInput() {
  const userInput = document.getElementById("headerSearchBar").value;
  localStorage.setItem('userInput', userInput);
  window.location.href="playercard.html";
}

async function loadTeamPlayers() {
  try {
    const userTeam = document.querySelector(".teamSelection").value.toLowerCase().slice(0,3);
    console.log(userTeam);

    if (!userTeam) {
      throw new Error("Please enter a team first");
    }
    else{
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${userTeam}/roster`);
      if (!response.ok) {
        throw new Error("Please enter an NBA team");
      }
      console.log(response);

      const data = await response.json();
      console.log(data);

      const players = data.athletes; // all players

      let highestPlayer = null;
      let secondHighestPlayer = null;
      let thirdHighestPlayer = null;

      for (let i = 0; i < players.length; i++) {
        const salary = players[i].contract.salary;
        const tradeValue = players[i].contract.incomingTradeValue;
  
        // Calculate the effective sum
        let sum = (tradeValue === salary) ? salary : salary + tradeValue;

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

      console.log("Highest Paid Player:", highestPlayer);
      console.log("Second Highest Paid Player:", secondHighestPlayer);
      console.log("Third Highest Paid Player:", thirdHighestPlayer);

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
      updateCard1Information(highestPlayer);
      updateCard2Information(secondHighestPlayer);
      updateCard3Information(thirdHighestPlayer);

    }
  }

  catch(error) {
    console.error(error);
  }

}

function updateCard1Information(data) {
  document.querySelector(".teamPlayer1").textContent = data.fullName;
}

function updateCard2Information(data) {
  document.querySelector(".teamPlayer2").textContent = data.fullName;
}

function updateCard3Information(data) {
  document.querySelector(".teamPlayer3").textContent = data.fullName;
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

async function loadStarPlayers() {
  try {
    const bucks = "mil";
    const lakers = "lal";
    const gsw = "gsw";

    const response1 = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${bucks}/roster`)
    const data1 = await response1.json();

    let giannis = null;

    for (let i = 0; i < data1.athletes.length; i ++) {
      let currentPlayerName = data1.athletes[i].firstName;
      if (currentPlayerName === "Giannis") {
        document.querySelector(".player1Image").src = data1.athletes[i].headshot.href;
        giannis = data1.athletes[i];
      }
    }
    document.querySelector(".giannis").textContent = giannis.fullName;
    const bucksColor = data1.team.color;
    document.querySelector(".player1").style.backgroundColor = hexToRgb(bucksColor);



    const response2 = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${lakers}/roster`)
    const data2 = await response2.json();

    let lebron = null;

    for (let i = 0; i < data2.athletes.length; i ++) {
      let currentPlayerName = data2.athletes[i].firstName;
      if (currentPlayerName === "LeBron") {
        document.querySelector(".player2Image").src = data2.athletes[i].headshot.href;
        lebron = data2.athletes[i];
      }
    }
    document.querySelector(".lebron").textContent = lebron.fullName;
    const lakersColor = data2.team.color;
    document.querySelector(".player2").style.backgroundColor = hexToRgb(lakersColor);


    const response3 = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${gsw}/roster`)
    const data3 = await response3.json();

    let curry = null;
    for (let i = 0; i < data3.athletes.length; i ++) {
      let currentPlayerName = data3.athletes[i].firstName;
      if (currentPlayerName === "Stephen") {
        document.querySelector(".player3Image").src = data3.athletes[i].headshot.href;
        curry = data3.athletes[i];
      }
    }
    document.querySelector(".curry").textContent = curry.fullName;
    const warriorsColor = data3.team.color;
    document.querySelector(".player3").style.backgroundColor = hexToRgb(warriorsColor);


  }

  catch(error) {
    console.error(error);
  }
  


}