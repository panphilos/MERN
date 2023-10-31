import jwt from 'jsonwebtoken';
// npm i jsonwebtoken per a instal·lar JSON Web token
// Afegim una altra variable d'entorn a .env 

//Json web token servirà per crear les sessions dels nostres usuaris. Així, podrem controlar a quines pàgines poden entrar i a quines no. Entre altres coses (https://jwt.io/introduction#:~:text=Tokens%20are%20useful%3A-,Authorization,-%3A%20This%20is%20the)
//No ficar mai informació critica en el json web token!
const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{ //En el claudator, afegim la informació que volem ficar en el codi del json web token. 
        expiresIn: "30d",
    });

}

export default generarJWT;  

