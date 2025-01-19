export default async function handler(req, res) {
    const { userInput } = req.query; // Extract playerName from the query parameters
  
    if (!userInput) {
      return res.status(400).json({ message: 'Player name is required' });
    }
  
    const url = `http://rest.nbaapi.com/api/PlayerDataTotals/query?playerName=${encodeURIComponent(userInput)}&season=2025`;
  
    try {
      const response = await fetch(url);
  
      if (response.ok) {
        const data = await response.json();
        res.status(200).json(data);
      } else {
        res.status(500).json({ message: 'Error fetching player data' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching player data', error: error.message });
    }
  }
  