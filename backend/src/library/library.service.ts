import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async createBook(createBookDto: CreateBookDto, schoolId: string) {
    return this.prisma.book.create({
      data: {
        ...createBookDto,
        school: {
          connect: { id: schoolId },
        },
      },
    });
  }

  async findAllBooks(schoolId: string) {
    return this.prisma.book.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneBook(id: string, schoolId: string) {
    const book = await this.prisma.book.findFirst({
      where: { id, schoolId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto, schoolId: string) {
    await this.findOneBook(id, schoolId);

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async removeBook(id: string, schoolId: string) {
    await this.findOneBook(id, schoolId);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}

