import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DeviceTokenRepository } from '../repositories/device-token.repository';
import { PlatformEnum } from '../enums/platform.enum';

@WebSocketGateway()
export class NotificationGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private deviceTokenRepository: DeviceTokenRepository,
    ) { }

    @SubscribeMessage('register')
    handleRegister(client: Socket, payload: { userId: string; deviceToken: string }) {
        client.data.token = payload.deviceToken; // ذخیره توکن در داده‌های کلاینت
        this.deviceTokenRepository.upsert(
            { user_id: payload.userId, device_token: payload.deviceToken, platform: PlatformEnum.Android },
            ['user_id', 'platform'],
        );
    }

    async sendAndroidNotification(userId: string, title: string, message: string) {
        const tokens = await this.deviceTokenRepository.find({
            where: { user_id: userId, platform: PlatformEnum.Android },
        });

        for (const token of tokens) {
            for (const socket of this.server.sockets.sockets.values()) {
                if (socket.data.token === token.device_token) {
                    socket.emit('notification', { title, message });
                }
            }
        }
    }
}