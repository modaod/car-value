import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service'; 
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UserController {

   constructor(private userService: UserService, private authService: AuthService) {}

   @Post('/signup')
   async createUser(@Body() body: CreateUserDto, @Session() session: any) {
      const user = await this.authService.signup(body.email, body.password);
      session.userId = user.id;
      return user;
   }

   @Post('/signin')
   async signin(@Body() body: CreateUserDto, @Session() session: any) {
      const user = await this.authService.signin(body.email, body.password);
      session.userId = user.id;
      return user;
   }

   @Get('/whoami')
   @UseGuards(AuthGuard)
   getCurrentUser(@CurrentUser() user: User) {
      return user;
   }

   @Post('/signout')
   signout(@Session() session: any) {
      session.userId = null;
      return 'User signed out successfully!!!';
   }

   @Get('/:id')
   async FindUser(@Param('id') id: string) {
      const user = await this.userService.findOne(+id);
      if (!user) {
         throw new NotFoundException('User not found');
      }
      return user;
   }

   @Get()
   FindUsers(@Query('email') email: string) {
      return this.userService.find(email);
   }  
   
   @Get()
   FindAllUsers() {
      return this.userService.findAll();
   }

   @Delete('/:id')
   async deleteUser(@Param('id') id: string) {
      const user = await this.userService.remove(+id);
      return { message: 'User deleted successfully!!!', user };
   }

   @Patch('/:id')
   async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
      const user = await this.userService.update(+id, body);
      return user;   
   }
}
