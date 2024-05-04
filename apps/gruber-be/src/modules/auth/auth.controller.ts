import { Body, Controller, Get, NotFoundException, Post, Query, Redirect } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "@dtos";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("confirmation")
  @Redirect("http://localhost:3000/404", 301) // Redirect to password page -> if not verified -> return 404
  async confirmation(@Query("id") id: string, @Query("token") token: string) {
    const verified = await this.authService.verifyEmail(id, token);
    if (verified) {
      return { url: "http://localhost:3000/home" };
    }
  }

  @Post("register")
  async register(@Body() payload: RegisterDto) {
    return this.authService.registerUser(payload);
  }

  @Post("login")
  async login(@Body() payload: LoginDto) {
    return this.authService.verifyUser(payload);
  }
}
