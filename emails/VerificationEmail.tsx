import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Body,
} from "@react-email/components";

// Props for the VerificationEmail component 
interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}
// template for the verification email sent to the user
// This component is used to send a verification email to the user with the verification code. 
export default function VerificationEmail({
  username,
  verifyCode,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your Email Address</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily={["sans-serif"]}
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap",
            format: "woff2",
          }}
          fontStyle="normal"
          fontWeight="400"
        ></Font>
        <style>{`
                    body {
                        font-family: 'Roboto', sans-serif;
                        background-color: #f5f5f5;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 4px;
                        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .heading {
                        font-size: 24px;
                        font-weight: 500;
                        margin-bottom: 20px;
                    }
                    .text {
                        font-size: 16px;
                        margin-bottom: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #ffffff;
                        font-size: 16px;
                        text-decoration: none;
                        border-radius: 4px;
                    }
                `}</style>
      </Head>
      <Preview>Here&apos;s your verification code : {verifyCode}</Preview>
      <Body>
        <Section>
          <Row>
            <Heading className="heading">Verify Your Email Address</Heading>
          </Row>
          <Row>
            <Text className="text">
              Hi {username},
              <br />
              <br />
              Thanks for signing up! We just need to verify your email address
              to complete the process.
            </Text>
            <hr />
            <Text className="text">
              Please use the following code to verify your email address:{" "}
              <strong>{verifyCode}</strong>
              <br />
              <br />
              If you didn&apos;t request this code, you can safely ignore this
              email.
            </Text>
          </Row>
          <Row>
            <Button className="button" href="#">
              Verify Email Address
            </Button>
          </Row>
        </Section>
      </Body>
    </Html>
  );
}

//styles for this email template
// Path: emails/VerificationEmail.styles.ts
// Compare this snippet from src/lib/resend.ts:
// import { Resend } from "resend";
//
