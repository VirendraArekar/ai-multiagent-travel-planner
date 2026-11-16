package com.travelplanner.dto.itinerary;

import java.util.List;

public record ReorderActivitiesRequest(
    String targetDayId,
    List<String> orderedActivityIds
) {}
