import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from 'src/ability/ability.module';
import { User, UserSchema } from 'src/users/schemas/User.schema';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { Record, RecordSchema } from './schemas/record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Record.name, schema: RecordSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AbilityModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
