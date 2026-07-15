import { IsString, IsBoolean, IsArray, ArrayMaxSize, ValidateNested, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class VocabWordDto {
  @IsString() @MaxLength(200)
  w: string; // từ

  @IsOptional() @IsString() @MaxLength(50)
  p?: string; // loại từ

  @IsString() @MaxLength(500)
  m: string; // nghĩa
}

export const MAX_WORDS_PER_SET = 5000;

export class CreateVocabSetDto {
  @IsString() @MaxLength(120)
  name: string;

  @IsOptional() @IsBoolean()
  isPublic?: boolean;

  @IsArray()
  @ArrayMaxSize(MAX_WORDS_PER_SET, { message: `Tối đa ${MAX_WORDS_PER_SET} từ mỗi bộ.` })
  @ValidateNested({ each: true })
  @Type(() => VocabWordDto)
  words: VocabWordDto[];
}
