import { ExtractJwt, Strategy} from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { of } from 'rxjs';

export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor() {        
        super({
            
            jwtFromRequest: (req) => {
                if(!req || !req.cookies) return null;
                return req.cookies['access_token'];
            },
            ignoreExpiration: false,
            secretOrKey: 'SECRET123',
            

        });

    }
    async validate(payload: any) {
        console.log("username",payload)

        return { email: payload.email };
      }
}