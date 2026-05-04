import sendEmail from "./sendEmail.js";

const test = async () => {
    await sendEmail("jeevankumarsarkaghat@gmail.com", "123456");
};

test();