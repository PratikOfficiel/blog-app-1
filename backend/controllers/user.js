const { USER, bcrypt, validate } = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('../utils/confimation.js');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const creatTransporter = async () => {
    const oauth2Client = new OAuth2(
        "{{OAUTH_CLIENT_ID}}",
        "{{OAUTH_CLIENT_SECRET}}",
        "https://developers.google.com/oauthplayground"
    )

    oauth2Client.setCredentials({
        refresh_token: "{{OAUTH_REFRESH_TOKEN}}"
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject("Failed to create access token: ", err);
            }
            resolve(token);
        });
    }
    );

    const Transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "{{GMAIL_EMAIL}}",
            accessToken,
            clientId: "{{OAUTH_CLIENT_ID}}",
            clientSecret: "{{OAUTH_CLIENT_SECRET}}",
            refreshToken: "{{OAUTH_REFRESH_TOKEN}}",
        },
    })

    return Transport;
}

const sendEmail = async ({email, username, res}) => {

    const confirmationToken = encrypt(username);
    const apiUrl = process.env.API_URL || "http://localhost:4000";

    const transport = await creatTransporter();

    const mailOptions = {
        from: "Node test application",
        to: email,
        subject: "Email confirmation",
        html:`Press the following link to verify your email: <a href=${apiUrl}/confirmation/${confirmationToken}>Verification Link</a>`,
    }

    transport.sendMail(mailOptions, (err, info) => {

        if (err) {
            console.log(err);
            res.status(500).send("Failed to send email");
        } else {
            console.log(info);
            res.status(200).json({
                message: "Please confirm your email"
            });
        }
    });
}

exports.verifyEmail = async(req, res) => {
    try {
        const {confirmationToken} = req.params;
        const username = decrypt(confirmationToken);

        const user = USER.findOne({username: username});

        if (user){

            user.isConfirmed = true;
            await user.save();

            res.status(200).json({message: "user verification successful", data: user});
        }
        else{
            res.status(409).send("user not found");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

exports.signup = async (req, res) => {

    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const { firstName, lastName, username, email, password } = req.body;

        const oldUser = await USER.findOne({ email });
        if (oldUser) return res.status(400).send("User already exists");

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await USER.create({
            firstName,
            lastName,
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        })

        // generate jwt token

        const token = jwt.sign({ userId: user._id, email }, process.env.TOKEN_SECRET, { expiresIn: "2h" });

        user.token = token;

        res.status(201).send(user);
    } catch (error) {
        console.log(error);
    }
}