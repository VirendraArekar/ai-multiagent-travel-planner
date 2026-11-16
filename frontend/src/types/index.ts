export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region?: string;
  city?: string;
  iataCode?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  heroImageUrl?: string;
  averageDailyBudgetUsd?: number;
  averageDailyCostUsd?: number;
  currency?: string;
  bestTimeToVisit?: string;
  safetyRating?: string;
  safetyScore?: number;
  tags?: string[];
  attractions?: any[];
  popular?: boolean;
  featured?: boolean;
}

export interface Attraction {
  id: string;
  destinationId: string;
  name: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
  estimatedDurationMinutes?: number;
  entryFeeUsd?: number;
  openingHours?: string;
  recommendedTimeOfDay?: string;
  isIndoor?: boolean;
}

export interface Hotel {
  id: string;
  destinationId: string;
  name: string;
  city?: string;
  hotelType?: string;
  tier?: string;
  starRating?: number;
  userRating?: number;
  reviewScore?: number;
  reviewsCount?: number;
  pricePerNight?: number;
  pricePerNightUsd?: number;
  currency?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  heroImageUrl?: string;
  amenities?: string | string[];
  distanceToCenterKm?: number;
  familyFriendly?: boolean;
  cancellationPolicy?: string;
  bookingUrl?: string;
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode?: string;
  flightNumber: string;
  departureAirport?: string;
  arrivalAirport?: string;
  originAirport?: string;
  destinationAirport?: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  isDirect?: boolean;
  stops?: number;
  stopsCount?: number;
  stopDetails?: string;
  price?: number;
  priceUsd?: number;
  currency?: string;
  baggageAllowance?: string;
  cabinClass?: string;
  bookingUrl?: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  origin: string;
  destination: string;
  destinationId?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  adultsCount: number;
  childrenCount: number;
  travelType: string;
  budgetLimit?: number;
  currency: string;
  pace: string;
  status: 'DRAFT' | 'PLANNING' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  heroImageUrl?: string;
  isPublic: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripSummary {
  id: string;
  title: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  travelType: string;
  status: string;
  heroImageUrl?: string;
  budgetLimit?: number;
  currency: string;
  totalEstimatedCost?: number;
  totalActivitiesCount?: number;
  shareToken?: string;
}

export interface ItineraryActivity {
  id: string;
  itineraryDayId?: string;
  timeSlot?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  timeOfDay?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
  title: string;
  description?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  activityType?: string;
  estimatedCost?: number;
  currency?: string;
  durationMinutes?: number;
  transportModeToNext?: string;
  transportDurationToNextMinutes?: number;
  orderIndex?: number;
  bookingReference?: string;
}

export interface ItineraryDay {
  id: string;
  itineraryId?: string;
  dayNumber: number;
  title?: string;
  description?: string;
  date?: string;
  theme?: string;
  weatherSummary?: string;
  notes?: string;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  id: string;
  tripId: string;
  version?: number;
  title?: string;
  summary?: string;
  criticScore?: number;
  criticFeedback?: string;
  isOptimized?: boolean;
  days: ItineraryDay[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TripBudget {
  id: string;
  tripId: string;
  totalBudget: number;
  flightsAllocated: number;
  hotelsAllocated: number;
  transportAllocated: number;
  foodAllocated: number;
  activitiesAllocated: number;
  emergencyAllocated: number;
  currency: string;
}

export interface TripExpense {
  id: string;
  tripId: string;
  category: string;
  title: string;
  amount: number;
  currency: string;
  date: string;
  paidBy?: string;
  paymentMethod?: string;
  notes?: string;
  receiptUrl?: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalActualSpent: number;
  remainingBudget: number;
  perPersonBudget: number;
  perPersonActualSpent: number;
  currency: string;
  allocatedByCategory: Record<string, number>;
  actualByCategory: Record<string, number>;
  isOverBudget: boolean;
  percentageUsed: number;
}

export interface Booking {
  id: string;
  tripId?: string;
  userId: string;
  bookingType: string;
  provider: string;
  bookingReference?: string;
  status: string;
  itemTitle: string;
  startDatetime?: string;
  endDatetime?: string;
  totalPrice?: number;
  currency: string;
  cancellationPolicy?: string;
  providerLink?: string;
  notes?: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  modelProvider: string;
  modelName: string;
  isActive: boolean;
}

export interface AgentExecutionLog {
  id: string;
  logLevel: string;
  message: string;
  timestamp: string;
}

export interface AgentToolCall {
  id: string;
  toolName: string;
  arguments: string;
  result: string;
  durationMs: number;
  status: string;
  createdAt: string;
}

export interface AgentTask {
  id: string;
  tripId: string;
  agentId: string;
  agentName: string;
  taskName: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRYING' | 'WAITING_FOR_USER';
  inputPayload?: string;
  outputPayload?: string;
  errorMessage?: string;
  retryCount?: number;
  executionOrder?: number;
  durationMs?: number;
  tokensUsed?: number;
  costUsd?: number;
  logs?: AgentExecutionLog[];
  toolCalls?: AgentToolCall[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AgentExecutionTrace {
  tripId: string;
  overallStatus: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  totalDurationMs: number;
  totalTokensUsed: number;
  totalEstimatedCostUsd: number;
  tasks: AgentTask[];
  startedAt: string;
  finishedAt: string;
}

export interface AgentMonitoringStats {
  totalAgents: number;
  activeAgents: number;
  totalTasksExecuted: number;
  completedTasks: number;
  failedTasks: number;
  runningTasks: number;
  totalTokensConsumed: number;
  totalEstimatedCostUsd: number;
  averageExecutionDurationMs: number;
  tasksByAgent: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  agentName?: string;
  tokensUsed?: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  tripId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  isRead?: boolean;
  actionUrl?: string;
  link?: string;
  createdAt: string;
}
