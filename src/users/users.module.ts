import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
