import { type DataSource } from 'typeorm'
import { type Seeder } from 'typeorm-extension'
import { type CreateEpisodeDto } from 'src/infrastructure/dto/main/episode.dto'
import { Episode } from 'src/infrastructure/entities/main/episode.entity'
import { fetchData } from 'src/infrastructure/common/utils/fetch-data'

export interface IEpisode {
  id: number
  name: string
  created: string
  url: string
  air_date: string
  episode: string
  characters: string[]
}

export class EpisodeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const episodeRepository = dataSource.getRepository(Episode)
      const episodes: CreateEpisodeDto[] = []
      const responseEpisode = await fetchData<IEpisode>('https://rickandmortyapi.com/api/episode')
      responseEpisode.map(episode => {
        episodes.push({
          name: episode.name,
          airDate: episode.air_date,
          episode: episode.episode,
          createdAt: new Date()
        })
      })

      await episodeRepository.insert(episodes)
      console.log('✅ Episodes filling successfully.')
    } catch (error) {
      console.log('❌ Episodes filling failed.')
    }
  }
}
