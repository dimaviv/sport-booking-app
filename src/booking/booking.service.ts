import { Injectable } from '@nestjs/common';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';

@Injectable()
export class BookingService {
  create(createBookingInput: CreateBookingInput) {
    return 'This action adds a new booking';
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingInput: UpdateBookingInput) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
