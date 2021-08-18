const sendgridapikey =
  "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";
const sgMail = require("@sendgrid/mail");
const { getMaxListeners } = require("../models/task");
sgMail.setApiKey(process.env.api);

const welcomeMail = (email, name) => {
  sgMail.send({
    from: "bhutianimukul@gmail.com",
    to: email,
    subject: "Thanks for joining in",
    text: `Welcome to the Task manager app. ${name}`,
  });
};

const confirmDeletion = (email, name) => {
  sgMail.send({
    from: "bhutianimukul@gmail.com",
    to: email,
    subject: "Good Bye from Task Manager App",
    text: `Hey, ${name} is there anything we could have done to keep you onboard with us`,
    html: '<img src="https://media.giphy.com/media/UrcXN0zTfzTPi/giphy.gif" alt="this slowpoke moves"  width="250" />',
  });
};
module.exports = {
  welcomeMail,
  confirmDeletion,
};
