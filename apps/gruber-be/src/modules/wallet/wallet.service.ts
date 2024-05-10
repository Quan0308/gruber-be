import { Wallet } from "@db/entities";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WalletType } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>
  ) {}
  async createWallet(type: WalletType) {
    const wallet = this.walletRepository.create({ type });
    return await this.walletRepository.save(wallet);
  }

  async withdraw(walletId: string, amount: number) {
    try {
      const wallet = await this.walletRepository.findOne({where: {id: walletId}});
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
      wallet.amount -= amount;
      return await this.walletRepository.save(wallet);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async deposit(walletId: string, amount: number) {
    try {
      const wallet = await this.walletRepository.findOne({where: {id: walletId}});
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
      wallet.amount = +wallet.amount + +amount;
      return await this.walletRepository.save(wallet);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
