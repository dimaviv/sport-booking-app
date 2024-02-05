/*
  Warnings:

  - You are about to alter the column `price` on the `TimeSlot` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,2)`.
  - Made the column `price` on table `TimeSlot` required. This step will fail if there are existing NULL values in that column.

*/

-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "avgPrice" DECIMAL(8,2),
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "ownerId" DROP NOT NULL,
ALTER COLUMN "coveringType" DROP NOT NULL,
ALTER COLUMN "facilityType" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "sportType" DROP NOT NULL;


-- AlterTable
ALTER TABLE "TimeSlot" ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(8,2);

-- Add triggers
CREATE OR REPLACE FUNCTION update_facility_avg_price()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Facility"
    SET "avgPrice" = (
        SELECT AVG(price)
        FROM "TimeSlot"
        WHERE "facilityId" = COALESCE(NEW."facilityId", OLD."facilityId")
        AND status IN ('available', 'booked')
    )
    WHERE id = COALESCE(NEW."facilityId", OLD."facilityId");

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER ts_update_facility_avg_price_after_insert_or_update
AFTER INSERT OR UPDATE ON "TimeSlot"
FOR EACH ROW
EXECUTE FUNCTION update_facility_avg_price();

CREATE TRIGGER ts_update_facility_avg_price_after_delete
AFTER DELETE ON "TimeSlot"
FOR EACH ROW
EXECUTE FUNCTION update_facility_avg_price();



