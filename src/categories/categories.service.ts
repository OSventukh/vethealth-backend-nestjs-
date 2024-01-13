import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  FindOptionsRelations,
  Like,
  IsNull,
  UpdateResult,
} from 'typeorm';

import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationType } from '@/utils/types/pagination.type';
import { CategoryQueryDto } from './dto/category-query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
  ) {}

  create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const topic = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(topic);
  }

  async findOne(
    fields: FindOptionsWhere<CategoryEntity>,
    include?: FindOptionsRelations<CategoryEntity>,
  ): Promise<CategoryEntity> {
    const topic = await this.categoriesRepository.findOne({
      where: fields,
      relations: include,
    });
    if (!topic) {
      throw new NotFoundException();
    }
    return topic;
  }

  async findManyWithPagination(
    queryDto: CategoryQueryDto,
  ): Promise<PaginationType<CategoryEntity>> {
    const { name, include, orderBy, sort, page, size } = queryDto;

    const [items, count] = await this.categoriesRepository.findAndCount({
      where: { name: name && Like(`%${name}%`), parent: IsNull() },
      skip: (page - 1) * size,
      take: size,
      order: {
        [orderBy]: sort,
      },
      relations: include,
    });
    return {
      items,
      count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
    };
  }

  update(payload: DeepPartial<CategoryEntity>): Promise<CategoryEntity> {
    return this.categoriesRepository.save(
      this.categoriesRepository.create(payload),
    );
  }

  softDelete(id: CategoryEntity['id']): Promise<UpdateResult> {
    return this.categoriesRepository.softDelete(id);
  }
}
