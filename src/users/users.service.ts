import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { Injectable, Logger } from '@nestjs/common';

import { UserNotificationTimerExpiredEvent } from './events/user-notification-timer-expired.event';

@Injectable()
export class UsersService {
  private notificationUrl: string | null;

  private notificationText: string | null;

  constructor(private readonly httpService: HttpService, private readonly logger: Logger) {
    this.notificationUrl =
      process.env.USER_NOTIFICATION_URL ?? null;
    this.notificationText =
      process.env.USER_NOTIFICATION_TEXT ?? null;
  }
  
  async notifyUser(
    data: UserNotificationTimerExpiredEvent,
  ) {
    if (!this.notificationText || !this.notificationUrl) {
      this.logger.warn('Notification text or URL is not configured. Skipping user notification.');
      return;
    }

    try {
      const response: AxiosResponse = await lastValueFrom(this.httpService.post(this.notificationUrl, {
        ...data,
        text: this.notificationText,
      }));
      
      this.logger.log(`User notified successfully: ${response.status}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Failed to notify user: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Failed to notify user: ${error}`);
      }
      throw error;
    }
  }
}
