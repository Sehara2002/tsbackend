const express = require('express');
const cors = require('cors');
const getClient = require('./db.js');
const bodyParser = require('body-parser');
require('events').EventEmitter.defaultMaxListeners = 20;

const app = express();
const PORT = 5000;
let lightDataChanged = false;
app.use(cors());
app.use(bodyParser.json());
let lightState;
let tempState;
let humdState;
let ard_light = { status: 'on', time: {
    hour:0,
    min:0,
    sec:0
} };
let ard_temp = 0;
let ard_humd = 0;


app.post("/setLight", (req, res) => {
    const light = req.body;
    let sendData = {
        onTime: light.onTime,
        onDuration: light.onDuration,
        offDuration: light.offDuration
    };
    lightDataChanged = true;
    res.send(sendData);
    lightState = sendData;
    console.log(sendData);
})

app.post("/getuser", async (req, res) => {
    const client = await getClient();
    const db = client.db("TissueCulture");
    const collection = db.collection("Users");
    const un = req.body;
    console.log(un.username);
    const resp = collection.findOne({ Username: un.username });
    resp.then(response => {
        console.log(response["Password"]);
        res.send({ Status: true, Password: response["Password"] });
    }).catch(err => {
        console.log(err);
        res.send({ Status: false, Password: "Cannot Find user" });
    })
})

app.post("/setTemp", (req, res) => {
    const temp = req.body;
    let sendData = {
        mintemp: parseFloat(temp.minimumTemp),
        maxtemp: parseFloat(temp.maximumTemp)
    }
    res.send(sendData);
    tempState = sendData;
    console.log(sendData);
})


app.post("/setHumd", (req, res) => {
    const humd = req.body;
    let sendData = {
        minhumd: parseInt(humd.minhumd),
        maxhumd: parseInt(humd.maxhumd)
    };
    res.send(sendData);
    humdState = sendData;
    console.log(sendData);
})

app.get("/", async (req, res) => {
    const client = await getClient();
    const db = client.db("TissueCulture");
    const collection = db.collection("Users");
    const result = await collection.insertOne({ UserId: 1, 
        Username: "Shehara", 
        Password: "1234" 
    });
    console.log(result.insertedId);
    res.send({ "Insert ID": result.insertedId });
})
app.post("/light", (req, res) => {
    res.send({Status: lightDataChanged, lightData: lightState});
    lightDataChanged = false;
});

app.post("/temp", (req, res) => {
    res.send(tempState);
})

app.post("/humd", (req, res) => {
    res.send(humdState);
})


app.post("/getTemp", async (req, res) => {
    const temp = req.body;
    ard_temp = temp.CurrentTemp;
    const client = await getClient();
    const db = client.db("TissueCulture");
    const collection = db.collection("TempData");
    
    res.send({ temp: temp.CurrentTemp });
    console.log(ard_temp);

})

app.post("/getHumd", (req, res) => {
    const humd = req.body;
    ard_humd = humd.CurrentHumd;
    res.send({ humd: humd.CurrentHumd });
    console.log(ard_humd);
})

app.post("/getLight", (req, res) => {
    const light = req.body;
    ard_light = light;
    res.send({ light: light.lightData });
})


app.post("/getFrontTemp", (req, res) => {
    res.send({ temp: ard_temp });
})

app.post("/getFrontHumd", (req, res) => {
    res.send({ humd: ard_humd });

})
app.post("/getFrontLight", (req, res) => {
    res.send({
        status: ard_light.status,
        onTime: {
            hour: 8,
            min: 25,
            sec: 49
        }
    });
})

app.listen(PORT, () => {
    console.log(`Local server is running on ${PORT}`);
})