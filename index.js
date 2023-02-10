const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3002

const secretekey = "AVqcjGjFlQO4nZOyxGVAXCiojuOBcRnE7p9F322Aou1W0xtLgtZTYtV8QDj"

app.listen( port, function(){
    console.log("server is running on port http://localhost:" + port );
})

app.post("/api/login", function(req, res){
    const user = {
        id: 123,
        name: "sandip Baikare",
        email: "baikare.sandeep@gmail.com"
    }
    // conside we have validated user 

    jwt.sign( user, secretekey, { expiresIn: "300s" }, function( error, token ) {
        if( error ) {
            res.status(404).json({ status: false, message: error.message})
        }else{
            res.status(200).json({ status: true, message: "logged in successfull", token })
        }
    })
})

/**
 * Verfy token in header and add in the request object for next method call
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization']
    if( typeof tokenHeader === "undefined" ){
        res.status(400).json( {message: "Token is required to access this route."} )
    }else{
        const token = tokenHeader?.split(" ")
        if( token.length == 2 && typeof token[1] !== "undefined" ){
            req.token = token
            next();
        }else{
            res.status(400).json( {message: "Requred token"} )
        }
    }
}

/**
 * Profile route to validate jwt token and send response back
 */
app.post("/api/profile", verifyToken, function(req, res) {

    jwt.verify( req.token, secretekey, function(err, authData){
        if( err ) {
            res.status(404).json({ status: false, message: "Invalid token"})
        }else{
            res.status(200).json({ status: true, message: "Accesed profile", authData })
        }

    } )
    res.status(200).json({ status: true, message: "logged in successfull", token })
})


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).json({message: 'Invalid Route'});
});
