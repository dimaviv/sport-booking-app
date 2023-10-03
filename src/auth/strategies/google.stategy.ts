import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: 'your-google-client-id',
      clientSecret: 'your-google-client-secret',
      callbackURL: 'http://localhost:3000/auth/google/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      // Check if the user already exists in your database based on their profile information
      const user = await this.userService.findByGoogleId(profile.id);

      if (!user) {
        // If the user doesn't exist, create a new user based on the profile data
        const newUser = await this.userService.createUserFromGoogleProfile(profile);
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
