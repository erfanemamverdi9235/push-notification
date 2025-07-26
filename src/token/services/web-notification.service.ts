import { Injectable } from '@nestjs/common';
import * as webPush from 'web-push';
import { DeviceTokenRepository } from '../repositories/device-token.repository';
import { PlatformEnum } from '../enums/platform.enum';

@Injectable()
export class WebNotificationService {
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

    async sendWebNotification(userId: string, title: string, message: string) {
        const tokens = await this.deviceTokenRepository.find({
            where: { user_id: userId, platform: PlatformEnum.Web },
        });

        for (const token of tokens) {
            await webPush.sendNotification(
                JSON.parse(token.device_token),
                JSON.stringify({ title, message })
            );
        }
    }
}