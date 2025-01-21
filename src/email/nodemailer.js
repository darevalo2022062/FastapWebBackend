import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASS,
    },
});

export const sendConfirmAccount = async (toEmail, username, resetUrl) => {

    let logo = fs.readFileSync('../NodeJS_FasTapWebApp/src/images/logo-fastap.png');
    const mail = {
        from: `"FasTap 🛍️" <${process.env.MAIL_ACCOUNT}>`, // sender address
        to: toEmail, // list of receivers separated with ","
        subject: "Confirma tu cuenta | FasTap ", // Subject line
        text: `Hola ${username},\n\nGracias por crear una cuenta en FasTap. Por favor, confirma tu dirección de correo electrónico haciendo clic en el enlace siguiente:\n\n${resetUrl}\n\nSi no solicitaste esta cuenta, puedes ignorar este correo.\n\nGracias,\nEl equipo de FasTap 🛍️`, // plain text body
        html: `<!DOCTYPE html>
                <html lang="es">
                <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Confirma tu cuenta</title>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;600;900&display=swap">
                    <style>
                        body {
                            font-family: 'Poppins', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                        }
                        h2 {
                            font-family: 'Poppins', sans-serif;
                            font-weight: 600;
                            color: #48AAE7; /* Color del título */
                            text-align: center;
                        }
                        p {
                            font-family: 'Poppins', sans-serif;
                            font-weight: 600;
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .logo img {
                            max-width: 100px;
                        }
                        .disclaimer {
                            font-size: 12px;
                            color: #999;
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">
                            <img src="cid:logoFastap" alt="FasTap Logo">
                        </div>
                        <h2>Confirma tu cuenta</h2>
                        <p style="font-size:20px; ">Hola ${username},</p>
                        <p>Gracias por crear una cuenta en FasTap. Por favor, confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:</p>
                        <p style="text-align: center;">
                            <a 
                                href="${resetUrl}" 
                                style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #FFF; background-color: #48AAE7; text-decoration: none; border-radius: 5px; font-family: 'Poppins', sans-serif;"
                                >
                                Confirmar Cuenta
                            </a>
                        </p>
                        <p>Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
                        <p>Gracias,<br>El equipo de FasTap 🛍️</p>
                        <p class="disclaimer">
                            Este es un mensaje automático. Por favor, no respondas a este correo electrónico. Si tienes preguntas o necesitas ayuda, contacta a nuestro soporte en <a href="mailto:support@fastap.com">support@fastap.com</a>.
                        </p>
                    </div>
                </body>
                </html>`,
        attachments: [
            {
                filename: 'logo-fastap.png',
                content: logo,
                cid: 'logoFastap'
            }
        ]
    }
    await sendEmail(mail);
}

export const sendRecovery = async (toEmail, username, resetUrl) => {

    let logo = fs.readFileSync('../NodeJS_FasTapWebApp/src/images/logo-fastap.png');
    const mail = {
        from: `"FasTap 🛍️" <${process.env.MAIL_ACCOUNT}>`, // sender address
        to: toEmail, // list of receivers separated with ","
        subject: "Recuperación de contraseña 🗝️ | FasTap ", // Subject line
        text: `Hola ${username},\n\nHemos recibido una solicitud para restablecer tu contraseña. Usa el siguiente enlace para restablecer tu contraseña:\n\n${resetUrl}\n\nSi no solicitaste un restablecimiento de contraseña, por favor ignora este correo. Tu contraseña permanecerá segura.\n\nGracias,\nEl equipo de FasTap 🛍️`, // plain text body
        html: `<!DOCTYPE html>
                <html lang="es">
                <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Recuperación de contraseña</title>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;600;900&display=swap">
                    <style>
                        body {
                            font-family: 'Poppins', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                        }
                        h2 {
                            font-family: 'Poppins', sans-serif;
                            font-weight: 600;
                            color: #48AAE7; /* Color del título */
                            text-align: center;
                        }
                        p {
                            font-family: 'Poppins', sans-serif;
                            font-weight: 600;
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .logo img {
                            max-width: 100px;
                        }
                        .disclaimer {
                            font-size: 12px;
                            color: #999;
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">
                            <img src="cid:logoFastap" alt="FasTap Logo">
                        </div>
                        <h2>Recuperación de contraseña</h2>
                        <p style="font-size:20px; ">Hola ${username},</p>
                        <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para restablecer tu contraseña:</p>
                        <p style="text-align: center;">
                            <a 
                                href="${resetUrl}" 
                                style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #FFF; background-color: #48AAE7; text-decoration: none; border-radius: 5px; font-family: 'Poppins', sans-serif;"
                                >
                                Restablecer Contraseña
                            </a>
                        </p>
                        <p>Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo. Tu contraseña permanecerá segura.</p>
                        <p>Gracias,<br>El equipo de FasTap 🛍️</p>
                        <p class="disclaimer">
                            Este es un mensaje automático. Por favor, no respondas a este correo electrónico. Si tienes preguntas o necesitas ayuda, contacta a nuestro soporte en <a href="mailto:support@fastap.com">support@fastap.com</a>.
                        </p>
                    </div>
                </body>
                </html>`,
        attachments: [
            {
                filename: 'logo-fastap.png',
                content: logo,
                cid: 'logoFastap'
            }
        ]
    }
    await sendEmail(mail);
}

//enviar correos de recuperacion de contraseña
export const sendEmail = async (infoEmail) => {
    // send mail with defined transport object
    const info = await transporter.sendMail(infoEmail);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
