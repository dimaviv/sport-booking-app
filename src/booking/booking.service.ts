import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import {PrismaService} from "../prisma.service";
import {RatingService} from "../rating/rating.service";
import {FilesService} from "../files/files.service";
import {Booking} from "./booking.types";

@Injectable()
export class BookingService {

  constructor(
      private readonly prisma: PrismaService,
  ) {}

  async create(createBookingInput: CreateBookingInput, userId: number) {
    const { facilityId, timeSlotIds } = createBookingInput;

    return await this.prisma.$transaction(async (prisma) => {
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        select: { minBookingTime: true },
      });

      if (!facility) {
        throw new Error('Facility not found.');
      }

      const minBookingTime = facility.minBookingTime;

      const timeSlots = await prisma.timeSlot.findMany({
        where: {
          id: { in: timeSlotIds },
          status: 'available',
        },
        select: {
          id: true,
          price: true,
          startTime: true,
          endTime: true,
        },
      });

      if (timeSlots.length !== timeSlotIds.length) {
        throw new Error('One or more time slots are not available for booking.');
      }

      const { totalPrice, totalDuration } = timeSlots.reduce((acc, slot) => {
        acc.totalPrice += slot.price || 0;
        acc.totalDuration += slot.endTime.getTime() - slot.startTime.getTime();
        return acc;
      }, { totalPrice: 0, totalDuration: 0 });

      let totalDurationInMinutes = totalDuration / (1000 * 60);
      if (totalDurationInMinutes < minBookingTime) {
        throw new Error('The total duration of selected time slots does not meet the minimum booking time required.');
      }


      const booking = await prisma.booking.create({
        data: {
          userId,
          facilityId,
          status: 'pending',
          price: totalPrice,
        },
      });

      const bookingSlotsData = timeSlots.map(slot => ({
        bookingId: booking.id,
        timeSlotId: slot.id,
      }));

      await prisma.bookingSlot.createMany({
        data: bookingSlotsData,
      });

      return prisma.booking.findUnique({
        where:{id:booking.id},
        include:{facility:true, bookingSlots:{
          include:{
            timeSlot: true
          }
          }}
      })

    });
  }


  async update(id: number, updateBookingInput: UpdateBookingInput, userId: number) {
    const { timeSlotIds } = updateBookingInput;

    return await this.prisma.$transaction(async (prisma) => {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { facility: true },
      });

      if (!booking || booking.userId !== userId || booking.status !== 'pending') {
        throw new Error('Booking is not available for updates.');
      }

      const minBookingTime = booking.facility.minBookingTime;

      const timeSlots = await prisma.timeSlot.findMany({
        where: {
          id: { in: timeSlotIds },
          status: 'available',
        },
        select: {
          id: true,
          price:true,
          startTime: true,
          endTime: true,
        },
      });

      if (timeSlots.length !== timeSlotIds.length) {
        throw new Error('One or more time slots are not available for booking.');
      }

      const { totalPrice, totalDuration } = timeSlots.reduce((acc, slot) => {
        acc.totalPrice += slot.price || 0;
        acc.totalDuration += slot.endTime.getTime() - slot.startTime.getTime();
        return acc;
      }, { totalPrice: 0, totalDuration: 0 });

      let totalDurationInMinutes = totalDuration / (1000 * 60);
      if (totalDurationInMinutes < minBookingTime) {
        throw new Error('The total duration of selected time slots does not meet the minimum booking time required.');
      }


      await prisma.bookingSlot.deleteMany({
        where: { bookingId: id },
      });

      const bookingSlotsData = timeSlots.map(slot => ({
        bookingId: id,
        timeSlotId: slot.id,
      }));

      await prisma.bookingSlot.createMany({
        data: bookingSlotsData,
      });

      return prisma.booking.update({
        where:{id:booking.id},
        data:{price: totalPrice},
        include:{facility:true, bookingSlots:{
            include:{
              timeSlot: true
            }
          }}
      })

    });
  }


  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
