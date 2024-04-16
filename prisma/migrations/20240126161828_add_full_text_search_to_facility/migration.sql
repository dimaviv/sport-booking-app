
ALTER TABLE "Facility" ADD COLUMN "search_vector" TSVECTOR
  GENERATED ALWAYS AS (
    setweight(to_tsvector('russian', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('russian', coalesce(address, '')), 'B') ||
    setweight(to_tsvector('russian', coalesce(description, '')), 'C')
  ) STORED;


-- CreateIndex
CREATE INDEX "Facility_search_vector_idx" ON "Facility" USING GIN ("search_vector");

CREATE FUNCTION facility_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
     to_tsvector('russian', coalesce(new.name, '') || ' ' || coalesce(new.address, '') || ' ' || coalesce(new.description, ''));
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON "Facility" FOR EACH ROW EXECUTE FUNCTION facility_trigger();
