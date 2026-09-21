import { Resend } from "resend";

const resend = new Resend(
    process.env.RESEND_API_KEY
);

export async function POST(request) {
    try {
        const {
            name,
            email,
            subject,
            message,
        } = await request.json();

        if (
            !name?.trim() ||
            !email?.trim() ||
            !subject?.trim() ||
            !message?.trim()
        ) {
            return Response.json(
                {
                    error: "All fields are required.",
                },
                {
                    status: 400,
                }
            );
        }

        const { data, error } =
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: "yddodiya888@gmail.com",
                replyTo: email,
                subject: `Anime Explorer Contact: ${subject}`,

                html: `
          <h2>New Contact Message</h2>

          <p>
            <strong>Name:</strong> ${name}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Subject:</strong> ${subject}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <p>
            ${message}
          </p>
        `,
            });

        if (error) {
            console.error("RESEND ERROR:", error);

            return Response.json(
                {
                    error: "Failed to send email.",
                },
                {
                    status: 500,
                }
            );
        }

        return Response.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(
            "CONTACT API ERROR:",
            error
        );

        return Response.json(
            {
                error: "Something went wrong.",
            },
            {
                status: 500,
            }
        );
    }
}