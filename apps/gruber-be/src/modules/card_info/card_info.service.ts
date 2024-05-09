import { CardInfo } from "@db/entities";
import { CreateCardInfoDto } from "@dtos";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";

@Injectable()
export class CardInfoService {
  constructor(
    @InjectRepository(CardInfo)
    private CardInfoRepository: Repository<CardInfo>,
    private readonly userService: UserService
  ) {}

  async createCardInfo(data: CreateCardInfoDto): Promise<CardInfo> {
    try {
      const { ownerId } = data;
      const card = await this.CardInfoRepository.findOne({ where: { ownerId } });
      if (card) {
        throw new BadRequestException("Card already exists");
      }
      const user = await this.userService.getUserById(ownerId);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      const cardInfo = this.CardInfoRepository.create(data);
      return await this.CardInfoRepository.save(cardInfo);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getCardInfoByOwnerId(ownerId: string): Promise<CardInfo> {
    try {
      const card = await this.CardInfoRepository.findOne({ where: { ownerId } });
      return card;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteCardInfo(id: string): Promise<boolean> {
    try {
      const card = await this.CardInfoRepository.findOne({ where: { id } });
      if (!card) {
        throw new NotFoundException("Card not found");
      }
      await this.CardInfoRepository.delete(card.id); // Pass the ID of the card instead of the card itself
      return true;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
