import { type HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common/api-error.service'

@Injectable()
export class LocationException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public manyNotFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('Locations not found', HttpStatus.NOT_FOUND)
  }

  public withIdNotFound(id: number): HttpException {
    return this.apiErrorService.throwErrorResponse(`Location with ${id} not found`, HttpStatus.NOT_FOUND)
  }

  public alreadyExists(name: string): HttpException {
    return this.apiErrorService.throwErrorResponse(`Location with name ${name} already exists`, HttpStatus.CONFLICT)
  }

  //
  // public emptyFile(): HttpException {
  //   return this.apiErrorService.throwErrorResponse('file', 'The field file cannot be empty', HttpStatus.UNPROCESSABLE_ENTITY)
  // }
}
