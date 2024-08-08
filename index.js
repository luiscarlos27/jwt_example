const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/login' , (req, res) =>{
    res.send(`<html>
             <head>
                <title>Login</title>
             </head>
             <body>
                <form method="POST" action="/auth">
                    Nombre de usuario:<input type="text" name="text"><br/>
                    Contraseña: <input type="password" name="password"><br/>
                    <input type="submit" value="Iniciar Sessión" />    
                </form>
             </body>
             </html>`
            );
}) 

app.post('/auth', (req, res) =>{
    const { username, password} = req.body;

    //consultar a la base de datos 
    // usuario y contrasenia
    const user = { username : username};

    const accessToken = generateAccessToken(user);

    res.header('authorization', accessToken).json({
        message: 'Usuario Autenticado',
        token : accessToken
    });
});

function generateAccessToken(user){
    return jwt.sign(user,process.env.SECRET, {expiresIn:'5m'});
}

function validateToken(req, res, next){
    const accessToken = req.headers['authorization'] || req.query.accesstoken;
    if(!accessToken) res.send('Access Denied!');

    jwt.verify(accessToken, process.env.SECRET, (err, user)=>{
        if(err){
            res.send('Access denied, token expired or incorrect');
        }else{
            req.user = user;
            next();
        }
    })
}

app.get('/api',validateToken ,(req, res) =>{
    res.json({
        username: req.user,
        datos:"datos",
        ejemplo: []
    });    
})

app.listen(3000, ()=>{
    console.log('servidor iniciando...')
})