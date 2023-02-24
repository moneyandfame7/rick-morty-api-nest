import { type HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'

@Injectable()
export class CharactersException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public manyNotFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('characters', 'Characters not found', HttpStatus.NOT_FOUND)
  }

  public withIdNotFound(id: number): HttpException {
    return this.apiErrorService.throwErrorResponse('id', `Character with ${id} not found`, HttpStatus.NOT_FOUND)
  }

  public alreadyExists(): HttpException {
    return this.apiErrorService.throwErrorResponse('character', 'Character with similar characteristics already exists', HttpStatus.UNPROCESSABLE_ENTITY)
  }

  public emptyFile(): HttpException {
    return this.apiErrorService.throwErrorResponse('file', 'The field file cannot be empty', HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
