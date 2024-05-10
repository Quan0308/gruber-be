import { Wallet } from "@db/entities";
import { Injectable } from "@nestjs/common";
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
}
