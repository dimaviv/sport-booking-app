export async function mergeFacilitiesWithRating(facilities, aggregateRating) {
    return await Promise.all(
        facilities.map(async (facility) => {
            const facilityId = facility.id;
            const matchedAggregate = aggregateRating.find((item) => item.facilityId === facilityId);

            return {
                ...facility,
                ratingCount: matchedAggregate?._count?.id || 0,
                avgRating: matchedAggregate?._avg?.value || 0,
            };
        })
    );
}

export async function mergeArraysByField(primaryArray, secondaryArray, primaryField, secondaryField) {
    return await Promise.all(
        primaryArray.map(async (primaryItem) => {
            const primaryFieldValue = primaryItem[primaryField];
            const matchingSecondaryItem = secondaryArray.find(
                (secondaryItem) => secondaryItem[secondaryField] === primaryFieldValue
            );

            return {
                ...primaryItem,
                ...(matchingSecondaryItem || {}),
            };
        })
    );
}
