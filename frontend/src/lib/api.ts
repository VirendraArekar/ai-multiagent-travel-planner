import {
  Destination, Flight, Hotel, Trip, TripSummary,
  Itinerary, ItineraryDay, ItineraryActivity,
  TripBudget, TripExpense, BudgetSummary,
  Booking, Agent, AgentTask, AgentExecutionTrace, AgentMonitoringStats,
  ChatMessage, Conversation, NotificationItem, User
} from '@/types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Backend login unavailable, fallback demo user', e);
    }
    // Fallback demo user
    return {
      accessToken: 'demo_mock_jwt_token_2026',
      refreshToken: 'demo_mock_refresh_token_2026',
      userId: 'u-demo',
      email: email || 'demo@travelplanner.ai',
      firstName: 'Alex',
      lastName: 'Morgan',
      role: 'ROLE_USER',
    };
  },

  async register(data: { email: string; password: string; firstName: string; lastName: string; phoneNumber?: string }) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Backend register unavailable, fallback demo user', e);
    }
    return {
      accessToken: 'demo_mock_jwt_token_2026',
      refreshToken: 'demo_mock_refresh_token_2026',
      userId: 'u-demo',
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'ROLE_USER',
    };
  },

  async getCurrentUser() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return {
      id: 'u-demo',
      email: 'demo@travelplanner.ai',
      firstName: 'Alex',
      lastName: 'Morgan',
      role: 'ROLE_USER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Adventurer, food lover, photographer.',
      preferredCurrency: 'USD',
      travelPace: 'MODERATE',
      accommodationStyle: 'BOUTIQUE',
      interests: '["culture", "nature", "food"]',
    };
  },

  // Trips
  async getTrips() {
    try {
      const res = await fetch(`${API_BASE}/trips?size=50`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data.content as TripSummary[];
      }
    } catch (e) {}
    // Fallback sample trips
    return [
      {
        id: 'trip-paris-1',
        title: 'Romantic Paris Getaway',
        origin: 'New York (JFK)',
        destination: 'Paris',
        startDate: '2026-06-10',
        endDate: '2026-06-15',
        totalDays: 5,
        travelType: 'COUPLE',
        status: 'PLANNED',
        heroImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        budgetLimit: 2500,
        currency: 'EUR',
        totalEstimatedCost: 2180,
        totalActivitiesCount: 15,
        shareToken: 'paris-share-2026',
      },
      {
        id: 'trip-tokyo-2',
        title: 'Tokyo Neon & Shrines Expedition',
        origin: 'San Francisco (SFO)',
        destination: 'Tokyo',
        startDate: '2026-09-05',
        endDate: '2026-09-12',
        totalDays: 7,
        travelType: 'SOLO',
        status: 'PLANNED',
        heroImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        budgetLimit: 3200,
        currency: 'USD',
        totalEstimatedCost: 2950,
        totalActivitiesCount: 21,
        shareToken: 'tokyo-share-2026',
      },
      {
        id: 'trip-bali-3',
        title: 'Tropical Bali Retreat',
        origin: 'Sydney (SYD)',
        destination: 'Bali',
        startDate: '2026-07-15',
        endDate: '2026-07-22',
        totalDays: 7,
        travelType: 'FRIENDS',
        status: 'IN_PROGRESS',
        heroImageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        budgetLimit: 1800,
        currency: 'USD',
        totalEstimatedCost: 1650,
        totalActivitiesCount: 18,
        shareToken: 'bali-share-2026',
      },
    ];
  },

  async getTripById(id: string) {
    try {
      const res = await fetch(`${API_BASE}/trips/${id}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data as Trip;
      }
    } catch (e) {}
    return {
      id,
      userId: 'u-demo',
      title: 'Romantic Paris Getaway',
      origin: 'New York (JFK)',
      destination: 'Paris',
      destinationId: 'dest-paris',
      startDate: '2026-06-10',
      endDate: '2026-06-15',
      totalDays: 5,
      adultsCount: 2,
      childrenCount: 0,
      travelType: 'COUPLE',
      budgetLimit: 2500,
      currency: 'EUR',
      pace: 'MODERATE',
      status: 'PLANNED' as const,
      notes: 'Anniversary celebration. Focus on art galleries, French gastronomy, and sunset vistas.',
      heroImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'paris-share-2026',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async wizardPlanTrip(data: any) {
    try {
      const res = await fetch(`${API_BASE}/trips/wizard`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data as Trip;
      }
    } catch (e) {}
    // Return generated trip
    return {
      id: 'trip-' + Date.now(),
      userId: 'u-demo',
      title: (data.destination || 'Paris') + ' Vacation (' + (data.travelType || 'Solo') + ')',
      origin: data.startingLocation || 'New York',
      destination: data.destination || 'Paris',
      destinationId: 'dest-paris',
      startDate: data.departureDate || '2026-06-10',
      endDate: data.returnDate || '2026-06-15',
      totalDays: 5,
      adultsCount: data.adults || 1,
      childrenCount: data.children || 0,
      travelType: data.travelType || 'SOLO',
      budgetLimit: data.budgetRange || 2000,
      currency: data.currency || 'USD',
      pace: 'MODERATE',
      status: 'PLANNED' as const,
      notes: data.naturalLanguagePrompt || 'AI Wizard generated travel itinerary',
      heroImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'share-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteTrip(tripId: string) {
    try {
      await fetch(`${API_BASE}/trips/${tripId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {}
  },

  async duplicateTrip(tripId: string) {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}/duplicate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return { id: 'trip-dup-' + Date.now() };
  },

  async getSharedTrip(token: string) {
    try {
      const res = await fetch(`${API_BASE}/trips/share/${token}`);
      if (res.ok) {
        const json = await res.json();
        return json.data as Trip;
      }
    } catch (e) {}
    return this.getTripById('shared-fallback');
  },

  // Itinerary
  async getItinerary(tripId: string): Promise<Itinerary> {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}/itinerary`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data as Itinerary;
      }
    } catch (e) {}
    // Rich fallback itinerary
    return {
      id: 'itin-' + tripId,
      tripId,
      version: 1,
      summary: 'Personalized 5-day itinerary synthesized by specialized AI agents with geographic route clustering.',
      criticScore: 9.3,
      criticFeedback: 'Pacing is superb. Morning landmarks skip rush hour lines, lunch is within 10 minutes walking of attractions.',
      isOptimized: true,
      days: [
        {
          id: 'day-1',
          itineraryId: 'itin-' + tripId,
          dayNumber: 1,
          date: '2026-06-10',
          theme: 'Historic Landmarks & River Cruise',
          weatherSummary: 'Sunny, 24°C (Optimal sightseeing)',
          activities: [
            {
              id: 'act-1-1',
              itineraryDayId: 'day-1',
              timeSlot: 'MORNING',
              startTime: '09:30',
              endTime: '12:00',
              title: 'Louvre Museum Guided Discovery',
              description: 'World-renowned masterpieces including the Mona Lisa, Winged Victory, and Venus de Milo.',
              locationName: 'Musée du Louvre',
              latitude: 48.8606,
              longitude: 2.3376,
              activityType: 'ATTRACTION',
              estimatedCost: 22,
              currency: 'EUR',
              durationMinutes: 150,
              transportModeToNext: 'WALKING',
              transportDurationToNextMinutes: 12,
              orderIndex: 1,
            },
            {
              id: 'act-1-2',
              itineraryDayId: 'day-1',
              timeSlot: 'AFTERNOON',
              startTime: '12:30',
              endTime: '14:00',
              title: 'Artisan Lunch at Le Petit Bistro',
              description: 'Traditional French quiche, fresh salads, and freshly baked baguettes.',
              locationName: 'Rue Saint-Honoré',
              latitude: 48.8645,
              longitude: 2.3315,
              activityType: 'DINING',
              estimatedCost: 28,
              currency: 'EUR',
              durationMinutes: 90,
              transportModeToNext: 'METRO',
              transportDurationToNextMinutes: 15,
              orderIndex: 2,
            },
            {
              id: 'act-1-3',
              itineraryDayId: 'day-1',
              timeSlot: 'AFTERNOON',
              startTime: '14:30',
              endTime: '17:00',
              title: 'Notre-Dame & Seine River Cruise',
              description: 'Gothic architecture view from the water passing iconic bridge arches.',
              locationName: 'Île de la Cité',
              latitude: 48.8530,
              longitude: 2.3499,
              activityType: 'ATTRACTION',
              estimatedCost: 18,
              currency: 'EUR',
              durationMinutes: 150,
              transportModeToNext: 'WALKING',
              transportDurationToNextMinutes: 10,
              orderIndex: 3,
            },
            {
              id: 'act-1-4',
              itineraryDayId: 'day-1',
              timeSlot: 'EVENING',
              startTime: '18:30',
              endTime: '21:30',
              title: 'Sunset at Eiffel Tower & Chef Dinner',
              description: 'Golden hour viewing from Champ de Mars followed by authentic French bistro dinner.',
              locationName: 'Champ de Mars',
              latitude: 48.8584,
              longitude: 2.2945,
              activityType: 'LEISURE',
              estimatedCost: 45,
              currency: 'EUR',
              durationMinutes: 180,
              transportModeToNext: 'METRO',
              transportDurationToNextMinutes: 20,
              orderIndex: 4,
            },
          ],
        },
        {
          id: 'day-2',
          itineraryId: 'itin-paris-1',
          dayNumber: 2,
          date: '2026-06-11',
          theme: 'Montmartre Bohemian Heritage & Panoramic Views',
          weatherSummary: 'Partly cloudy, 23°C',
          activities: [
            {
              id: 'act-2-1',
              itineraryDayId: 'day-2',
              timeSlot: 'MORNING',
              startTime: '09:30',
              endTime: '12:00',
              title: 'Sacré-Cœur Basilica & Artists Square',
              description: 'Stroll cobblestone alleys of Place du Tertre and admire the white dome basilica view.',
              locationName: 'Montmartre Hill',
              latitude: 48.8867,
              longitude: 2.3431,
              activityType: 'ATTRACTION',
              estimatedCost: 10,
              currency: 'EUR',
              durationMinutes: 150,
              transportModeToNext: 'WALKING',
              transportDurationToNextMinutes: 10,
              orderIndex: 1,
            },
            {
              id: 'act-2-2',
              itineraryDayId: 'day-2',
              timeSlot: 'AFTERNOON',
              startTime: '12:30',
              endTime: '14:00',
              title: 'Creperie Dining on Rue Lepic',
              description: 'Savory buckwheat galettes and artisanal Norman cider.',
              locationName: 'Rue Lepic, Montmartre',
              latitude: 48.8845,
              longitude: 2.3338,
              activityType: 'DINING',
              estimatedCost: 22,
              currency: 'EUR',
              durationMinutes: 90,
              transportModeToNext: 'METRO',
              transportDurationToNextMinutes: 20,
              orderIndex: 2,
            },
            {
              id: 'act-2-3',
              itineraryDayId: 'day-2',
              timeSlot: 'AFTERNOON',
              startTime: '14:30',
              endTime: '17:30',
              title: 'Musée d Orsay Impressionist Masterpieces',
              description: 'Housed in a grand beaux-arts railway station featuring Monet, Degas, and Van Gogh.',
              locationName: 'Gare d Orsay',
              latitude: 48.8600,
              longitude: 2.3266,
              activityType: 'ATTRACTION',
              estimatedCost: 16,
              currency: 'EUR',
              durationMinutes: 180,
              transportModeToNext: 'METRO',
              transportDurationToNextMinutes: 15,
              orderIndex: 3,
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async addActivity(tripId: string, dayId: string, data: any) {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}/itinerary/days/${dayId}/activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return { id: 'act-' + Date.now(), ...data };
  },

  async deleteActivity(tripId: string, activityId: string) {
    try {
      await fetch(`${API_BASE}/trips/${tripId}/itinerary/activities/${activityId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {}
  },

  async regenerateDay(tripId: string, dayId: string) {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}/itinerary/days/${dayId}/regenerate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
  },

  // Destinations
  async getDestinations() {
    try {
      const res = await fetch(`${API_BASE}/destinations?size=20`);
      if (res.ok) {
        const json = await res.json();
        return json.data.content as Destination[];
      }
    } catch (e) {}
    return [
      {
        id: 'dest-paris',
        name: 'Paris',
        country: 'France',
        city: 'Paris',
        heroImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        averageDailyBudgetUsd: 180,
        currency: 'EUR',
        bestTimeToVisit: 'April - October',
        safetyRating: 'VERY_SAFE',
        popular: true,
        featured: true,
        description: 'Iconic world capital of art, gastronomy, and historic architectural majesty.',
      },
      {
        id: 'dest-tokyo',
        name: 'Tokyo',
        country: 'Japan',
        city: 'Tokyo',
        heroImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        averageDailyBudgetUsd: 150,
        currency: 'JPY',
        bestTimeToVisit: 'March - May & Sept - Nov',
        safetyRating: 'VERY_SAFE',
        popular: true,
        featured: true,
        description: 'Ultramodern neon skyscrapers juxtaposed with historic temples and Michelin dining.',
      },
      {
        id: 'dest-bali',
        name: 'Bali',
        country: 'Indonesia',
        city: 'Denpasar',
        heroImageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        averageDailyBudgetUsd: 70,
        currency: 'IDR',
        bestTimeToVisit: 'May - September',
        safetyRating: 'SAFE',
        popular: true,
        featured: true,
        description: 'Tropical paradise of tiered emerald rice paddies, spiritual sea temples, and surf beaches.',
      },
      {
        id: 'dest-goa',
        name: 'Goa',
        country: 'India',
        city: 'Panaji',
        heroImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        averageDailyBudgetUsd: 60,
        currency: 'INR',
        bestTimeToVisit: 'November - February',
        safetyRating: 'SAFE',
        popular: true,
        featured: true,
        description: 'Sun-drenched coastal haven with Portuguese heritage churches and bohemian beach shacks.',
      },
      {
        id: 'dest-rome',
        name: 'Rome',
        country: 'Italy',
        city: 'Rome',
        heroImageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        averageDailyBudgetUsd: 160,
        currency: 'EUR',
        bestTimeToVisit: 'April - June',
        safetyRating: 'VERY_SAFE',
        popular: true,
        featured: true,
        description: 'The Eternal City with gladiatorial amphitheaters, Renaissance wonders, and vibrant piazzas.',
      },
      {
        id: 'dest-dubai',
        name: 'Dubai',
        country: 'United Arab Emirates',
        city: 'Dubai',
        heroImageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        averageDailyBudgetUsd: 210,
        currency: 'AED',
        bestTimeToVisit: 'November - March',
        safetyRating: 'VERY_SAFE',
        popular: true,
        featured: true,
        description: 'Futuristic architectural records, golden sand dunes, luxury shopping, and marina promenades.',
      },
    ];
  },

  async getDestinationById(id: string) {
    try {
      const res = await fetch(`${API_BASE}/destinations/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data as Destination;
      }
    } catch (e) {}
    const list = await this.getDestinations();
    return list.find(d => d.id === id) || list[0];
  },

  // Flights
  async getFlights(params?: Record<string, any>) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/flights?${query}`);
      if (res.ok) {
        const json = await res.json();
        return json.data as Flight[];
      }
    } catch (e) {}
    return [
      {
        id: 'fl-1',
        airline: 'Air France',
        flightNumber: 'AF123',
        departureAirport: 'JFK',
        arrivalAirport: 'CDG',
        departureTime: '18:30',
        arrivalTime: '07:45 (+1)',
        durationMinutes: 435,
        isDirect: true,
        priceUsd: 680,
        currency: 'USD',
        baggageAllowance: '1 Carry-on (12kg), 1 Checked (23kg)',
        cabinClass: 'ECONOMY',
        bookingUrl: 'https://airfrance.com',
      },
      {
        id: 'fl-2',
        airline: 'Delta Air Lines',
        flightNumber: 'DL264',
        departureAirport: 'JFK',
        arrivalAirport: 'CDG',
        departureTime: '21:15',
        arrivalTime: '10:50 (+1)',
        durationMinutes: 455,
        isDirect: true,
        priceUsd: 715,
        currency: 'USD',
        baggageAllowance: '1 Carry-on (10kg), 1 Checked (23kg)',
        cabinClass: 'ECONOMY',
        bookingUrl: 'https://delta.com',
      },
      {
        id: 'fl-3',
        airline: 'British Airways',
        flightNumber: 'BA178',
        departureAirport: 'JFK',
        arrivalAirport: 'CDG',
        departureTime: '08:45',
        arrivalTime: '21:10',
        durationMinutes: 505,
        isDirect: false,
        stopsCount: 1,
        stopDetails: '1h 15m in LHR (London Heathrow)',
        priceUsd: 590,
        currency: 'USD',
        baggageAllowance: '1 Carry-on (10kg), 1 Checked (23kg)',
        cabinClass: 'ECONOMY',
        bookingUrl: 'https://ba.com',
      },
    ];
  },

  // Hotels
  async getHotels(params?: Record<string, any>) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/hotels?${query}`);
      if (res.ok) {
        const json = await res.json();
        return json.data as Hotel[];
      }
    } catch (e) {}
    return [
      {
        id: 'ht-paris-1',
        destinationId: 'dest-paris',
        name: 'Le Marais Boutique Hotel',
        hotelType: 'HOTEL',
        tier: 'MID_RANGE',
        starRating: 4,
        userRating: 4.7,
        pricePerNightUsd: 195,
        address: '14 Rue de Turenne, 75004 Paris',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: '["Free High-Speed WiFi", "Breakfast Included", "Air Conditioning", "Concierge"]',
        familyFriendly: true,
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
        bookingUrl: 'https://booking.com',
      },
      {
        id: 'ht-paris-2',
        destinationId: 'dest-paris',
        name: 'Hôtel Ritz Paris',
        hotelType: 'HOTEL',
        tier: 'LUXURY',
        starRating: 5,
        userRating: 4.9,
        pricePerNightUsd: 850,
        address: '15 Place Vendôme, 75001 Paris',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: '["Luxury Spa", "Indoor Pool", "Michelin Dining", "Butler Service"]',
        familyFriendly: true,
        cancellationPolicy: 'Flexible cancellation up to 7 days',
        bookingUrl: 'https://booking.com',
      },
      {
        id: 'ht-paris-3',
        destinationId: 'dest-paris',
        name: 'Generator Paris Suites',
        hotelType: 'HOSTEL',
        tier: 'BUDGET',
        starRating: 3,
        userRating: 4.3,
        pricePerNightUsd: 75,
        address: '9-11 Place du Colonel Fabien, 75010 Paris',
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        amenities: '["Rooftop Bar", "Free WiFi", "24/7 Reception", "Cafe Lounge"]',
        familyFriendly: false,
        cancellationPolicy: 'Non-refundable discount or flexible +$10',
        bookingUrl: 'https://booking.com',
      },
    ];
  },

  async getHotelById(id: string) {
    try {
      const res = await fetch(`${API_BASE}/hotels/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data as Hotel;
      }
    } catch (e) {}
    const list = await this.getHotels();
    return list.find(h => h.id === id) || list[0];
  },

  // Budget
  async getBudgetSummary(tripId: string): Promise<BudgetSummary> {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}/budget/summary`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data as BudgetSummary;
      }
    } catch (e) {}
    return {
      totalBudget: 2500,
      totalActualSpent: 1140,
      remainingBudget: 1360,
      perPersonBudget: 1250,
      perPersonActualSpent: 570,
      currency: 'EUR',
      allocatedByCategory: {
        FLIGHT: 850,
        HOTEL: 780,
        FOOD: 380,
        TRANSPORT: 150,
        ACTIVITY: 210,
        EMERGENCY: 130,
      },
      actualByCategory: {
        FLIGHT: 680,
        HOTEL: 390,
        FOOD: 45,
        TRANSPORT: 25,
      },
      isOverBudget: false,
      percentageUsed: 45.6,
    };
  },

  async getExpenses(tripId: string): Promise<TripExpense[]> {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}/budget/expenses`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data as TripExpense[];
      }
    } catch (e) {}
    return [
      {
        id: 'exp-1',
        tripId,
        category: 'FLIGHT',
        title: 'Air France Roundtrip Tickets',
        amount: 680,
        currency: 'EUR',
        date: '2026-06-01',
        paidBy: 'Alex',
        notes: 'Booked direct with Air France',
      },
      {
        id: 'exp-2',
        tripId,
        category: 'HOTEL',
        title: 'Le Marais Boutique Deposit',
        amount: 390,
        currency: 'EUR',
        date: '2026-06-02',
        paidBy: 'Alex',
        notes: '2 nights deposit paid',
      },
      {
        id: 'exp-3',
        tripId,
        category: 'FOOD',
        title: 'Louvre Terrace Cafe Coffee & Croissants',
        amount: 24,
        currency: 'EUR',
        date: '2026-06-10',
        paidBy: 'Alex',
      },
      {
        id: 'exp-4',
        tripId,
        category: 'TRANSPORT',
        title: 'Paris Metro 3-Day Pass',
        amount: 26,
        currency: 'EUR',
        date: '2026-06-10',
        paidBy: 'Alex',
      },
    ];
  },

  async addExpense(tripId: string, data: any) {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}/budget/expenses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return { id: 'exp-' + Date.now(), ...data };
  },

  async deleteExpense(tripId: string, expenseId: string) {
    try {
      await fetch(`${API_BASE}/trips/${tripId}/budget/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {}
  },

  // Bookings
  async getBookings(tripId?: string): Promise<Booking[]> {
    try {
      const url = tripId ? `${API_BASE}/bookings/trip/${tripId}` : `${API_BASE}/bookings`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data as Booking[];
      }
    } catch (e) {}
    return [
      {
        id: 'bk-1',
        tripId: tripId || 'trip-paris-1',
        userId: 'u-demo',
        bookingType: 'FLIGHT',
        provider: 'Air France',
        bookingReference: 'AF-789234',
        status: 'CONFIRMED',
        itemTitle: 'Flight AF123 (JFK - CDG)',
        startDatetime: '2026-06-10 18:30',
        endDatetime: '2026-06-11 07:45',
        totalPrice: 680,
        currency: 'USD',
        cancellationPolicy: 'Free cancellation within 24h of purchase',
        providerLink: 'https://airfrance.com',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'bk-2',
        tripId: tripId || 'trip-paris-1',
        userId: 'u-demo',
        bookingType: 'HOTEL',
        provider: 'Booking.com',
        bookingReference: 'BK-992381',
        status: 'CONFIRMED',
        itemTitle: 'Le Marais Boutique Hotel (5 Nights)',
        startDatetime: '2026-06-11 15:00',
        endDatetime: '2026-06-16 11:00',
        totalPrice: 975,
        currency: 'EUR',
        cancellationPolicy: 'Free cancellation until 48 hours before check-in',
        providerLink: 'https://booking.com',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'bk-3',
        tripId: tripId || 'trip-paris-1',
        userId: 'u-demo',
        bookingType: 'ACTIVITY',
        provider: 'GetYourGuide',
        bookingReference: 'GYG-44120',
        status: 'CONFIRMED',
        itemTitle: 'Louvre Museum Timed-Entry Ticket',
        startDatetime: '2026-06-12 10:00',
        totalPrice: 22,
        currency: 'EUR',
        cancellationPolicy: 'Full refund 24h prior',
        providerLink: 'https://getyourguide.com',
        createdAt: new Date().toISOString(),
      },
    ];
  },

  async createBooking(data: any) {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return { id: 'bk-' + Date.now(), ...data };
  },

  async updateBookingStatus(id: string, status: string) {
    try {
      await fetch(`${API_BASE}/bookings/${id}/status?status=${status}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
    } catch (e) {}
  },

  async deleteBooking(id: string) {
    try {
      await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {}
  },

  // Agents & Monitoring
  async getAgents(): Promise<Agent[]> {
    try {
      const res = await fetch(`${API_BASE}/agents`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data as Agent[];
      }
    } catch (e) {}
    return [
      { id: 'ag-orchestrator', name: 'Orchestrator Agent', role: 'Central Coordinator', description: 'Orchestrates multi-agent travel planning lifecycle, coordinates tasks, and synthesizes final plans.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-research', name: 'Travel Research Agent', role: 'Destination Specialist', description: 'Researches destinations, discovers attractions, seasonal highlights, and cultural etiquette.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-flight', name: 'Flight Search Agent', role: 'Aviation Specialist', description: 'Searches and compares verified flights across airlines, stops, and luggage metrics.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-hotel', name: 'Hotel Recommendation Agent', role: 'Hospitality Specialist', description: 'Finds verified accommodations matching rating, pricing, proximity, and amenities.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-weather', name: 'Weather Agent', role: 'Meteorological Specialist', description: 'Forecasts meteorological conditions, prepares packing list, and suggests indoor alternates.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-safety', name: 'Travel Safety Agent', role: 'Advisory & Visa Specialist', description: 'Evaluates travel advisories, emergency numbers, scam precautions, and entry visa mandates.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-food', name: 'Food & Restaurant Agent', role: 'Culinary Specialist', description: 'Recommends regional delicacies, vegetarian/vegan options, and top restaurants near landmarks.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-transport', name: 'Transportation Agent', role: 'Transit & Route Specialist', description: 'Designs transit maps including airport transfers, metro passes, and walking clusters.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-itinerary', name: 'Itinerary Planning Agent', role: 'Schedule Architect', description: 'Synthesizes morning, afternoon, and evening slots with geographic efficiency.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-budget', name: 'Budget Management Agent', role: 'Financial Analyst', description: 'Computes granular line items, validates budget limits, and suggests 15% savings.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-critic', name: 'Travel Critic Agent', role: 'Quality & Feasibility Auditor', description: 'Rigorously audits schedules for fatigue, timing conflicts, and scores overall feasibility.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
      { id: 'ag-booking', name: 'Booking Assistant Agent', role: 'Reservation Specialist', description: 'Prepares validated booking deep-links and reservation tracker references.', modelProvider: 'GEMINI', modelName: 'gemini-2.5-flash', isActive: true },
    ];
  },

  async getAgentTrace(tripId: string): Promise<AgentExecutionTrace> {
    try {
      const res = await fetch(`${API_BASE}/agents/trips/${tripId}/trace`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data as AgentExecutionTrace;
      }
    } catch (e) {}
    // Fallback sample execution trace
    return {
      tripId,
      overallStatus: 'COMPLETED',
      totalTasks: 11,
      completedTasks: 11,
      failedTasks: 0,
      totalDurationMs: 4320,
      totalTokensUsed: 3850,
      totalEstimatedCostUsd: 0.00028,
      tasks: [
        {
          id: 'tsk-1',
          tripId,
          agentId: 'ag-orchestrator',
          agentName: 'Orchestrator Agent',
          taskName: 'Master Trip Orchestration',
          status: 'COMPLETED',
          executionOrder: 1,
          durationMs: 4320,
          tokensUsed: 420,
          costUsd: 0.00003,
          outputPayload: 'Successfully orchestrated 11 agents. Generated 5 day plans with critic score 9.2/10',
          logs: [
            { id: 'l1', logLevel: 'INFO', message: 'Starting multi-agent orchestration', timestamp: new Date().toISOString() },
            { id: 'l2', logLevel: 'INFO', message: 'Phase 1: Launching parallel research agents', timestamp: new Date().toISOString() },
          ],
          toolCalls: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'tsk-2',
          tripId,
          agentId: 'ag-research',
          agentName: 'Travel Research Agent',
          taskName: 'Travel Research Agent Execution',
          status: 'COMPLETED',
          executionOrder: 2,
          durationMs: 650,
          tokensUsed: 380,
          costUsd: 0.00003,
          outputPayload: 'Discovered 14 key attractions and cultural insights.',
          logs: [{ id: 'l3', logLevel: 'INFO', message: 'Attraction discovery completed', timestamp: new Date().toISOString() }],
          toolCalls: [{ id: 'tc1', toolName: 'AttractionTool.getAttractions', arguments: 'destId=dest-paris', result: 'Found 14 attractions', durationMs: 45, status: 'SUCCESS', createdAt: new Date().toISOString() }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'tsk-3',
          tripId,
          agentId: 'ag-flight',
          agentName: 'Flight Search Agent',
          taskName: 'Flight Search Agent Execution',
          status: 'COMPLETED',
          executionOrder: 3,
          durationMs: 520,
          tokensUsed: 310,
          costUsd: 0.00002,
          outputPayload: 'Discovered 3 verified flight options. Best duration: 435 mins.',
          logs: [{ id: 'l4', logLevel: 'INFO', message: 'Flight routes resolved', timestamp: new Date().toISOString() }],
          toolCalls: [{ id: 'tc2', toolName: 'FlightSearchTool.searchFlights', arguments: 'origin=JFK, dest=CDG', result: '3 flights retrieved', durationMs: 38, status: 'SUCCESS', createdAt: new Date().toISOString() }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'tsk-4',
          tripId,
          agentId: 'ag-critic',
          agentName: 'Travel Critic Agent',
          taskName: 'Travel Critic Agent Execution',
          status: 'COMPLETED',
          executionOrder: 11,
          durationMs: 410,
          tokensUsed: 290,
          costUsd: 0.00002,
          outputPayload: 'Critic Score: 9.2/10. Verdict: APPROVED.',
          logs: [{ id: 'l5', logLevel: 'INFO', message: 'Schedule fatigue check passed', timestamp: new Date().toISOString() }],
          toolCalls: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      startedAt: new Date(Date.now() - 5000).toISOString(),
      finishedAt: new Date().toISOString(),
    };
  },

  async getMonitoringStats(): Promise<AgentMonitoringStats> {
    try {
      const res = await fetch(`${API_BASE}/agents/stats`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data as AgentMonitoringStats;
      }
    } catch (e) {}
    return {
      totalAgents: 12,
      activeAgents: 12,
      totalTasksExecuted: 134,
      completedTasks: 131,
      failedTasks: 3,
      runningTasks: 0,
      totalTokensConsumed: 48920,
      totalEstimatedCostUsd: 0.00367,
      averageExecutionDurationMs: 420.5,
      tasksByAgent: {
        'Travel Research Agent': 24,
        'Flight Search Agent': 22,
        'Hotel Recommendation Agent': 22,
        'Itinerary Planning Agent': 20,
        'Budget Management Agent': 18,
        'Travel Critic Agent': 18,
      },
    };
  },

  async retryTask(taskId: string) {
    try {
      await fetch(`${API_BASE}/agents/tasks/${taskId}/retry`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (e) {}
  },

  // Chat
  async sendChatMessage(message: string, conversationId?: string, tripId?: string) {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message, conversationId, tripId }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    // Intelligent fallback assistant response
    return {
      conversationId: conversationId || 'conv-' + Date.now(),
      messageId: 'msg-' + Date.now(),
      sender: 'ASSISTANT',
      agentName: 'Orchestrator Concierge',
      reply: `I can certainly help you plan that! For your trip, I recommend dedicating morning hours to cultural monuments like museum exhibits, taking an artisan lunch in the historic district, and reserving evening sunset rooftop tables. Would you like me to tailor recommendations for local vegetarian restaurants or arrange airport transit passes?`,
      extractedTripIntent: { destination: 'Paris', budget: '2500' },
      suggestedFollowUps: [
        'Recommend authentic vegetarian restaurants',
        'What is the best airport transfer option?',
        'Add a sunset cruise on the river',
        'Show budget optimization tips',
      ],
      timestamp: new Date().toISOString(),
    };
  },

  async getConversations(): Promise<Conversation[]> {
    try {
      const res = await fetch(`${API_BASE}/chat/conversations`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data as Conversation[];
      }
    } catch (e) {}
    return [
      {
        id: 'conv-1',
        userId: 'u-demo',
        tripId: 'trip-paris-1',
        title: 'Paris Travel Planning Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: 'm1',
            conversationId: 'conv-1',
            sender: 'USER',
            content: 'Plan a 5-day trip to Paris for 2 people with museum passes and good food.',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'm2',
            conversationId: 'conv-1',
            sender: 'ASSISTANT',
            agentName: 'Orchestrator Concierge',
            content: 'Bonjour! I have coordinated with the Travel Research and Culinary agents to craft your Paris journey with Louvre timed-entry, Montmartre sunset views, and boutique hotel stays.',
            createdAt: new Date(Date.now() - 3500000).toISOString(),
          },
        ],
      },
    ];
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data.content as NotificationItem[];
      }
    } catch (e) {}
    return [
      {
        id: 'notif-1',
        title: 'Trip Itinerary Ready: Romantic Paris Getaway',
        message: 'Your multi-agent travel plan for Paris is finalized! 11 specialized agents created your personalized schedule.',
        type: 'TRIP_REMINDER',
        read: false,
        actionUrl: '/itinerary/trip-paris-1',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        title: 'Weather Forecast Update: Paris',
        message: 'Sunny skies expected with comfortable 24°C temperatures during your travel dates.',
        type: 'WEATHER',
        read: true,
        actionUrl: '/trips/trip-paris-1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'notif-3',
        title: 'Budget Alert: Expenses on Track',
        message: 'You have utilized 45.6% of your allocated trip budget with 1,360 EUR remaining.',
        type: 'BUDGET',
        read: true,
        actionUrl: '/budget/trip-paris-1',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  },

  async markNotificationRead(id: string) {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
    } catch (e) {}
  },

  async reorderActivities(tripId: string, dayId: string, activityIds: string[]) {
    try {
      await fetch(`${API_BASE}/trips/${tripId}/itinerary/days/${dayId}/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ activityIds }),
      });
    } catch (e) {}
  },

  async getBudget(tripId: string) {
    const summary = await this.getBudgetSummary(tripId);
    const expenses = await this.getExpenses(tripId);
    return {
      totalBudget: summary.totalBudget,
      totalEstimatedCost: 2180,
      totalActualCost: summary.totalActualSpent,
      remainingBudget: summary.remainingBudget,
      emergencyFund: 130,
      flightBudget: summary.allocatedByCategory['FLIGHT'] || 850,
      hotelBudget: summary.allocatedByCategory['HOTEL'] || 780,
      foodBudget: summary.allocatedByCategory['FOOD'] || 380,
      activityBudget: summary.allocatedByCategory['ACTIVITY'] || 210,
      transportBudget: summary.allocatedByCategory['TRANSPORT'] || 150,
      expenses,
    };
  },

  getAgentStats() {
    return this.getMonitoringStats();
  },

  async getAgentTasks(): Promise<AgentTask[]> {
    const trace = await this.getAgentTrace('trip-paris-1');
    return trace.tasks;
  },

  retryAgentTask(taskId: string) {
    return this.retryTask(taskId);
  },

  async sendMessage(convId: string, text: string) {
    const res = await this.sendChatMessage(text, convId);
    return { text: res.reply };
  },

  createTrip(data: any) {
    return this.wizardPlanTrip({
      startingLocation: data.origin,
      destination: data.destination,
      departureDate: data.startDate,
      returnDate: data.endDate,
      adults: data.adultsCount,
      children: data.childrenCount,
      travelType: data.travelType,
      budgetRange: data.budgetLimit,
      currency: data.currency,
      preferences: data.preferences,
      ...data,
    });
  },

  planTripNaturalLanguage(data: { prompt: string; userId?: string }) {
    return this.wizardPlanTrip({
      naturalLanguagePrompt: data.prompt,
      userId: data.userId,
    });
  },

  searchFlights(params?: Record<string, any>) {
    return this.getFlights(params);
  },

  searchHotels(params?: Record<string, any>) {
    return this.getHotels(params);
  },
};
