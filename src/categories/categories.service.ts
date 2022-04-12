import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const categorySaved = await this.categoriesRepository.save(
      createCategoryDto,
    );

    if (!categorySaved) {
      throw new BadRequestException(`Can not save category`);
    }

    return categorySaved;
  }

  async findAll() {
    let categories: Category[];
    try {
      categories = await this.categoriesRepository.find({ withDeleted: true });
    } catch (error) {
      throw new NotFoundException();
    }
    return categories;
  }

  async findOne(id: string) {
    let category: Category;

    try {
      category = await this.categoriesRepository.findOne({
        withDeleted: true,
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException();
    }

    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    let category: Category;
    let categoryUpdated: Category;
    try {
      category = await this.findOne(id);
      if (!category) {
        throw new NotFoundException();
      }
      category.text = updateCategoryDto.text;
      category.value = updateCategoryDto.value;
      category.deleted_at = null;

      const categoryUpdated = await this.categoriesRepository.save(category);

      if (!categoryUpdated) {
        throw new BadRequestException();
      }
    } catch (error) {
      throw new BadRequestException();
    }

    return categoryUpdated;
  }

  async removeAll(remove: boolean) {
    try {
      if (remove) {
        await this.categoriesRepository.delete({});
      } else {
        await this.categoriesRepository.softDelete({});
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string, remove: boolean) {
    try {
      if (remove) {
        await this.categoriesRepository.delete(id);
      } else {
        await this.categoriesRepository.softDelete(id);
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
