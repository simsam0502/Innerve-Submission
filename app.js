const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const axios = require('axios');

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect('mongodb://localhost:27017/registrationsDB', { useNewUrlParser: true, useUnifiedTopology: true });

const Registrant = mongoose.model('Registrant', {
    name: String,
    email: String,
});

app.use(express.static(__dirname + '/public'));

app.route("/")
    .get((req, res) => res.sendFile(__dirname + "/form.html"))
    .post((req, res) => {
        console.log(req.body.email);
        axios.get('http://apilayer.net/api/check?access_key=4d2b63479282a2723e73bdcd4ba9487c&email=' + req.body.email + '&smtp=1&format=1')
            .then(function(response) {
                console.log(response.data);
                if (response.data.format_valid && response.data.mx_found && response.data.smtp_check && response.data.did_you_mean == '') {
                    const registrant = new Registrant(req.body);
                    registrant.save((err) => {
                        if (err) {
                            console.log(err);
                            res.sendFile(__dirname + "/failure.html");
                        } else {
                            console.log("Registrant saved!");
                            res.sendFile(__dirname + "/success.html");
                        }
                    })
                } else {
                    res.sendFile(__dirname + "/failure.html");
                }
            })
            .catch(function(error) {
                console.log(error);
                res.sendFile(__dirname + "/failure.html");
            })
            // .then(function() {
            //     // always executed
            // });
    });
const port = 3000

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})