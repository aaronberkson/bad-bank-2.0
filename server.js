import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = "mongodb+srv://aaronberkson:EVQAV5rMRKcQbyak@clusterone.amlfjbi.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOne";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// API endpoint to fetch data from MongoDB
app.get('/api/fetchData', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('badbank'); // Ensure 'badbank' is your actual database name
    const collection = database.collection('users');
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Error fetching data' });
  } finally {
    await client.close();
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
