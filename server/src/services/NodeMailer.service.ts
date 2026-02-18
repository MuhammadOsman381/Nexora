import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendModelReadyEmail = async (
    email: string,
    chatName: string,
    chatId: string
) => {
    try {
        await transporter.sendMail({
            from: `Muhammad Osman from Nexora AI`,
            to: email,
            subject: "Your AI Model is Ready!",
            html: `
  <div style="margin:0;padding:0;background-color:#f9fafb;padding:40px 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
      <tr>
        <td style="background-color:#f97316;padding:30px;text-align:center;color:#ffffff;">
          <h1 style="margin:0;font-size:24px;">Your Model is Ready</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:30px;color:#333333;">
          <p style="font-size:16px;margin:0 0 15px 0;">
            Great news!
          </p>
          <p style="font-size:15px;margin:0 0 15px 0;line-height:1.6;">
            Your AI model for chat 
            <strong style="color:#f97316;">${chatName}</strong> 
            has been successfully trained after completing data scraping and processing.
          </p>
          <p style="font-size:15px;margin:0 0 25px 0;line-height:1.6;">
            You can now start using your model.
          </p>
          <div style="text-align:center;margin:30px 0;">
            <a href="https://nexora-seven-rosy.vercel.app/user/chat/${chatId}" 
               style="background-color:#f97316;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block;">
               Open Your Chat
            </a>
          </div>
          <p style="font-size:13px;color:#777777;margin-top:30px;">
            If the button doesn’t work, copy and paste this link into your browser:
            <br/>
            <a href="https://localhost:5173/user/chat/${chatId}" style="color:#f97316;">
              https://nexora-seven-rosy.vercel.app/user/user/chat/${chatId}
            </a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#999999;">
          © ${new Date().getFullYear()} Nexora. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
`,
        });
        console.log("Model ready email sent to:", email);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};