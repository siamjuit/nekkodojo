import { resend } from "@/lib/resend";

export async function sendSudoPasswordEmail(email: string, role: string, password: string) {
  if (!email) return;

  try {
    const { data, error } = await resend.emails.send({
      from: "Nekkodojo <onboarding@resend.dev>",
      to: [email],
      subject: `[ACTION REQUIRED] Your New ${role} Access`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #d4af37;">Welcome to the Dojo Council</h2>
          <p>You have been promoted to <strong>${role}</strong>.</p>
          <p>To access the administrative dashboard, you will need this specific Sudo Password:</p>
          
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0;">
            <code style="font-size: 18px; font-weight: bold; letter-spacing: 1px;">${password}</code>
          </div>

          <p><strong>Keep this safe.</strong> This password is required for sensitive actions and cannot be recovered if lost (you will need to ask an Admin to reset it).</p>
          <hr />
          <p style="font-size: 12px; color: #666;">If you did not request this, please contact support immediately.</p>
        </div>
      `,
    });
    if (error) {
      console.error("❌ Resend API Error:", error);
      return;
    }
    console.log(`📧 Sudo password sent to ${email}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    // Don't throw error here to avoid breaking the UI flow, just log it.
  }
}
