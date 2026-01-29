const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const sendBoardInvite = async (to, boardTitle, inviterName, boardId) => {
  const inviteLink = `${process.env.FRONTEND_URL}/home/${boardId}`;
  await transporter.sendMail({
    from: `"MERN Notes App" <${process.env.SMTP_USER}>`,
    to,
    subject: `${inviterName} invited you to "${boardTitle}"`,
    text: `${inviterName} invited you to join the board "${boardTitle}".\n\n${inviteLink}`,
    html: `
      <p><strong>${inviterName}</strong> invited you to join the board <strong>${boardTitle}</strong>.</p>
      <a href="${inviteLink}">Accept Invite</a>
    `,
  });
};

module.exports = {
  sendBoardInvite,
};
