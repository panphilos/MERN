import nodemailer from "nodemailer";

//Creem compte a "Mailtrap";
//Instale Nodemailer (el paquet de gestió de correu de Node): npm i nodemailer

//Copiem el codi que ens proporciona "Mailtrap";
//Hem de passar totes les variables a variables d'entorn de manera que no estiguin publiques als usuaris
const emailRegistro = async ( datos ) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    const {email, nombre, token } = datos;

    //Enviar email

      //En el link, no hi fiquem la url de la api, hi hem de ficar la URL del frontend.
    const info = await transporter.sendMail({
        from: "APV - Administrador de pacientes de veterinario",
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `<p>Hola ${nombre}, comprueba tu cuenta en APV. </p>
                <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}"> Comprobar cuenta </a>

                <p> Si tu no create esta cuenta, puedes ingnorar este mensaje</p>
                `,
      });
      
    console.log("Mensaje enviado: %s", info.messageId); //info te la propietat de ".messgeId"
}

//Enviar el email

export default emailRegistro;