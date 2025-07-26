import { Controller, Post, Body, Param, Sse } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebNotificationService } from '../services/web-notification.service';
import { IosNotificationService } from '../services/ios-notification.service';
import { NotificationGateway } from '../services/notification.gateway';
import { NotificationService } from '../services/notification.service';
import { RegisterTokenDto } from '../dto/register-token.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { Observable } from 'rxjs';

@ApiTags('Push Notifications')
@Controller('push-notifications')
export class PushNotificationController {
    private clients = new Map<string, any>();

    constructor(
        private readonly notificationService: NotificationService,
        private readonly webNotificationService: WebNotificationService,
        private readonly iosNotificationService: IosNotificationService,
        private readonly notificationGateway: NotificationGateway,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a device token for push notifications' })
    @ApiResponse({ status: 201, description: 'Token registered successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    async registerToken(@Body() registerTokenDto: RegisterTokenDto) {
        await this.notificationService.saveDeviceToken(
            registerTokenDto.user_id,
            registerTokenDto.device_token,
            registerTokenDto.platform,
        );
        return { message: 'Token registered successfully' };
    }

    @Post('send/:userId')
    @ApiOperation({ summary: 'Send a push notification to a user' })
    @ApiResponse({ status: 200, description: 'Notification sent successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    async sendNotification(
        @Param('userId') userId: string,
        @Body() sendNotificationDto: SendNotificationDto,
    ) {
        if (sendNotificationDto.platform === 'web') {
            await this.webNotificationService.sendWebNotification(
                userId,
                sendNotificationDto.title,
                sendNotificationDto.message,
            );
        } else if (sendNotificationDto.platform === 'ios') {
            await this.iosNotificationService.sendIOSNotification(
                userId,
                sendNotificationDto.title,
                sendNotificationDto.message,
            );
        } else if (sendNotificationDto.platform === 'android') {
            await this.notificationGateway.sendAndroidNotification(
                userId,
                sendNotificationDto.title,
                sendNotificationDto.message,
            );
        }
        return { message: 'Notification sent successfully' };
    }

    @Sse('sse/:userId')
    @ApiOperation({ summary: 'Subscribe to Server-Sent Events for notifications' })
    @ApiResponse({ status: 200, description: 'SSE stream established' })
    sse(@Param('userId') userId: string): Observable<MessageEvent> {
        return new Observable((observer) => {
            this.clients.set(userId, observer);
            return () => this.clients.delete(userId);
        });
    }
}