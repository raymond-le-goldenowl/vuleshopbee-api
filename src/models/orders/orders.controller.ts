import { Order } from 'src/models/orders/entities/order.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Role } from 'src/authentication/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetCurrentUserDecorator } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/models/users/entities/user.entity';
import { UpdateOrderBeforeCheckoutDto } from './dto/update-order-before-checkout.dto';

@Controller('v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetCurrentUserDecorator() user: User,
  ) {
    return this.ordersService.create(createOrderDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(@GetCurrentUserDecorator() user: User) {
    return this.ordersService.findAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Get('/filter')
  filter(@Query() query, @GetCurrentUserDecorator() user: User) {
    return this.ordersService.filter(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted') withDeleted: boolean,
  ) {
    return this.ordersService.findOne(id, withDeleted);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetCurrentUserDecorator() user: User,
  ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Patch('/quantity/:id')
  updateBeforeCheckout(
    @Param('id') orderId: string,
    @Body() updateOrderBeforeCheckoutDto: UpdateOrderBeforeCheckoutDto,
    @GetCurrentUserDecorator() user: User,
  ): Promise<Order> {
    const { quantity, orderItemId, productId } = updateOrderBeforeCheckoutDto;

    return this.ordersService.updateBeforeCheckout(
      quantity,
      orderItemId,
      orderId,
      productId,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Delete(':id')
  remove(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.ordersService.remove(id, remove);
  }
}
