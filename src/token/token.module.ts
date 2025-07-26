import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from './entities/device-token.entity';
import { DeviceTokenRepository } from './repositories/device-token.repository';
import { PushNotificationController } from './controllers/push-notification.controller';
import { NotificationService } from './services/notification.service';
import { IosNotificationService } from './services/ios-notification.service';
import { WebNotificationService } from './services/web-notification.service';
import { NotificationGateway } from './services/notification.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([DeviceToken]),
    ],
    controllers: [
        PushNotificationController,
    ],
    providers: [
        DeviceTokenRepository,

        NotificationService,
        IosNotificationService,
        WebNotificationService,
        NotificationGateway,
    ],
})
export class TokenModule { }
