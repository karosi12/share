const postmark = require("postmark");
const Sender = process.env.EMAIL_SENDER;
const sendEmailWithTemplate = (to, tempAlais, data) => {
  const client = new postmark.ServerClient(process.env.POSTMARK_KEY);
  return client.sendEmailWithTemplate({
    From: Sender,
    To: to,
    TemplateAlias: tempAlais,
    TemplateModel: data,
  });
};

export default { sendEmailWithTemplate }