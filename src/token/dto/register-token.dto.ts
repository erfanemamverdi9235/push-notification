import { IsString, IsUUID, IsIn, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlatformEnum } from '../enums/platform.enum';

export class RegisterTokenDto {
    @ApiProperty({
        description: 'Unique identifier of the user',
        example: 'b5e296fb-e037-4b48-8c7e-e6cfe0d89812',
    })
    @IsUUID()
    user_id: string;

    @ApiProperty({
        description: 'Device token for push notifications',
        example: 'device_token_example',
    })
    @IsString()
    device_token: string;

    @ApiProperty({
        description: 'Platform type for the device',
        enum: PlatformEnum,
        example: PlatformEnum.Web,
    })
    @IsEnum(PlatformEnum)
    platform: PlatformEnum;
}