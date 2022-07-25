import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    Response,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import fastifyCookie from 'fastify-cookie';
import { FastifyReply } from 'fastify';
import UserDTO from './auth.dto';
import User from './auth.interface';
import { AuthService } from './auth.service';
import { AllowUnauthorizedRequest } from './allowed-routes.strategy';

//@AllowUnauthorizedRequest()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('/register')
    register(@Res() reply, @Body() userDTO: UserDTO) {
        const user = this.authService.register(userDTO);
        try {
            return reply.code(200).send({
                message: "User has been created successfully",
                user
            })

        }
        catch(e) {
            reply.code(HttpStatus.BAD_REQUEST).send({
                
            });
            

        }

    }

    @Post('/login')
    async login(@Res({passthrough: true}) reply: FastifyReply, @Body() userInterface: User) {
            const user = await this.authService.login(userInterface);
            console.log(user)
            if(user != false)
            {
                reply.setCookie('access_token',user.access_token)

                console.log(user)

                return reply.code(200).send({
                    message: "Welcome back, access has been granted "
                });
            }

            return reply.code(403).send({
                message: "Email or password is wrong"
            });
    }

    @Get('/users')
    async users(@Res() reply, @Body() id: string) {
        const user = await this.authService.findUserByID(id)
        try {
            reply.setCookie('token', 
            user
            )
            return reply.code(200).send({
                message: "User has been created successfully",
                user
            })

        }
        catch(e) {
            reply.code(HttpStatus.BAD_REQUEST).send({
                
            });
            

        }
    }
}
