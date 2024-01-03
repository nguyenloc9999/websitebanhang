import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import passport from 'passport';
import Auth from "../models/auth.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: "563215821470-u1ptu5gn9ndnpbcqgauvk3h860pensfa.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: process.env.GOOGLE_REDIRECT,
    passReqToCallback: true
},
    async (request, accessToken, refreshToken, profile, done) => {
        const isExitUser = await Auth.findOne({
            googleId: profile.id,
            authType: "google"
        })
        if (isExitUser) {
            const token = jwt.sign({ id: isExitUser._id }, "DATN", { expiresIn: "2h" });
            return done(null, { user: isExitUser, accessToken: token });
        } else {
            try {
                // Thử chèn một tài khoản mới
                const newUser = new Auth({
                    authType: 'google',
                    googleId: profile.id,
                    first_name: profile.name.familyName,
                    last_name: profile.name.givenName,
                    email: profile.emails[0].value,
                    avatar: {
                        url: profile.picture,
                        publicId: null
                    },
                    password: "Không có mật khẩu",
                });
                await newUser.save();
                const token = jwt.sign({ id: newUser._id }, "DATN", { expiresIn: "2h" });
                done(null, { user: newUser, accessToken: token });
            } catch (error) {
                // Xử lý lỗi chèn (trường hợp trùng lặp)
                if (error.code === 11000) {
                    return done(null, false, { message: "Tài khoản đã tồn tại" });
                } else {
                    // Xử lý các lỗi khác
                    return done(error);
                }
            }
        }
    }
));

passport.serializeUser(({ user, accessToken }, done) => {
    done(null, { user, accessToken })
});
passport.deserializeUser(({ user, accessToken }, done) => {
    done(null, { user, accessToken })
});

export const LoginWithGoogle = (req, res) => {
    const { accessToken } = req.user;
    res.redirect(`${process.env.GOOGLE_SUCCESS}?token=${accessToken}`);
}

export const LogoutGoogle = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.redirect(process.env.CLIENT_URL);
        }
        res.redirect(process.env.CLIENT_URL);
    });
}
/// 
passport.use(new FacebookStrategy({
    clientID: "347641427607083",
    clientSecret: "09b41757bd4e273afc6dec54b34a433c",
    callbackURL: "http://localhost:8088/api/auth/facebook/callback",
    profileFields: ['id', 'name', 'profileUrl', 'photos', 'email']
},
    async (accessToken, refreshToken, profile, cb) => {
        const isExitUser = await Auth.findOne({
            facebookId: profile.id,
            authType: "facebook"
        })
        if (isExitUser) {
            const token = jwt.sign({ id: isExitUser._id }, "DATN", { expiresIn: "2h" });
            return cb(null, { user: isExitUser, accessToken: token });
        } else {
            try {
                const newUser = new Auth({
                    authType: 'facebook',
                    facebookId: profile.id,
                    first_name: profile.name.familyName,
                    last_name: profile.name.givenName,
                    email: profile.emails[0].value,
                    avatar: {
                        url: profile.photos[0].value,
                        publicId: null
                    },
                    password: "Không có mật khẩu",
                })
                await newUser.save();
                const token = jwt.sign({ id: newUser._id }, "DATN", { expiresIn: "2h" });
                cb(null, { user: newUser, accessToken: token });
            } catch (error) {
                // Xử lý lỗi chèn (trường hợp trùng lặp)
                if (error.code === 11000) {
                    return cb(null, false, { message: "Tài khoản đã tồn tại" });
                } else {
                    // Xử lý các lỗi khác
                    return cb(error);
                }
            }
        }

    }
));
export const LoginWithFacebook = (req, res) => {
    const { accessToken } = req.user;
    res.redirect(`http://localhost:5173?token=${accessToken}`);
}