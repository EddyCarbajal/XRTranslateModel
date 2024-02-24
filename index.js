const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const app = express();


app.get('/', (req, res) => {
    console.log("into then home index");
    res.send("Hello from the server");
});


const tfModelRouter = require("./src/App");
app.use('/detect', tfModelRouter);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));