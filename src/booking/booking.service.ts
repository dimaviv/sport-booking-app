import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import {PrismaService} from "../prisma.service";


@Injectable()
export class BookingService {

  constructor(
      private readonly prisma: PrismaService,
  ) {}


  async findAllByUserId(userId: number, pagination) {
    let { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [bookings, totalCount] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where: {
          userId: userId,
        },
        include: {
          facility: {include: {images: true}},
          bookingSlots: {
            include: {
              timeSlot: true,
            },
          },
        },
        orderBy: {id: 'desc',},
        skip: offset,
        take: limit,
      }),
      this.prisma.booking.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    const currentDate = new Date()

    const updatedBookings = bookings.map(async booking => {
      const timeSlots = booking.bookingSlots.map(slot => slot.timeSlot);
      const { startTime, endTime } = await this.getCorrectBookingTimes(currentDate, timeSlots);
      return { ...booking, startTime, endTime };
    });

    return { totalCount, bookings: updatedBookings };
  }

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
          isActive: true,
        },
        select: {
          id: true,
          price: true,
          startTime: true,
          dayOfWeek: true,
          endTime: true,
        },
        orderBy: [{dayOfWeek: 'asc',}, {startTime: 'asc',},],
      });

      if (timeSlots.length !== timeSlotIds.length) {
        throw new Error('One or more time slots are not available for booking.');
      }

      for (let i = 0; i < timeSlots.length - 1; i++) {
        if (timeSlots[i].endTime.getTime() !== timeSlots[i + 1].startTime.getTime()) {
          throw new Error('Time slots are not sequential.');
        }
      }

      const { totalPrice, totalDuration } = timeSlots.reduce((acc, slot) => {
        acc.totalPrice += Number(slot.price || 0);
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

      const createdBooking = await prisma.booking.findUnique({
        where:{id:booking.id},
        include:{
          facility: {include: {images: true}}, bookingSlots:{
            include:{
              timeSlot: true
            }
          }}
      })

      const { startTime, endTime } = await this.getCorrectBookingTimes(new Date(), timeSlots);

      return {...createdBooking, startTime, endTime}

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
          isActive: true,
        },
        select: {
          id: true,
          price:true,
          startTime: true,
          dayOfWeek: true,
          endTime: true,
        },
        orderBy: [{dayOfWeek: 'asc',}, {startTime: 'asc',},],
      });

      if (timeSlots.length !== timeSlotIds.length) {
        throw new Error('One or more time slots are not available for booking.');
      }

      for (let i = 0; i < timeSlots.length - 1; i++) {
        if (timeSlots[i].endTime.getTime() !== timeSlots[i + 1].startTime.getTime()) {
          throw new Error('Time slots are not sequential.');
        }
      }

      const { totalPrice, totalDuration } = timeSlots.reduce((acc, slot) => {
        acc.totalPrice += Number(slot.price || 0);
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

      const updatedBooking = await prisma.booking.update({
        where:{id:booking.id},
        data:{price: totalPrice},
        include:{facility: {include: {images: true}}, bookingSlots:{
            include:{
              timeSlot: true,
            }
          }}
      })

      const { startTime, endTime } = await this.getCorrectBookingTimes(new Date(), timeSlots);

      return {...updatedBooking, startTime, endTime}

    });
  }

  async getCorrectDateTime(currentDate, targetDayOfWeek, time) {
    const currentDayOfWeek = currentDate.getDay();
    let dayDiff = targetDayOfWeek - currentDayOfWeek;

    if (dayDiff < 0) {
      dayDiff += 7;
    }

    const correctDate = new Date(currentDate);
    correctDate.setDate(correctDate.getDate() + dayDiff);
    correctDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());

    return correctDate;
  }

  async getCorrectBookingTimes(currentDate = new Date(), timeSlots) {
    if (timeSlots.length === 0) {
      throw new Error("Time slots array is empty.");
    }

    const firstSlot = timeSlots[0];
    const lastSlot = timeSlots[timeSlots.length - 1];

    const startTime = await this.getCorrectDateTime(currentDate, firstSlot.dayOfWeek, firstSlot.startTime);
    const endTime = await this.getCorrectDateTime(currentDate, lastSlot.dayOfWeek, lastSlot.endTime);

    return { startTime, endTime };
  }
}
