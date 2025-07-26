import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';
import { PlatformEnum } from '../enums/platform.enum';

@Entity('device_tokens')
@Unique(['user_id', 'platform'])
@Index('idx_user_id_platform', ['user_id', 'platform'])
export class DeviceToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    user_id: string;

    @Column('text')
    device_token: string;

    @Column('enum', { enum: PlatformEnum })
    platform: PlatformEnum;

    @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
