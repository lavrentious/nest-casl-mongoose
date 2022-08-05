import { AccessibleRecordModel, accessibleRecordsPlugin } from '@casl/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/User.schema';

export type RecordDocument = Record & Document;

@Schema({ timestamps: true })
export class Record {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
  author: User;
}

export const RecordSchema = SchemaFactory.createForClass<
  Record,
  AccessibleRecordModel<Record>
>(Record).plugin(accessibleRecordsPlugin);
