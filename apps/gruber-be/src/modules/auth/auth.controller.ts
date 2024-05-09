import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "@dtos";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body(new ValidationPipe()) payload: RegisterDto) {
    return this.authService.registerUser(payload);
  }

  @Post("login")
  async login(@Body() payload: LoginDto) {
    return this.authService.verifyUser(payload);
  }

  @Post("verify-token")
  async verifyToken(@Body() payload: { token: string }) {
    return await this.authService.verifyFirebaseToken(payload.token);
  }
}
