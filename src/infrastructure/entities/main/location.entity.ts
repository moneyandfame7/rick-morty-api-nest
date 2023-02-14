import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Character } from 'src/infrastructure/entities/main/character.entity'

@Entity('locations')
export class Location {
  @ApiProperty({ example: 1, description: 'The id of the location.' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: 'Earth (C-137)', description: 'The name of the location.' })
  @Column()
  name: string

  @ApiProperty({ example: 'Planet', description: 'The type of the location.' })
  @Column()
  type: string

  @ApiProperty({ example: 'Dimension C-137', description: 'The dimension in which the location is located.' })
  @Column()
  dimension: string

  @OneToMany(() => Character, character => character.location)
  residents: Character[]

  @ApiProperty({
    description: 'Autogenerated date of created.'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
