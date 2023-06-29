import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { AppService } from './app.service';
import { CoinParamDto } from './dto/coin-param.dto';

@Controller('balances/coins')
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':coin/received')
  async getReceivedAmount(@Req() request, @Param('coin') coin: string) {
    // const { coin } = params;
    // The request object contains the user information extracted from the JWT
    // Call the appropriate service function and return the result
    const wallet = request.user?.wallet;
    return await this.appService.getReceivedAmount(wallet, coin);
  }

  @Get(':coin/sent')
  async getSentAmount(@Req() request, @Param() params: CoinParamDto) {
    const { coin } = params;
    // The request object contains the user information extracted from the JWT
    // Call the appropriate service function and return the result
    const wallet = request.user?.wallet;
    return await this.appService.getSentAmount(wallet, coin);
  }
}
