import { Matches, Equals, IsArray, IsEmail, isEmail, isNotEmpty, IsNotEmpty, isNumber, IsNumber, IsString, MinLength } from "class-validator";

 class UserDTO {

    @IsEmail()
      email: string;

     @IsString()
     @IsNotEmpty()
     @MinLength(8)
     @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[@$!%*#?&]).*$/,
      {message: 'password too weak, has to contain one capital letter, one digit, one non-alphanumeric char(@$!*#?&'})

     readonly password: string;

     readonly id: Number;

}

export default UserDTO;