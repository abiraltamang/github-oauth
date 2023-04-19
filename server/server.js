const express = require('express');
const cors = require('cors')
require('dotenv').config()
const fetch = (...args)=>
    import('node-fetch').then(({default:fetch})=>fetch(...args));
const bodyParser = require('body-parser');


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res)=>{
   res.send('hello world')
})

//code being passed from the frontend
app.get('/getAccessToken', async (req, res)=>{
    console.log(req.query.code)
    req.query.code;
    console.log(process.env.CLIENT_ID)

    const params = "?client_id="+ process.env.CLIENT_ID + "&client_secret="+ process.env.CLIENT_SECRET + "&code=" + req.query.code;
    
    await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers :{
            "Accept": "application/json"
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        // console.log(data)
        res.json(data);
    })
})

//getUserData
//access token is going to be passed in as an Authorized header

app.get('/getUserData', async (req, res)=>{
    req.get("Authorization"); //Bearer AccessToken
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers:{
            "Authorization": req.get("Authorization") //Bearer AccessToken
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        return res.json(data)
    })
})


app.listen(4000, ()=>{
    console.log("Server running at http://localhost:4000");
})