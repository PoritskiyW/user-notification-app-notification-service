import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { UsersService } from './users.service';
import { UserNotificationTimerExpiredEvent } from './events/user-notification-timer-expired.event';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger
  ) {}

  @EventPattern('user_notification_timer_expired')
  async handleNotificationTimerExpired(
    data: UserNotificationTimerExpiredEvent,
  ) {
    try {
      this.logger.log('Handling "user_notification_timer_expired" event', data);
      await this.usersService.notifyUser(data);
      this.logger.log('User notification handled successfully.');
    } catch (error) {
      this.logger.error(`Error handling "user_notification_timer_expired" event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
