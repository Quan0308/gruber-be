import { Body, Controller, Delete, Param, Post, ValidationPipe } from "@nestjs/common";
import { CardInfoService } from "../card_info/card_info.service";
import { CreateCardInfoDto } from "@dtos";

@Controller("cards")
export class CardInfoController {
  constructor(private readonly cardInfoService: CardInfoService) {}

  @Post()
  async createCardInfo(@Body(new ValidationPipe()) payload: CreateCardInfoDto) {
    return await this.cardInfoService.createCardInfo(payload);
  }

  @Delete(":id")
  async deleteCardInfo(@Param("id") id: string) {
    return await this.cardInfoService.deleteCardInfo(id);
  }
}
