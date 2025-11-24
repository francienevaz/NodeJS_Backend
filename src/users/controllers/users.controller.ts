// src/users/controllers/users.controller.ts
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Patch, 
    Delete, 
    Query,
    UseGuards 
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../../src/shared/enums/payment.enums';

type CreateUserDto = {
    email: string;
    fullName: string;
    password: string;
    roleId: string;
    phone?: string;
    hospitalId?: string;
};

type UpdateUserDto = {
    email?: string;
    fullName?: string;
    phone?: string;
    hospitalId?: string;
    isActive?: boolean;
};

@Controller('users')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create({
            ...createUserDto,
            passwordHash: createUserDto.password // This should be hashed in a real scenario
        });
    }

    @Get()
    async findAll(@Query('hospitalId') hospitalId?: string) {
        return this.usersService.findAll(hospitalId);
    }

    @Get('roles')
    async findRoles() {
        return this.usersService.findRoles();
    }

    @Get('role/:roleName')
    async findByRole(
        @Param('roleName') roleName: string,
        @Query('hospitalId') hospitalId?: string
    ) {
        return this.usersService.findByRole(roleName, hospitalId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Patch(':id/deactivate')
    async deactivate(@Param('id') id: string) {
        return this.usersService.deactivate(id);
    }

    @Patch(':id/activate')
    async activate(@Param('id') id: string) {
        return this.usersService.activate(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}