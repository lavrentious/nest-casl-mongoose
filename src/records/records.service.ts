import { Ability } from '@casl/ability';
import { AccessibleRecordModel } from '@casl/mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Action } from '../ability/ability.factory';
import { Record, RecordDocument } from './schemas/record.schema';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: AccessibleRecordModel<RecordDocument>,
  ) {}
  async find(ability?: Ability) {
    if (ability) {
      console.log(
        'able to read Record?',
        ability.can(Action.READ, this.recordModel),
      ); // true

      // mocked record from the db that user must be able to read
      // const recordInstance = await this.recordModel.findOne();
      const recordInstance = new this.recordModel({
        _id: new mongoose.Types.ObjectId('62eb8dfdaf5fc0f97818f31d'),
        name: 'alpha record 1',
        description: 'text',
        author: new mongoose.Types.ObjectId('62eb8cfcaf5fc0f97818f319'),
      });

      console.log(
        'able to read Record instance?',
        recordInstance,
        ability.can(Action.READ, recordInstance),
      ); // true
      try {
        // must return Records that can be accessed with provided ability
        // this throws ForbiddenError even if permissions are sufficient
        return await this.recordModel.accessibleBy(ability);
      } catch (error) {
        console.log('error with accessibleBy: ', error);
        throw new ForbiddenException(error.message);
      }
    }
    return await this.recordModel.find();
  }
}
