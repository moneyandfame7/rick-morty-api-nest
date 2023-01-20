import { IsIn, IsOptional, IsString } from 'class-validator'
import { PageOptionsDto } from '../../shared/page-info/dto/page-options.dto'
import { toCorrectId } from '../../shared/transforms/to-correct-id.transform'
import { Transform } from 'class-transformer'

export class QueryCharacterDto extends PageOptionsDto {
  @Transform(({ value }) => toCorrectId(value))
  @IsOptional()
  id?: number[]

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsIn(['Alive', 'Dead', 'unknown'])
  @IsString()
  status?: string

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsString()
  species?: string

  @IsOptional()
  @IsIn(['Female', 'Male', 'Genderless', 'unknown'])
  @IsString()
  gender?: string

  @IsOptional()
  @IsString()
  episode_name?: string
}
