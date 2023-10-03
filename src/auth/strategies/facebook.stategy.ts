import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: 'your-facebook-app-id',
            clientSecret: 'your-facebook-app-secret',
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
            profileFields: ['id', 'email', 'name'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        try {
            // Check if the user already exists in your database based on their Facebook profile information
            const user = await this.userService.findByFacebookId(profile.id);

            if (!user) {
                // If the user doesn't exist, create a new user based on the Facebook profile data
                const newUser = await this.userService.createUserFromFacebookProfile(profile);
                done(null, newUser);
            } else {
                // If the user exists, simply return the user
                done(null, user);
            }
        } catch (error) {
            // Handle any errors that occur during the validation process
            done(error, false);
        }
    }
}