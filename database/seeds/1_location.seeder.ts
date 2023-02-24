import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'

import { CreateLocationDto } from '@app/dto/main/location.dto'

import { Location } from '@infrastructure/entities/main/location.entity'

import { fetchData } from '@common/utils/fetch-data'

export interface ILocation {
  id: number
  name: string
  created: string
  url: string
  type: string
  dimension: string
  residents: string[]
}

export class LocationSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const locationRepository = dataSource.getRepository(Location)
      const locations: CreateLocationDto[] = []
      const responseLocation = await fetchData<ILocation>('https://rickandmortyapi.com/api/location')
      responseLocation.map(location => {
        locations.push({
          name: location.name,
          type: location.type,
          dimension: location.dimension
        })
      })
      await locationRepository.insert(locations)
      console.log('✅ Locations filling successfully. ')
    } catch (error) {
      console.log(error)
      console.log('❌ Locations filling failed ')
    }
  }
}