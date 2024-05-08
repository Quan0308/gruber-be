import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../modules/auth/auth.service";
@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<unknown> {
    const authHeader = String(request.headers["authorization"] || "");

    if (!authHeader.startsWith("Bearer ")) {
      return false;
    }

    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7, authHeader.length); // Remove "Bearer " from the token
      return this.authService.verifyFirebaseToken(token);
    }
  }
}
