import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceToken } from '../entities/device-token.entity';

@Injectable()
export class DeviceTokenRepository extends Repository<DeviceToken> {
  constructor(
    @InjectRepository(DeviceToken)
    repository: Repository<DeviceToken>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
