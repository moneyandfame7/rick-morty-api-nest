import type { Character } from '@entities/main/character.entity'

export interface GetManyCharacters {
  characters: Character[] | null
  count: number
}
