import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Character } from '@infrastructure/entities/main'

@Entity('episodes')
export class Episode {
  @ApiProperty({ example: 1, description: 'The id of the episode.' })
  @PrimaryGeneratedColumn('increment')
  public id: number

  @ApiProperty({ example: 'Pilot', description: 'The name of the episode.' })
  @Column()
  public name: string

  @ApiProperty({ example: 'S01E01', description: 'The code of the episode.' })
  @Column()
  public episode: string

  @ApiProperty({ example: 'December, 2, 2013', description: 'The air date of the episode.' })
  @Column({ name: 'air_date' })
  public airDate: string

  @ApiProperty({
    example: [1, 2, 3, 4, 5, 7, 10],
    description: 'List of characters who have been seen in the episode.'
  })
  @ManyToMany(() => Character, character => character.episodes, { onDelete: 'CASCADE' })
  public characters: number[]

  @ApiProperty({
    description: 'Autogenerated date of created.'
  })
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date
}
