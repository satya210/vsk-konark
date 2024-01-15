import { passportAuth } from "@blitzjs/auth"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { api } from "src/app/blitz-server"
import db from "db"

export default api(
  passportAuth({
    successRedirectUrl: "/",
    errorRedirectUrl: "/",
    strategies: [
      {
        strategy: new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL:
              process.env.NODE_ENV === "production"
                ? `https://${process.env.APP_ORIGIN}/api/auth/twitter/callback`
                : "http://localhost:3000/api/auth/twitter/callback",
          },
          async function (accessToken, refreshToken, profile, done) {
            const email = profile.emails && profile.emails[0]?.value

            if (!email) {
              return done(new Error("Google OAuth response doesn't have email."))
            }

            const user = await db.user.upsert({
              where: { email },
              create: {
                email,
                name: profile.displayName,
              },
              update: { email },
            })

            const publicData = {
              userId: user.id,
              roles: [user.role],
              source: "google",
            }

            const privateData = {
              accessToken,
              refreshToken,
            }

            done(undefined, { publicData, privateData })
          }
        ),
      },
    ],
  })
)
