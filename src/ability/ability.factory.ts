import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { AccessibleRecordModel } from '@casl/mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record, RecordDocument } from '../records/schemas/record.schema';
import { Role, User, UserDocument } from '../users/schemas/User.schema';

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Record.name)
    private readonly recordModel: AccessibleRecordModel<RecordDocument>,
  ) {}

  defineAbility(user: UserDocument | null) {
    type Subjects =
      | InferSubjects<typeof this.userModel>
      | InferSubjects<typeof this.recordModel>
      | 'all';
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<Ability<[Action, Subjects]>>,
    );
    const defineForAdmin = () => {
      can(Action.MANAGE, 'all');
    };
    const defineForUser = () => {
      can(Action.UPDATE, this.userModel, ['email', 'password'], {
        _id: user._id,
      });
      can(Action.DELETE, this.userModel, { _id: user._id });
    };
    const defineForAnon = () => {
      can(Action.READ, this.userModel, ['email']);
      can(Action.READ, this.recordModel);
    };

    switch (user?.role) {
      case Role.ADMIN:
        defineForAdmin();
        break;

      case Role.USER:
        defineForAnon();
        defineForUser();
        break;

      default:
        defineForAnon();
        break;
    }

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
