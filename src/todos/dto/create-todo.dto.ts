
import {IsString,IsNotEmpty,IsOptional,IsDateString,IsEnum,MaxLength,
} from 'class-validator';

import {
  TodoStatus,
} from '../schemas/todo.schema.js';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;


  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
