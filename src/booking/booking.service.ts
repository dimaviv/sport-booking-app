import {Injectable} from '@nestjs/common';
import {CreateBookingInput} from './dto/create-booking.input';
import {PrismaService} from "../prisma.service";


@Injectable()
export class BookingService {

  constructor(
      private readonly prisma: PrismaService,
  ) {}

  // FIND ALL
  async findAllByUserId(userId: number, pagination) {
    let { page, limit } = pagination;
    const offset = (page - 1) * limit;
    const [bookings, totalCount] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where: {
          userId: userId,
        },
        include: {
          facility: {
            include: {
              images: true,
              district: true,
              owner: { include: { userOwner: true } },
              ratings: {
                where: { userId: userId },
                select: { id: true }
              }
            },
          },
          bookingSlots: {
            include: {
              timeSlot: true,
            },
          },
        },
        orderBy: { id: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.booking.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    const currentDate = new Date();

    const updatedBookings = await Promise.all(bookings.map(async booking => {
      const timeSlots = booking.bookingSlots.map(slot => slot.timeSlot);
      const { startTime, endTime } = await this.getCorrectBookingTimes(currentDate, timeSlots);

      const userHasRated = booking.facility.ratings.length > 0;

      return { ...booking, startTime, endTime, facility: { ...booking.facility, userHasRated } };
    }));

    return { totalCount, bookings: updatedBookings };
  }

  // CANCEL
  async cancel(bookingId: number, userId: number) {
    return await this.prisma.$transaction(async (prisma) => {

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.userId !== userId) {
        throw new Error('You do not have permission to cancel this booking');
      }

      const cancelledBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled' },
        include: {
          facility: {
            include: {
              images: true,
              district: true,
              owner: { include: { userOwner: true } },
              ratings: {
                where: { userId: userId },
                select: { id: true }
              }
            },
          },
        },
      });

      // await prisma.bookingSlot.deleteMany({
      //   where: { bookingId: bookingId },
      // });

      await prisma.bookingSlot.updateMany({
        where: { bookingId: bookingId },
        data: { date: null },
      });

      return cancelledBooking;
    });
  }

  // CREATE
  async create(createBookingInput: CreateBookingInput, userId: number) {
    const { facilityId, timeSlotIds } = createBookingInput;

    return await this.prisma.$transaction(async (prisma) => {
      const facility = await this.fetchFacility(prisma, facilityId);
      const timeSlots = await this.fetchTimeSlots(prisma, timeSlotIds);

      const { startTime, endTime } = await this.getCorrectBookingTimes(new Date(), timeSlots);

      const isAvailable = await this.areTimeSlotsAvailable(prisma, timeSlotIds, startTime);

      if (!isAvailable) {
        throw new Error('One or more time slots are not available for booking.');
      }

      const { totalPrice } = await this.verifyTimeSlots(timeSlots, timeSlotIds, facility.minBookingTime);

      const booking = await prisma.booking.create({
        data: {
          userId,
          facilityId,
          status: 'pending',
          price: totalPrice,
        },
        include: {
          facility: {
            include: {
              images: true,
              district: true,
              owner: { include: { userOwner: true } },
            },
          },
          bookingSlots: {
            include: {
              timeSlot: true,
            },
          },
        },
      });

      await this.manageBookingSlots(prisma, booking.id, timeSlots, startTime);


      setTimeout(() => this.bookingExpiration(booking.id), parseFloat(process.env.BOOKING_EXPIRE_TIME_MIN) * 60 * 1000);

      return { ...booking, startTime, endTime };
    });
  }

  async bookingExpiration(bookingId: number) {

    return await this.prisma.$transaction(async (prisma) => {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status === 'pending') {
        const expiredBooking = await prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'expired' },
        });

        await prisma.bookingSlot.updateMany({
          where: { bookingId: bookingId },
          data: { date: null },
        });

        return expiredBooking;
      }

      return booking;
    });
  }

  async areTimeSlotsAvailable(prisma: any, timeSlotIds: number[], startDate: Date): Promise<boolean> {
    let currentStartDate = new Date(startDate);

    const neededDates = []
    for (let i = 0; i< timeSlotIds.length; i++){
      neededDates.push(new Date(currentStartDate.getTime() + 30 * i * 60000))
    }
    const count = await prisma.bookingSlot.count({
      where: {
        timeSlotId: {
          in: timeSlotIds,
        },
        date: {in:neededDates},
      },
    });

    return count === 0;
  }

  async fetchFacility(prisma: any, facilityId: number) {
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      select: { minBookingTime: true },
    });
    if (!facility) {
      throw new Error('Facility not found.');
    }
    return facility;
  }

  async fetchTimeSlots(prisma: any, timeSlotIds: number[]) {
    return await prisma.timeSlot.findMany({
      where: {
        id: { in: timeSlotIds },
        isActive: true,
      },
      orderBy: [{ startTime: 'asc' }],
    });
  }

  async verifyTimeSlots(timeSlots: any[], timeSlotIds: number[], minBookingTime: number) {
    if (timeSlots.length !== timeSlotIds.length) {
      throw new Error('One or more time slots are not available for booking.');
    }
    for (let i = 0; i < timeSlots.length - 1; i++) {
      if (timeSlots[i].endTime.getTime() !== timeSlots[i + 1].startTime.getTime()) {
        throw new Error('Time slots are not sequential.');
      }
    }
    const { totalPrice, totalDuration } = timeSlots.reduce(
        (acc, slot) => {
          acc.totalPrice += Number(slot.price || 0);
          acc.totalDuration += slot.endTime.getTime() - slot.startTime.getTime();
          return acc;
        },
        { totalPrice: 0, totalDuration: 0 }
    );

    let totalDurationInMinutes = totalDuration / (1000 * 60);
    if (totalDurationInMinutes < minBookingTime) {
      throw new Error('The total duration of selected time slots does not meet the minimum booking time required.');
    }
    return { totalPrice, totalDurationInMinutes };
  }

  async manageBookingSlots(prisma: any, bookingId: number, timeSlots: any[], startDate: Date) {
    let currentStartDate = new Date(startDate);
    const bookingSlotsData = timeSlots.map((slot) => {
      const bookingSlot = {
        bookingId,
        timeSlotId: slot.id,
        date: new Date(currentStartDate),
      };

      currentStartDate = new Date(currentStartDate.getTime() + 30 * 60000); // 30 minutes = 30 * 60 * 1000 milliseconds

      return bookingSlot;
    });

    return await prisma.bookingSlot.createMany({
      data: bookingSlotsData,
    });
  }


  async getCorrectDateTime(currentDate: Date, targetDayOfWeek: number, time: Date) {
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

  async getCorrectBookingTimes(currentDate = new Date(), timeSlots: any[]) {
    if (timeSlots.length === 0) {
      throw new Error('Time slots array is empty.');
    }

    const firstSlot = timeSlots[0];
    const lastSlot = timeSlots[timeSlots.length - 1];

    const startTime = await this.getCorrectDateTime(currentDate, firstSlot.dayOfWeek, firstSlot.startTime);
    const endTime = await this.getCorrectDateTime(currentDate, lastSlot.dayOfWeek, lastSlot.endTime);

    return { startTime, endTime };
  }

}
