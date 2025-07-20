import nodemailer from "nodemailer";
import {ApiError} from "./apiError.js";


export const EmailSend = async (EmailTo, EmailSubject, EmailText,  EmailHTMLBody) => {

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    const MailOptions = {
        from: "Celal",
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText,
        html: EmailHTMLBody
    }

    // SEND EMAIL
    try{
        await transporter.sendMail(MailOptions);
        return true;
    }catch(error){
        console.log(error)
        throw new ApiError(500, "Error sending email");
        return false;
    }
};