import { DataSource, Repository, type SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Token } from '@entities/common/token.entity'

@Injectable()
export class TokenRepository extends Repository<Token> {
  constructor(private readonly dataSource: DataSource) {
    super(Token, dataSource.createEntityManager())
  }

  private get builder(): SelectQueryBuilder<Token> {
    return this.createQueryBuilder('token')
  }

  //
  // private buildRelations(builder: SelectQueryBuilder<Token>) {
  //   builder.leftJoinAndSelect('token.userId', 'user')
  // }

  public async get(user_id: string): Promise<Token | null> {
    const queryBuilder = this.builder

    return queryBuilder.where('user_id = :user_id', { user_id }).getOne()
  }

  public async deleteByToken(refreshToken: string): Promise<Token> {
    const queryBuilder = this.builder

    const { raw } = await queryBuilder.delete().from(Token).where('refresh_token = :refresh_token', { refresh_token: refreshToken }).returning('*').execute()
    return raw[0]
  }

  public async findByToken(refreshToken: string): Promise<Token | null> {
    const queryBuilder = this.builder

    return queryBuilder.where('refresh_token = :refresh_token', { refresh_token: refreshToken }).getOne()
  }
}
