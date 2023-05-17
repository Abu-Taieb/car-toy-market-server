const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Car toy market server is Running');
})

app.listen(port, () => {
    console.log(`Car toy server is running on port ${port}`);
})