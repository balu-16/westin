import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, HttpCode } from '@nestjs/common';
import { IsArray, IsEmail, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';

class CreateTeacherDto {
  @IsString() @MaxLength(200) name: string;
  @IsEmail() @MaxLength(320) email: string;
  @IsOptional() @IsString() @MaxLength(32) facultyId?: string;
  @IsOptional() @IsString() @MaxLength(120) designation?: string;
  @IsOptional() @IsString() @MaxLength(120) department?: string;
  @IsOptional() @IsString() @MaxLength(32) phone?: string;
  @IsOptional() @IsArray() @IsUUID('4', { each: true }) subjects?: string[];
}

class UpdateTeacherDto {
  @IsOptional() @IsString() @MaxLength(200) name?: string;
  @IsOptional() @IsEmail() @MaxLength(320) email?: string;
  @IsOptional() @IsString() @MaxLength(120) designation?: string;
  @IsOptional() @IsString() @MaxLength(120) department?: string;
  @IsOptional() @IsString() @MaxLength(32) phone?: string;
  @IsOptional() @IsIn(['active', 'inactive']) status?: string;
  @IsOptional() @IsArray() @IsUUID('4', { each: true }) subjects?: string[];
}

class CreateStudentDto {
  @IsString() @MaxLength(200) name: string;
  @IsEmail() @MaxLength(320) email: string;
  @IsUUID() sectionId: string;
  @IsInt() @Min(1) @Max(6) year: number;
  @IsOptional() @IsString() @MaxLength(120) department?: string;
}

class UpdateStudentDto {
  @IsOptional() @IsString() @MaxLength(200) name?: string;
  @IsOptional() @IsEmail() @MaxLength(320) email?: string;
  @IsOptional() @IsUUID() sectionId?: string;
  @IsOptional() @IsInt() @Min(1) @Max(6) year?: number;
  @IsOptional() @IsString() @MaxLength(120) department?: string;
  @IsOptional() @IsIn(['active', 'inactive']) status?: string;
}

@Controller('api/admin')
@Roles('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }

  @Get('teachers')
  teachers(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.admin.listTeachers(page, pageSize);
  }

  @Post('teachers')
  @HttpCode(200)
  createTeacher(@Body() dto: CreateTeacherDto) {
    return this.admin.createTeacher(dto);
  }

  @Patch('teachers/:id')
  updateTeacher(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTeacherDto) {
    return this.admin.updateTeacher(id, dto);
  }

  @Delete('teachers/:id')
  deleteTeacher(@Param('id', ParseUUIDPipe) id: string) {
    return this.admin.deleteTeacher(id);
  }

  @Get('students')
  students(
    @Query('sectionId') sectionId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.admin.listStudents(sectionId, search, page, pageSize);
  }

  /** Unpaginated full directory for the portal's section rosters/dropdowns —
   *  one call instead of walking every page of GET /students. */
  @Get('students/directory')
  studentsDirectory() {
    return this.admin.directory();
  }

  @Post('students')
  @HttpCode(200)
  createStudent(@Body() dto: CreateStudentDto) {
    return this.admin.createStudent(dto);
  }

  @Patch('students/:id')
  updateStudent(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStudentDto) {
    return this.admin.updateStudent(id, dto);
  }

  @Delete('students/:id')
  deleteStudent(@Param('id', ParseUUIDPipe) id: string) {
    return this.admin.deleteStudent(id);
  }

  @Get('login-logs')
  loginLogs(@Query('role') role: 'teacher' | 'student' = 'teacher', @Query('limit') limit?: string) {
    if (role !== 'teacher' && role !== 'student') {
      throw new BadRequestException('role must be teacher or student');
    }
    return this.admin.loginLogs(role, limit ? Number(limit) : 10);
  }
}
