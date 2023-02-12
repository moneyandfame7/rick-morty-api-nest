import { Injectable } from '@nestjs/common'
import { CreateLocationDto, QueryLocationDto, UpdateLocationDto } from 'src/infrastructure/dto/main/location.dto'
import { QueryPaginationDto } from 'src/infrastructure/dto/common/pagination.dto'
import { LocationRepository } from '../../repositories/main/location.repository'
import { PaginationService } from '../common/pagination.service'
import { Location } from '../../entities/main/location.entity'
import { LocationAlreadyExistsException, LocationsNotFoundException, LocationWithIdNotFoundException } from '../../../domain/exceptions/main/location.exception'

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository, private readonly paginationService: PaginationService<Location>) {}

  async createOne(createLocationDto: CreateLocationDto) {
    const withSameName = this.locationRepository.findOneBy({ name: createLocationDto.name })
    if (withSameName) throw new LocationAlreadyExistsException(createLocationDto.name)

    const location = this.locationRepository.create(createLocationDto)
    return await this.locationRepository.save(location)
  }

  async getMany(queryPaginationDto: QueryPaginationDto, queryLocationDto: QueryLocationDto) {
    const { locations, count } = await this.locationRepository.getMany(queryPaginationDto, queryLocationDto)

    if (!count) throw new LocationsNotFoundException()

    const buildPaginationInfo = this.paginationService.buildPaginationInfo({ queryPaginationDto, count })
    return this.paginationService.wrapEntityWithPaginationInfo(locations, buildPaginationInfo)
  }

  async getOne(id: number) {
    const location = await this.locationRepository.getOne(id)

    if (!location) throw new LocationWithIdNotFoundException(id)

    return location
  }

  async updateOne(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.locationRepository.getOne(id)

    if (!location) throw new LocationWithIdNotFoundException(id)
    return await this.locationRepository.updateOne(id, updateLocationDto)
  }

  async removeOne(id: number) {
    const location = await this.locationRepository.getOne(id)

    if (!location) throw new LocationWithIdNotFoundException(id)

    return await this.locationRepository.removeOne(id)
  }

  async getCount() {
    return await this.locationRepository.getCount()
  }
}
