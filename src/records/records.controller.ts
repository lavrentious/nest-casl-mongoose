import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Role, User, UserDocument } from 'src/users/schemas/User.schema';
import { AbilityFactory } from '../ability/ability.factory';
import { RecordsService } from './records.service';
import { RecordDocument } from './schemas/record.schema';

@Controller('records')
export class RecordsController {
  constructor(
    private readonly recordsService: RecordsService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @Get()
  async getAll(): Promise<RecordDocument[]> {
    // imitate getting payload from JWT and hydrating it from DB
    // const loggedUser = await this.userModel.findOne({ role: Role.USER });
    const loggedUser = new this.userModel({
      _id: new mongoose.Types.ObjectId('62eb8cfcaf5fc0f97818f319'),
      email: 'alpha@alpha.com',
      password: 'hashedAlphaPassword',
      role: Role.USER,
    });
    console.log('logged user', loggedUser);
    const ability = this.abilityFactory.defineAbility(loggedUser); // ability of the logged user
    return this.recordsService.find(ability);
  }
}
