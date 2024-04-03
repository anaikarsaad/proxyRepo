const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const API_SERVICE_URL = "https://api.deafassistant.com";
app.get("/", (req, res) => res.send("Express on Vercel"));
app.use('/api', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${req.method} ${API_SERVICE_URL}${req.url}`);
  },
  logLevel: 'debug',
}));

// Define the new endpoint
app.post('/CreateStreamWithStyle', async (req, res) => {
  const { name, bannerColor, logoUrl } = req.body;
  try {
    const response = await axios.post(`${API_SERVICE_URL}/Stream/CreateStreamWithStyle`, {
      name,
      bannerColor,
      logoUrl
    });
    
    console.log("Stream creation successful:", response.data);
    res.send(response.data);
  } catch (error) {
    console.error('Error creating stream:', error);
    res.status(500).send("There was an error creating the stream.");
  }
});
app.post('/RenameStream', async (req, res) => {
    const { oldName, name, bannerColor, logoUrl } = req.body;
    try {
      const response = await axios.post(`${API_SERVICE_URL}/stream/RenameStream`, {
        oldName,
        name,
        bannerColor,
        logoUrl
      });
      
      console.log("Stream rename successful:", response.data);
      res.send(response.data);
    } catch (error) {
      console.error('Error renaming stream:', error);
      res.status(500).send("There was an error renaming the stream.");
    }
  });
  app.post('/DeleteStream', async (req, res) => {
    const { oldName } = req.body;
    try {
      const response = await axios.post(`${API_SERVICE_URL}/stream/DeleteStream`, {
        oldName
      });
      
      console.log("Stream deletion successful:", response.data);
      res.send(response.data);
    } catch (error) {
      console.error('Error deleting stream:', error);
      res.status(500).send("There was an error deleting the stream.");
    }
  });
    

  const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
