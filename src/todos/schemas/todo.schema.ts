
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';



export enum TodoStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export type TodoDocument = HydratedDocument<Todo>;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({ required: true, type: Date })
  startTime!: Date;

  @Prop({ required: true, type: Date })
  endTime!: Date;

  @Prop({
    type: String,
    enum: TodoStatus,
    default: TodoStatus.IN_PROGRESS,
  })
  status!: TodoStatus;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
