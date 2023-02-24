import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'
import * as _ from 'lodash'

import { EpisodeService } from '@app/services/main/episode.service'
import type { Presenter } from '@app/services/common/pagination.service'

import type { CreateEpisodeDto, QueryEpisodeDto, UpdateEpisodeDto } from '@app/dto/main/episode.dto'
import type { QueryPaginationDto } from '@app/dto/common/pagination.dto'

import { Episode } from '@infrastructure/entities/main/episode.entity'

import { Roles } from '@common/decorators/roles.decorator'
import { RolesEnum } from '@common/constants/roles.enum'
import { JwtAuthGuard } from '@common/guards/auth/jwt.guard'
import { RolesGuard } from '@common/guards/roles.guard'

@Controller('/api/episodes')
@ApiTags('/episodes')
export class EpisodeController {
  public constructor(private readonly episodeService: EpisodeService) {}

  @Post()
  @ApiOperation({ summary: 'create and save a new episode to collection' })
  @ApiResponse({ status: 200, type: Episode })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async createOne(@Body() createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    return this.episodeService.createOne(createEpisodeDto)
  }

  @Get()
  @ApiOperation({ summary: 'get all episodes by queries' })
  @ApiResponse({ status: 200, type: [Episode] })
  public async getMany(@Query(new ValidationPipe({ transform: true })) query: QueryEpisodeDto, @Req() req: Request): Promise<Presenter<Episode>> {
    const queryPaginationDto: QueryPaginationDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl.split('?')[1],
      endpoint: 'episodes'
    }
    const queryEpisodeDto = _.omitBy(
      {
        id: query.id,
        name: query.name,
        episode: query.episode,
        character_name: query.character_name
      },
      _.isNil
    )
    return this.episodeService.getMany(queryPaginationDto, queryEpisodeDto as QueryEpisodeDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one episode with specified id' })
  @ApiResponse({ status: 200, type: Episode })
  @UseGuards(JwtAuthGuard)
  public async getOne(@Param('id', ParseIntPipe) id: number): Promise<Episode> {
    return this.episodeService.getOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update one episode with specified id' })
  @ApiResponse({ status: 200, type: Episode })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateEpisodeDto: UpdateEpisodeDto): Promise<Episode> {
    return this.episodeService.updateOne(id, updateEpisodeDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'remove one episode with specified id' })
  @ApiResponse({ status: 200, type: Episode })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async removeOne(@Param('id', ParseIntPipe) id: number): Promise<Episode> {
    return this.episodeService.removeOne(id)
  }
}