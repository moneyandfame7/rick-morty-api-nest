import { type DataSource, type EntityTarget, type ObjectLiteral, Repository, type SelectQueryBuilder } from 'typeorm'

import { QueryPaginationDto } from '@app/dto/common'
import { toCorrectId } from '@common/utils'

export abstract class MainRepositoryAbstract<Entity extends ObjectLiteral, QueryEntityDto, CreateEntityDto, UpdateEntityDto, GetManyEntities> extends Repository<Entity> {
  protected constructor(protected dataSource: DataSource, protected alias: string, protected En: EntityTarget<Entity>) {
    super(En, dataSource.createEntityManager())
  }

  protected toCorrectQueriesId(id: string): number[] {
    return toCorrectId(id)
  }

  protected get builder(): SelectQueryBuilder<Entity> {
    return this.createQueryBuilder(this.alias)
  }

  protected abstract buildQueries(builder: SelectQueryBuilder<Entity>, queries: QueryEntityDto): void

  protected abstract buildRelations(builder: SelectQueryBuilder<Entity>): void

  public abstract createOne(dto: CreateEntityDto): Promise<Entity>

  public abstract getMany(queryPaginationDto: QueryPaginationDto, queryEntityDto: QueryEntityDto): Promise<GetManyEntities>

  public abstract getOne(id: number): Promise<Entity | null>

  public abstract updateOne(id: number, dto: UpdateEntityDto): Promise<Entity>

  public abstract removeOne(id: number): Promise<Entity>

  public async getCount(): Promise<number> {
    const queryBuilder = this.builder

    return queryBuilder.getCount()
  }
}
