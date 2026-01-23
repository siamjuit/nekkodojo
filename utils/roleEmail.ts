import nodemailer from "nodemailer";

export async function sendSudoPasswordEmail(email: string, role: string, password: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"NekkoDojo Admin" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `[ACTION REQUIRED] Your New ${role} Access`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d4af37;">NekoDojo Security</h2>
          <p>Hello,</p>
          <p>You have been granted <strong>${role}</strong> access.</p>
          <p>Your Sudo Password is:</p>
          <div style="background: #eee; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 18px; letter-spacing: 2px;">
            ${password}
          </div>
          <p>Please keep this credential secure.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Email failed:", error);
    return { success: false, error };
  }
}
