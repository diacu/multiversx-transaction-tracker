// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [],
  providers: [AuthGuard, JwtService],
  exports: [AuthGuard, JwtService],
})
export class AuthModule {}
