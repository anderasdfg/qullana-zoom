//include required modules
const jwt = require('jsonwebtoken');
const config = require('./config');
const rp = require('request-promise');

//import { ZoomMtg } from '@zoomus/websdk';

// console.log('checkSystemRequirements');
// console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));


const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
var email, userid, resp,topic, datemeeting,password,duration;
//const port = 3000;

app.set('port', process.env.PORT || 3000)


//Use the ApiKey and APISecret from config.js
const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);
console.log(token);

//get the form 
app.get('/', (req,res) => res.send(req.body));

//use userinfo from the form and make a post request to /userinfo
app.post('/userinfo', (req, res) => {
  //store the email address of the user in the email variable
  email = req.body.email;
  //check if the email was stored in the console
  console.log(email);
  //Store the options for Zoom API which will be used to make an API call later.
  var options = {
    //You can use a different uri if you're making an API call to a different Zoom endpoint.
    uri: "https://api.zoom.us/v2/users/"+email, 
    qs: {
        status: 'active' 
    },
    auth: {
        'bearer': token
    },
    headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
    },
    json: true //Parse the JSON string in the response
};

//Use request-promise module's .then() method to make request calls.
rp(options)
    .then(function (response) {
      //printing the response on the console
        console.log('User has', response);
        //console.log(typeof response);
        resp = response
        //Adding html to the page
        var title1 ='<center><h3>Your token: </h3></center>' 
        var result1 = title1 + '<code><pre style="background-color:#aef8f9;">' + token + '</pre></code>';
        var title ='<center><h3>User\'s information:</h3></center>' 
        //Prettify the JSON format using pre tag and JSON.stringify
        var result = title + '<code><pre style="background-color:#aef8f9;">'+JSON.stringify(resp, null, 2)+ '</pre></code>'
        res.send(result1 + '<br>' + result);
 
    })
    .catch(function (err) {
        // API call failed...
        console.log('API call failed, reason ', err);
    });
});

//'2020-04-17 15:00:00 UTC-5'
app.post('/crear/:correo/:topic/:datemeeting/:password/:duration',(req,res)=>{   
    topic       = req.params.topic;
    datemeeting = req.params.datemeeting;//Math.floor(new Date(req.params.datemeeting) / 1000); // => 1301418381
    password    = req.params.password;
    duration    = req.params.duration
    //console.log(req.body);    
    var options = {
        method: 'POST',
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/users/"+req.params.correo+"/meetings",             
        headers: {
           // 'User-Agent': 'Zoom-api-Jwt-Request',
            'content-type': 'application/json',
            'Authorization': 'bearer ' + token
        },
        body:{
            "topic": topic,
            "type": 1,
            "start_time": datemeeting,
            "duration": duration,
            "timezone": "GMT -5",
            "password": password,
            "agenda": "CITA VIRTUAL",
            "recurrence": {
              "type": 1    
            },
            "settings": {
              "host_video": true,
              "participant_video": true,
              "cn_meeting": false,
              "in_meeting": false,
              "join_before_host": true,
              "mute_upon_entry": false,
              "watermark": false,
              "use_pmi": false,
              "approval_type": 1,
              "registration_type": 1,    
              "enforce_login": false,        
              "global_dial_in_countries": [     
              ],
              "registrants_email_notification": false
            }
          },
        json: true //Parse the JSON string in the response
    };
    rp(options)
    .then(function (response) {
      //printing the response on the console
       // console.log('User has', response);
       resp = response       
        var title ='<center><h3>Datos de la reunión:</h3></center>' 
        //Prettify the JSON format using pre tag and JSON.stringify                
        var body = JSON.stringify(resp, null, 2);
        var myjson = JSON.parse(body);

        var meetingid        = myjson["id"];
        var start_url        = myjson["start_url"];
        //var join_url         = myjson["join_url"];
        //var topicmeeting     = myjson["topic"];
        var passwordmeeting  = myjson["password"];
        var linktoJoin       = "https://zoom.us/wc/join/" + meetingid + "?pwd=" + passwordmeeting;
        
        // var buttonIniciarReunion = '<a href="'+start_url+'">Inciar reunión</a>'
        // var buttonUnirseReunion  = '<a href="'+join_url+'">Unirse a la reunión</a>'
        // var buttonAbrirReunion   = '<a href="'+linktoJoin+'">Abrir a la reunión</a>'

        // var inicio = '<p>Comparte este link con tu paciente: </p>' + linktoJoin 
        //var result = title + '<code>' +inicio + '<br/>'+ buttonIniciarReunion  + '<br/>' + buttonUnirseReunion +'<br/>' +buttonAbrirReunion+'</code>'
        var result = "<meeting>" + "<start_url>" + start_url+"</start_url>"+ "<linktojoin>"+ linktoJoin +"</linktojoin>" + "</meeting>";
        res.send(result);                
        console.log(result);
        //console.log(myjson);      
      //  res.send(resp);      
    })
    .catch(function (err) {        
        console.log('API call failed, reason ', err);
    });
});

app.listen(app.get('port'), () => console.log(`Example app listening on port ${app.get('port')}!`)); 