import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "@dtos";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

   @Post("register")
    async register(@Body() payload: RegisterDto) {
        return this.authService.registerUser(payload);
    }

    @Post("login")
    async login(@Body() payload: LoginDto) {
        return this.authService.verifyUser(payload);
    }
}
