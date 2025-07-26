import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlatformEnum } from '../enums/platform.enum';

export class SendNotificationDto {
    @ApiProperty({
        description: 'Title of the notification',
        example: 'Test Notification',
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Message content of the notification',
        example: 'This is a test message',
    })
    @IsString()
    message: string;

    @ApiProperty({
        description: 'Platform type for the device',
        enum: PlatformEnum,
        example: PlatformEnum.Web,
    })
    @IsEnum(PlatformEnum)
    platform: PlatformEnum;
}