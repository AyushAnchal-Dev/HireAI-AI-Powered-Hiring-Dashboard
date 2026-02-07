import { resend } from "@/lib/resend";

export async function sendSelectionEmail(
    userEmail: string,
    role: string,
    matchScore?: number
) {
    if (!process.env.EMAIL_FROM) {
        console.warn("EMAIL_FROM environment variable not set. Skipping email sending.");
        return;
    }

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: userEmail,
            subject: "🎉 You’ve Been Shortlisted!",
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2563eb;">Congratulations 🎉</h2>
            
            <p>
            We’re excited to inform you that your resume has been
            <b>shortlisted</b> for the role of
            <b>${role}</b>.
            </p>

            ${matchScore
                    ? `<p><b>Match Score:</b> ${matchScore}%</p>`
                    : ""
                }

            <p>
            Our hiring team will review your profile and reach out to you
            with the next steps.
            </p>

            <p>
            Best of luck! 🚀 <br />
            <b>HireAI Recruitment Team</b>
            </p>
        </div>
        `,
        });
        console.log(`Selection email sent to ${userEmail}`);
    } catch (error) {
        console.error("Failed to send selection email:", error);
    }
}

export async function sendRejectionEmail(
    userEmail: string,
    role: string
) {
    if (!process.env.EMAIL_FROM) {
        console.warn("EMAIL_FROM environment variable not set. Skipping email sending.");
        return;
    }

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: userEmail,
            subject: "Update on Your Application",
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Application Update</h2>

            <p>
            Thank you for applying for the role of
            <b>${role}</b>.
            </p>

            <p>
            After careful review, we regret to inform you that we will not
            be moving forward with your application at this time.
            </p>

            <p>
            This decision does not reflect your abilities. We encourage you
            to apply for future opportunities that match your skills.
            </p>

            <p>
            We wish you all the best in your job search. 🌱 <br />
            <b>HireAI Recruitment Team</b>
            </p>
        </div>
        `,
        });
        console.log(`Rejection email sent to ${userEmail}`);
    } catch (error) {
        console.error("Failed to send rejection email:", error);
    }
}

export async function sendApplicationReceivedEmail(
    userEmail: string,
    role: string,
    companyName = "HireAI"
) {
    if (!process.env.EMAIL_FROM) return;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: userEmail,
            subject: `📩 Application Received – ${role}`,
            html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Application Received ✅</h2>

        <p>
          Thank you for applying for the position of
          <b>${role}</b> at <b>${companyName}</b>.
        </p>

        <p>
          We have successfully received your application and our
          recruitment team will review your profile shortly.
        </p>

        <p>
          If your profile matches our requirements, you will be contacted
          for the next steps.
        </p>

        <p>
          Best regards,<br />
          <b>${companyName} Recruitment Team</b>
        </p>

        <hr />
        <small style="color: #666;">
          This is an automated message. Please do not reply.
        </small>
      </div>
    `,
        });
        console.log(`Application confirmation sent to ${userEmail}`);
    } catch (err) {
        console.error("Failed to send application confirmation:", err);
    }
}

export async function sendAIFeedbackEmail({
    userEmail,
    role,
    score,
    strengths,
    weaknesses,
}: {
    userEmail: string;
    role: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
}) {
    if (!process.env.EMAIL_FROM) return;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: userEmail,
            subject: "🧠 Your Resume AI Analysis Report",
            html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#2563eb;">AI Resume Feedback</h2>

        <p>
          Our AI has analyzed your resume for the role of
          <b>${role}</b>.
        </p>

        <h3>📊 Match Score</h3>
        <p style="font-size: 18px;"><b>${score}%</b></p>

        <h3>✅ Strengths</h3>
        <ul>
          ${strengths.map((s) => `<li>${s}</li>`).join("")}
        </ul>

        <h3>⚠️ Improvements Needed</h3>
        <ul>
          ${weaknesses.map((w) => `<li>${w}</li>`).join("")}
        </ul>

        <p>
          Improving these areas can significantly increase your chances
          of getting shortlistednest.
        </p>

        <p>
          Best of luck! 🚀<br />
          <b>HireAI AI Assistant</b>
        </p>
      </div>
    `,
        });
        console.log(`AI Feedback sent to ${userEmail}`);
    } catch (err) {
        console.error("Failed to send AI feedback:", err);
    }
}
