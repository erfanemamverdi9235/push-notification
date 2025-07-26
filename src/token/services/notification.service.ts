import { Injectable } from '@nestjs/common';
import * as webPush from 'web-push';
import { DeviceTokenRepository } from '../repositories/device-token.repository';
import { PlatformEnum } from '../enums/platform.enum';

@Injectable()
export class NotificationService {
    constructor(
        private deviceTokenRepository: DeviceTokenRepository
    ) {
        webPush.setVapidDetails(
            'mailto:your-email@example.com',
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );
    }

    async saveDeviceToken(userId: string, deviceToken: string, platform: PlatformEnum) {
        await this.deviceTokenRepository.upsert(
            { user_id: userId, device_token: deviceToken, platform },
            ['user_id', 'platform']
        );
    }
}