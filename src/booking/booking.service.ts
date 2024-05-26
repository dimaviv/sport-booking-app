import {Injectable} from '@nestjs/common';
import {CreateBookingInput} from './dto/create-booking.input';
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

    // Map through bookings and attach additional computed fields
    const updatedBookings = await Promise.all(bookings.map(async booking => {
      const timeSlots = booking.bookingSlots.map(slot => slot.timeSlot);
      const { startTime, endTime } = await this.getCorrectBookingTimes(currentDate, timeSlots);

      // Check if there's a rating by the user for the facility
      const userHasRated = booking.facility.ratings.length > 0;

      return { ...booking, startTime, endTime, facility: { ...booking.facility, userHasRated } };
    }));

    return { totalCount, bookings: updatedBookings };
  }

  async fetchFacility(facilityId) {
    const facility = await this.prisma.facility.findUnique({
      where: { id: facilityId },
      select: { minBookingTime: true },
    });
    if (!facility) {
      throw new Error('Facility not found.');
    }
    return facility;
  }

  async fetchTimeSlots(timeSlotIds) {
     return await this.prisma.timeSlot.findMany({
      where: {
        id: { in: timeSlotIds },
        isActive: true,
      },
      orderBy: [{ startTime: 'asc' }],
    });
  }

  async verifyTimeSlots(timeSlots, timeSlotIds, minBookingTime) {
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
    return { totalPrice, totalDurationInMinutes };
  }



  async manageBookingSlots(prisma, bookingId, timeSlots, startDate: Date) {
    console.log('startdate: ', startDate)
    let currentStartDate = new Date(startDate);
    const bookingSlotsData = timeSlots.map(slot => {
      const bookingSlot = {
        bookingId,
        timeSlotId: slot.id,
        date: new Date(currentStartDate),
      };

      currentStartDate = new Date(currentStartDate.getTime() + 30 * 60000); // 30 minutes = 30 * 60 * 1000 milliseconds

      return bookingSlot;
    });

    console.log(bookingSlotsData)

    return await prisma.bookingSlot.createMany({
      data: bookingSlotsData,
    });
  }

  async deleteBookingSlots(prisma, bookingId) {
    await prisma.bookingSlot.deleteMany({
      where: { bookingId: bookingId },
    });
  }

  async areTimeSlotsAvailable(prisma, timeSlotIds: number[], date: Date): Promise<boolean> {
    const onlyDate = new Date(date.setHours(0, 0, 0, 0));
    const count = await prisma.bookingSlot.count({
      where: {
        timeSlotId: {
          in: timeSlotIds,
        },
        date: onlyDate,
      },
    });

    return count === 0;
  }

  async create(createBookingInput: CreateBookingInput, userId: number) {
      const { facilityId, timeSlotIds } = createBookingInput;

      return await this.prisma.$transaction(async (prisma) => {
        const facility = await this.fetchFacility(facilityId);
        const timeSlots = await this.fetchTimeSlots(timeSlotIds);

        const isAvailable = await this.areTimeSlotsAvailable(prisma, timeSlotIds, new Date())

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
            facility: {include: {images: true, district: true, owner: {include: {userOwner: true}},}},
            bookingSlots:{
              include:{
                timeSlot: true
              }
            }}
        });

        const { startTime, endTime } = await this.getCorrectBookingTimes(new Date(), timeSlots);

        await this.manageBookingSlots(prisma, booking.id, timeSlots, startTime);


        return {...booking, startTime, endTime}
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
