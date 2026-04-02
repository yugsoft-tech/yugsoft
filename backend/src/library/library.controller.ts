import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('library')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) { }

  @Post('books')
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  createBook(@Body() createBookDto: CreateBookDto, @CurrentUser() user: any) {
    return this.libraryService.createBook(createBookDto, user.schoolId);
  }

  @Get('books')
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER, Role.SUPER_ADMIN)
  findAllBooks(@CurrentUser() user: any) {
    return this.libraryService.findAllBooks(user.schoolId);
  }

  @Get('books/:id')
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPER_ADMIN)
  findOneBook(@Param('id') id: string, @CurrentUser() user: any) {
    return this.libraryService.findOneBook(id, user.schoolId);
  }

  @Patch('books/:id')
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @CurrentUser() user: any,
  ) {
    return this.libraryService.updateBook(id, updateBookDto, user.schoolId);
  }

  @Delete('books/:id')
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  removeBook(@Param('id') id: string, @CurrentUser() user: any) {
    return this.libraryService.removeBook(id, user.schoolId);
  }
}

