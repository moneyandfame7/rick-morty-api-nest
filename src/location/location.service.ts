import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Location } from './entities/location.entity'
import { FindManyOptions, Repository } from 'typeorm'

@Injectable()
export class LocationService {
  private readonly relations: FindManyOptions<Location> = {
    loadRelationIds: {
      relations: ['residents']
    },
    select: ['id', 'dimension', 'name', 'type', 'createdAt']
  }

  constructor(@InjectRepository(Location) private readonly locationRepository: Repository<Location>) {}

  async create(createLocationDto: CreateLocationDto) {
    const location = await this.locationRepository.create(createLocationDto)
    return await this.locationRepository.save(location)
  }

  async findAll() {
    const locations = await this.locationRepository.find(this.relations)
    if (!locations) {
      throw new NotFoundException('Locations not found')
    }
    return locations
  }

  async findOne(id: number) {
    const location = await this.locationRepository.findOne({
      ...this.relations,
      where: {
        id
      }
    })
    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found`)
    }
    return location
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    return await this.locationRepository.update(id, updateLocationDto)
  }

  async remove(id: number) {
    return await this.locationRepository.delete(id)
  }
}
