import { IsString, IsBoolean, IsArray, ArrayMaxSize, ValidateNested, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { VocabWordDto, MAX_WORDS_PER_SET } from './create-vocab-set.dto';

export class UpdateVocabSetDto {
  @IsOptional() @IsString() @MaxLength(120)
  name?: string;

  @IsOptional() @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_WORDS_PER_SET, { message: `Tối đa ${MAX_WORDS_PER_SET} từ mỗi bộ.` })
  @ValidateNested({ each: true })
  @Type(() => VocabWordDto)
  words?: VocabWordDto[];
}
