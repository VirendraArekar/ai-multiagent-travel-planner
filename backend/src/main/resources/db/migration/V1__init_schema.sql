-- =============================================================================
-- Migration V1: AI Multi-Agent Travel Planner Initial Schema
-- Supports PostgreSQL & H2 (PostgreSQL compatibility mode)
-- =============================================================================

-- 1. Roles & Permissions
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_perm FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

-- 2. Users & User Profiles
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires_at TIMESTAMP,
    provider VARCHAR(50) DEFAULT 'LOCAL',
    provider_id VARCHAR(255),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    bio TEXT,
    date_of_birth DATE,
    nationality VARCHAR(100),
    passport_expiry DATE,
    preferred_language VARCHAR(20) DEFAULT 'en',
    home_airport VARCHAR(10),
    dietary_preferences VARCHAR(255),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    preferred_currency VARCHAR(10) DEFAULT 'USD',
    travel_pace VARCHAR(50) DEFAULT 'MODERATE', -- RELAXED, MODERATE, FAST_PACED
    accommodation_style VARCHAR(50) DEFAULT 'BOUTIQUE', -- BUDGET, BOUTIQUE, LUXURY, RESORT
    flight_preference VARCHAR(50) DEFAULT 'DIRECT_PREFERRED',
    interests TEXT, -- JSON string or comma-separated: history, nature, food, adventure, beach, nightlife
    budget_range VARCHAR(50) DEFAULT 'MEDIUM',
    email_notifications_enabled BOOLEAN DEFAULT TRUE,
    sms_notifications_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 3. Destinations & Attractions
CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    city VARCHAR(100),
    iata_code VARCHAR(10),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    description TEXT,
    hero_image_url VARCHAR(500),
    average_daily_budget_usd NUMERIC(10, 2) DEFAULT 120.00,
    currency VARCHAR(10) DEFAULT 'USD',
    best_time_to_visit VARCHAR(255),
    safety_rating VARCHAR(50) DEFAULT 'VERY_SAFE',
    popular BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(name);
CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country);

CREATE TABLE IF NOT EXISTS attractions (
    id VARCHAR(36) PRIMARY KEY,
    destination_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100), -- HISTORICAL, NATURE, CULTURAL, THEME_PARK, BEACH, MUSEUM
    description TEXT,
    image_url VARCHAR(500),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    estimated_duration_minutes INTEGER DEFAULT 120,
    entry_fee_usd NUMERIC(10, 2) DEFAULT 0.00,
    opening_hours VARCHAR(255),
    recommended_time_of_day VARCHAR(50) DEFAULT 'MORNING', -- MORNING, AFTERNOON, EVENING, ANY
    is_indoor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attractions_destination FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attractions_destination ON attractions(destination_id);

-- 4. Hotels & Accommodations
CREATE TABLE IF NOT EXISTS hotels (
    id VARCHAR(36) PRIMARY KEY,
    destination_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    hotel_type VARCHAR(50) DEFAULT 'HOTEL', -- HOTEL, RESORT, APARTMENT, HOSTEL, VILLA
    tier VARCHAR(50) DEFAULT 'MID_RANGE', -- BUDGET, MID_RANGE, LUXURY
    star_rating INTEGER DEFAULT 4,
    user_rating NUMERIC(3, 2) DEFAULT 4.2,
    price_per_night_usd NUMERIC(10, 2) NOT NULL,
    address VARCHAR(300),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url VARCHAR(500),
    amenities TEXT, -- JSON array string: Wifi, Pool, Gym, Spa, Breakfast, AC, Free Parking
    family_friendly BOOLEAN DEFAULT TRUE,
    cancellation_policy VARCHAR(255) DEFAULT 'Free cancellation up to 48 hours before check-in',
    booking_url VARCHAR(500),
    provider VARCHAR(50) DEFAULT 'AMADEUS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hotels_destination FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hotels_destination ON hotels(destination_id);

-- 5. Flights
CREATE TABLE IF NOT EXISTS flights (
    id VARCHAR(36) PRIMARY KEY,
    airline VARCHAR(100) NOT NULL,
    airline_code VARCHAR(10),
    flight_number VARCHAR(50) NOT NULL,
    departure_airport VARCHAR(10) NOT NULL,
    arrival_airport VARCHAR(10) NOT NULL,
    departure_time VARCHAR(50) NOT NULL,
    arrival_time VARCHAR(50) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_direct BOOLEAN DEFAULT TRUE,
    stops_count INTEGER DEFAULT 0,
    stop_details VARCHAR(255),
    price_usd NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    baggage_allowance VARCHAR(100) DEFAULT '1 Carry-on (7kg), 1 Checked (23kg)',
    cabin_class VARCHAR(50) DEFAULT 'ECONOMY',
    booking_url VARCHAR(500),
    provider VARCHAR(50) DEFAULT 'AMADEUS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_flights_airports ON flights(departure_airport, arrival_airport);

-- 6. Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id VARCHAR(36) PRIMARY KEY,
    destination_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    cuisine_type VARCHAR(100) NOT NULL,
    price_level VARCHAR(10) DEFAULT '$$', -- $, $$, $$$, $$$$
    rating NUMERIC(3, 2) DEFAULT 4.5,
    review_count INTEGER DEFAULT 150,
    address VARCHAR(300),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    famous_dishes TEXT,
    has_vegetarian_options BOOLEAN DEFAULT TRUE,
    has_vegan_options BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(500),
    reservation_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_restaurants_destination FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_restaurants_destination ON restaurants(destination_id);

-- 7. Trips
CREATE TABLE IF NOT EXISTS trips (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    origin VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    destination_id VARCHAR(36),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL DEFAULT 5,
    adults_count INTEGER NOT NULL DEFAULT 1,
    children_count INTEGER NOT NULL DEFAULT 0,
    travel_type VARCHAR(50) DEFAULT 'SOLO', -- SOLO, COUPLE, FAMILY, FRIENDS, BUSINESS, HONEYMOON, ADVENTURE
    budget_limit NUMERIC(12, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    pace VARCHAR(50) DEFAULT 'MODERATE',
    status VARCHAR(50) DEFAULT 'PLANNED', -- DRAFT, PLANNING, PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    notes TEXT,
    hero_image_url VARCHAR(500),
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_share_token ON trips(share_token);

CREATE TABLE IF NOT EXISTS trip_travelers (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    traveler_type VARCHAR(20) DEFAULT 'ADULT', -- ADULT, CHILD, INFANT
    dietary_requirements VARCHAR(255),
    passport_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_travelers_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- 8. Itineraries & Activities
CREATE TABLE IF NOT EXISTS itineraries (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL UNIQUE,
    version INTEGER DEFAULT 1,
    summary TEXT,
    critic_score NUMERIC(3, 1) DEFAULT 9.0,
    critic_feedback TEXT,
    is_optimized BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_itineraries_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS itinerary_days (
    id VARCHAR(36) PRIMARY KEY,
    itinerary_id VARCHAR(36) NOT NULL,
    day_number INTEGER NOT NULL,
    date DATE,
    theme VARCHAR(200),
    weather_summary VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_itinerary_days_itin FOREIGN KEY (itinerary_id) REFERENCES itineraries (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_itinerary_days_itin ON itinerary_days(itinerary_id);

CREATE TABLE IF NOT EXISTS itinerary_activities (
    id VARCHAR(36) PRIMARY KEY,
    itinerary_day_id VARCHAR(36) NOT NULL,
    time_slot VARCHAR(50) NOT NULL, -- MORNING, AFTERNOON, EVENING, NIGHT
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location_name VARCHAR(200),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    activity_type VARCHAR(50) DEFAULT 'ATTRACTION', -- ATTRACTION, DINING, TRANSPORT, LEISURE, CHECKIN
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    duration_minutes INTEGER DEFAULT 90,
    transport_mode_to_next VARCHAR(50), -- WALKING, METRO, TAXI, BUS, RENTAL_CAR
    transport_duration_to_next_minutes INTEGER,
    order_index INTEGER DEFAULT 0,
    booking_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_itinerary_acts_day FOREIGN KEY (itinerary_day_id) REFERENCES itinerary_days (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_itinerary_activities_day ON itinerary_activities(itinerary_day_id);

-- 9. Transportation Options
CREATE TABLE IF NOT EXISTS transportation_options (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL,
    transport_type VARCHAR(50) NOT NULL, -- FLIGHT, TRAIN, RENTAL_CAR, PRIVATE_TRANSFER, FERRY, BUS
    provider_name VARCHAR(100),
    departure_location VARCHAR(200),
    arrival_location VARCHAR(200),
    departure_time VARCHAR(50),
    arrival_time VARCHAR(50),
    duration_minutes INTEGER,
    estimated_cost NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    booking_reference VARCHAR(100),
    booking_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transport_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- 10. Budgets & Expenses
CREATE TABLE IF NOT EXISTS trip_budgets (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL UNIQUE,
    total_budget NUMERIC(12, 2) NOT NULL,
    flights_allocated NUMERIC(12, 2) DEFAULT 0.00,
    hotels_allocated NUMERIC(12, 2) DEFAULT 0.00,
    transport_allocated NUMERIC(12, 2) DEFAULT 0.00,
    food_allocated NUMERIC(12, 2) DEFAULT 0.00,
    activities_allocated NUMERIC(12, 2) DEFAULT 0.00,
    emergency_allocated NUMERIC(12, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_budgets_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trip_expenses (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL,
    category VARCHAR(50) NOT NULL, -- FLIGHT, HOTEL, TRANSPORT, FOOD, ACTIVITY, SHOPPING, MISC
    title VARCHAR(200) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    date DATE,
    paid_by VARCHAR(150),
    notes TEXT,
    receipt_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_expenses_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trip_expenses_trip ON trip_expenses(trip_id);

-- 11. Bookings & Travel Documents
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    booking_type VARCHAR(50) NOT NULL, -- FLIGHT, HOTEL, ACTIVITY, TRANSPORT
    provider VARCHAR(100) NOT NULL,
    booking_reference VARCHAR(100),
    status VARCHAR(50) DEFAULT 'CONFIRMED', -- INQUIRY, PENDING, CONFIRMED, CANCELLED
    item_title VARCHAR(200) NOT NULL,
    start_datetime VARCHAR(50),
    end_datetime VARCHAR(50),
    total_price NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    cancellation_policy TEXT,
    provider_link VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bookings_trip ON bookings(trip_id);

CREATE TABLE IF NOT EXISTS travel_documents (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- PASSPORT, VISA, BOARDING_PASS, HOTEL_VOUCHER, INSURANCE, OTHER
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_travel_docs_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,
    CONSTRAINT fk_travel_docs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 12. Favorites, Reviews & Shares
CREATE TABLE IF NOT EXISTS favorite_destinations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    destination_id VARCHAR(36) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_dest FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    destination_id VARCHAR(36),
    hotel_id VARCHAR(36),
    rating INTEGER NOT NULL,
    title VARCHAR(200),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shared_trips (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36) NOT NULL,
    shared_by_user_id VARCHAR(36) NOT NULL,
    recipient_email VARCHAR(255),
    permission VARCHAR(50) DEFAULT 'VIEW', -- VIEW, EDIT
    share_token VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shared_trips_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- 13. AI Conversations & Chat Messages
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    trip_id VARCHAR(36),
    title VARCHAR(200) DEFAULT 'Trip Planning Conversation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversations_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    sender VARCHAR(50) NOT NULL, -- USER, ASSISTANT, SYSTEM, ORCHESTRATOR, AGENT_CRITIC, etc.
    content TEXT NOT NULL,
    agent_name VARCHAR(100),
    metadata TEXT, -- JSON metadata
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_messages_conv FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON chat_messages(conversation_id);

-- 14. Multi-Agent Engine: Agents, Tasks, Logs & Tool Calls
CREATE TABLE IF NOT EXISTS agents (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    description TEXT,
    system_prompt TEXT,
    model_provider VARCHAR(50) DEFAULT 'GEMINI',
    model_name VARCHAR(100) DEFAULT 'gemini-2.5-flash',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_tasks (
    id VARCHAR(36) PRIMARY KEY,
    trip_id VARCHAR(36),
    agent_id VARCHAR(36) NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    task_name VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED, RETRYING, WAITING_FOR_USER
    input_payload TEXT,
    output_payload TEXT,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    execution_order INTEGER DEFAULT 1,
    duration_ms BIGINT DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    cost_usd NUMERIC(8, 5) DEFAULT 0.00000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agent_tasks_agent FOREIGN KEY (agent_id) REFERENCES agents (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_agent_tasks_trip ON agent_tasks(trip_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);

CREATE TABLE IF NOT EXISTS agent_execution_logs (
    id VARCHAR(36) PRIMARY KEY,
    agent_task_id VARCHAR(36) NOT NULL,
    log_level VARCHAR(20) DEFAULT 'INFO', -- DEBUG, INFO, WARN, ERROR
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agent_logs_task FOREIGN KEY (agent_task_id) REFERENCES agent_tasks (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agent_tool_calls (
    id VARCHAR(36) PRIMARY KEY,
    agent_task_id VARCHAR(36) NOT NULL,
    tool_name VARCHAR(100) NOT NULL,
    arguments TEXT,
    result TEXT,
    duration_ms BIGINT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'SUCCESS', -- SUCCESS, ERROR
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agent_tools_task FOREIGN KEY (agent_task_id) REFERENCES agent_tasks (id) ON DELETE CASCADE
);

-- 15. Notifications & Audit Logs
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    trip_id VARCHAR(36),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM', -- TRIP_REMINDER, DEPARTURE, WEATHER, BUDGET, BOOKING, SYSTEM
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
