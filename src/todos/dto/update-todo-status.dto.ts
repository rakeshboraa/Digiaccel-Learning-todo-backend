import { IsEnum } from 'class-validator';
import { TodoStatus } from '../schemas/todo.schema.js';

export class UpdateTodoStatusDto {
  @IsEnum(TodoStatus)
  status!: TodoStatus;
}