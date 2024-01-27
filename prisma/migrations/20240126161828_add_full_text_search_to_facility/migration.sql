-- AlterTable
ALTER TABLE "Facility" ADD COLUMN "search_vector" TSVECTOR
  GENERATED ALWAYS AS
    (setweight(to_tsvector('russian', coalesce(name, '')), 'A') ||
      setweight(to_tsvector('russian', coalesce(district, '')), 'B') ||
      setweight(to_tsvector('russian', coalesce(address, '')), 'B') ||
      setweight(to_tsvector('russian', coalesce(description, '')), 'C') )
  STORED;

-- CreateIndex
CREATE INDEX "Facility_search_vector_idx" ON "Facility" USING GIN ("search_vector");