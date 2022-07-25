import {ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import User from './auth.interface';
import UserDTO from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
      private jwtService: JwtService,
        @InjectModel('User') private readonly UserModel: Model<User>
    ) {}

     async register(userDTO: UserDTO) {
        console.log(userDTO)
        const user = new this.UserModel(userDTO);
        user.email = user.email.toLowerCase();
        user.password = await bcrypt.hash(user.password, 10)
        console.log(user.password)
        return user.save().catch((e) => {
            {
              throw new ConflictException(
                e
              );
              }
            })
          
        }

        async login(userInterface: User) {
          const payload = {
            email: userInterface.email
          }
          const isValid = await this.validateUser(userInterface.email, userInterface.password);
          console.log(isValid)
          if(isValid)
          {
            return {
              access_token: this.jwtService.sign(payload)
            }
          }
          return isValid;
          
        }

        async doesUserExist(email: string) {
          const isUser = await this.UserModel.findOne({email: email})
          if(isUser)
          {
            return isUser.password
          }
          else
        {
          return false
        }
        }

        async validateUser(email: string, password: string) {

          const usersPass = await this.doesUserExist(email);
          if(usersPass)
          {
          return await bcrypt.compare(password, usersPass)
          }
          else
          {
          return false
          }
        }

        async getUsers() : Promise<User[]> {
          const users = await this.UserModel.find().exec();
          return users;
        }

        async findUserByID(id: string) {
          const user = await this.UserModel.findOne({email:"elelerrlee@gmail.com"});
          console.log(await this.UserModel.find().exec())
          return user;
        }

      }

