import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderStatusCodeService } from './order_status_code.service';
import { CreateOrderStatusCodeDto } from './dto/create-order_status_code.dto';
import { UpdateOrderStatusCodeDto } from './dto/update-order_status_code.dto';

@Controller('order-status-code')
export class OrderStatusCodeController {
  constructor(
    private readonly orderStatusCodeService: OrderStatusCodeService,
  ) {}

  @Post()
  create(@Body() createOrderStatusCodeDto: CreateOrderStatusCodeDto) {
    return this.orderStatusCodeService.create(createOrderStatusCodeDto);
  }

  @Get()
  findAll(@Query('with_deleted') withDeleted: boolean) {
    return this.orderStatusCodeService.findAll(withDeleted);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted') withDeleted: boolean,
  ) {
    return this.orderStatusCodeService.findOne(id, withDeleted);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderStatusCodeDto: UpdateOrderStatusCodeDto,
  ) {
    return this.orderStatusCodeService.update(id, updateOrderStatusCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.orderStatusCodeService.remove(id, remove);
  }
}
