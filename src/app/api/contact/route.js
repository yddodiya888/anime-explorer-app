import { Resend } from "resend";

const resend = new Resend(
    process.env.RESEND_API_KEY
);

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

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

        const safeName = escapeHtml(name.trim());
        const safeEmail = escapeHtml(email.trim());
        const safeSubject = escapeHtml(subject.trim());
        const safeMessage = escapeHtml(message.trim());

        const { data, error } =
            await resend.emails.send({
                from: "onboarding@resend.dev",

                to: "yddodiya888@gmail.com",

                replyTo: email.trim(),

                subject: `Anime Explorer Contact: ${subject.trim()}`,

                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <title>Anime Explorer Contact</title>
</head>

<body
    style="
        margin: 0;
        padding: 0;
        background-color: #f5f5f7;
        font-family: Arial, Helvetica, sans-serif;
        color: #222;
    "
>

    <div
        style="
            width: 100%;
            padding: 40px 15px;
            box-sizing: border-box;
        "
    >

        <div
            style="
                max-width: 650px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            "
        >

            <!-- HEADER -->

            <div
                style="
                    padding: 25px 30px;
                    background: #7567ff;
                    color: #ffffff;
                "
            >

                <h1
                    style="
                        margin: 0;
                        font-size: 24px;
                        font-weight: 700;
                    "
                >
                    Anime Explorer
                </h1>

                <p
                    style="
                        margin: 7px 0 0;
                        font-size: 14px;
                        opacity: 0.9;
                    "
                >
                    New Contact Message
                </p>

            </div>


            <!-- CONTENT -->

            <div
                style="
                    padding: 30px;
                "
            >

                <h2
                    style="
                        margin: 0 0 25px;
                        font-size: 20px;
                        color: #222;
                    "
                >
                    Contact Details
                </h2>


                <!-- NAME -->

                <div
                    style="
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #eeeeee;
                    "
                >

                    <p
                        style="
                            margin: 0 0 5px;
                            font-size: 12px;
                            font-weight: 600;
                            color: #888;
                            text-transform: uppercase;
                        "
                    >
                        Name
                    </p>

                    <p
                        style="
                            margin: 0;
                            font-size: 15px;
                            color: #222;
                        "
                    >
                        ${safeName}
                    </p>

                </div>


                <!-- EMAIL -->

                <div
                    style="
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #eeeeee;
                    "
                >

                    <p
                        style="
                            margin: 0 0 5px;
                            font-size: 12px;
                            font-weight: 600;
                            color: #888;
                            text-transform: uppercase;
                        "
                    >
                        Email
                    </p>

                    <p
                        style="
                            margin: 0;
                            font-size: 15px;
                            color: #222;
                        "
                    >
                        ${safeEmail}
                    </p>

                </div>


                <!-- SUBJECT -->

                <div
                    style="
                        margin-bottom: 25px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #eeeeee;
                    "
                >

                    <p
                        style="
                            margin: 0 0 5px;
                            font-size: 12px;
                            font-weight: 600;
                            color: #888;
                            text-transform: uppercase;
                        "
                    >
                        Subject
                    </p>

                    <p
                        style="
                            margin: 0;
                            font-size: 15px;
                            font-weight: 600;
                            color: #222;
                        "
                    >
                        ${safeSubject}
                    </p>

                </div>


                <!-- MESSAGE -->

                <div>

                    <p
                        style="
                            margin: 0 0 10px;
                            font-size: 12px;
                            font-weight: 600;
                            color: #888;
                            text-transform: uppercase;
                        "
                    >
                        Message
                    </p>

                    <div
                        style="
                            padding: 18px;
                            background: #f7f7fb;
                            border-radius: 8px;
                            font-size: 15px;
                            line-height: 1.7;
                            color: #333;
                            white-space: pre-wrap;
                            word-break: break-word;
                        "
                    >
                        ${safeMessage}
                    </div>

                </div>

            </div>


            <!-- FOOTER -->

            <div
                style="
                    padding: 18px 30px;
                    background: #fafafa;
                    border-top: 1px solid #eeeeee;
                    text-align: center;
                "
            >

                <p
                    style="
                        margin: 0;
                        font-size: 12px;
                        color: #999;
                    "
                >
                    This message was sent from the Anime Explorer
                    contact form.
                </p>

            </div>

        </div>

    </div>

</body>
</html>
                `,
            });

        if (error) {
            console.error(
                "RESEND ERROR:",
                error
            );

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