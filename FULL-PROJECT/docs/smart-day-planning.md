# Smart Day Planning v1

## What it does
- Adds a Smart distribute attractions action to the editable Trip Planner.
- Distributes the city's attraction records across the current itinerary days and three slots (morning, afternoon, evening), sequentially, with up to three attractions per day.
- If attractions exceed the itinerary's slot capacity, remaining items are shown as flexible/overflow suggestions on the final evening slot.
- Requires confirmation because it replaces current slot text.

## Limitations
This is count-balanced scheduling only. It does not optimize geographic distance, opening hours, travel time, ticket availability, closures, or user preferences. Attraction records may be unverified. Users are explicitly warned to verify the itinerary.
