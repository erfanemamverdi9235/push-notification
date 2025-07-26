import { Injectable } from '@nestjs/common';
import * as apn from 'apn';
import { DeviceTokenRepository } from '../repositories/device-token.repository';
import { PlatformEnum } from '../enums/platform.enum';

@Injectable()
export class IosNotificationService {
    private apnProvider: apn.Provider;

    constructor(
        private deviceTokenRepository: DeviceTokenRepository

    ) {
        // this.apnProvider = new apn.Provider({
        //     token: {
        //         key: 'path/to/your/APNsAuthKey.p8',
        //         keyId: 'your_key_id',
        //         teamId: 'your_team_id',
        //     },
        //     production: false, // برای تست false، برای تولید true
        // });
    }

    async sendIOSNotification(userId: string, title: string, message: string) {
        const tokens = await this.deviceTokenRepository.find({
            where: { user_id: userId, platform: PlatformEnum.Ios },
        });

        for (const token of tokens) {
            const notification = new apn.Notification({
                alert: { title, body: message },
                topic: 'your.bundle.id',
            });
            await this.apnProvider.send(notification, token.device_token);
        }
    }
}