-- =============================================================================
-- Migration V2: Initial Seed Data for Destinations, Agents, and Default Users
-- =============================================================================

-- 1. Roles
INSERT INTO roles (id, name, description) VALUES
('r-101', 'ROLE_USER', 'Standard Travel Planner User'),
('r-102', 'ROLE_ADMIN', 'Platform Administrator'),
('r-103', 'ROLE_AGENT_OPERATOR', 'AI Agent System Operator');

-- 2. Default Admin and Demo Users
-- Password is 'Password123!' (BCrypt hash: $2a$10$7s9G8iVvjE... or standard BCrypt)
-- Hash below is for 'Password123!': $2a$10$4yOaT5vH8s8h1T51aYmO4OXn/0mQeE.sT9gO/rVb8tK8A7JvV17Iu
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, is_email_verified) VALUES
('u-admin', 'admin@travelplanner.ai', '$2a$10$CwTycUXWue0Thq9StjUM0uGzfv/bTsmZkmkYwZfA6hWJvhRk21sY2', 'Sarah', 'Connor', 'ROLE_ADMIN', true, true),
('u-demo', 'demo@travelplanner.ai', '$2a$10$CwTycUXWue0Thq9StjUM0uGzfv/bTsmZkmkYwZfA6hWJvhRk21sY2', 'Alex', 'Morgan', 'ROLE_USER', true, true);

INSERT INTO user_profiles (id, user_id, bio, preferred_language, home_airport, dietary_preferences) VALUES
('up-demo', 'u-demo', 'Global explorer, food enthusiast, photography lover.', 'en', 'JFK', 'Vegetarian friendly');

INSERT INTO user_preferences (id, user_id, preferred_currency, travel_pace, accommodation_style, interests) VALUES
('pref-demo', 'u-demo', 'USD', 'MODERATE', 'BOUTIQUE', '["culture", "food", "nature", "architecture"]');

-- 3. Register the 11 Specialized AI Agents
INSERT INTO agents (id, name, role, description, system_prompt, model_provider, model_name, is_active) VALUES
('ag-orchestrator', 'Orchestrator Agent', 'Central Coordinator', 'Orchestrates the entire multi-agent travel planning lifecycle, coordinates tasks, handles fallbacks and synthesizes final plans.', 'You are the Master Travel Orchestrator Agent. You parse requirements, decompose goals into subtasks, invoke specialist agents, reconcile outputs, and ensure cohesive itineraries.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-research', 'Travel Research Agent', 'Destination Specialist', 'Researches destinations, discovers hidden gems, highlights cultural customs, and evaluates travel feasibility.', 'You are the Travel Research Agent. Your mission is to provide authentic, accurate, and deeply insightful destination research, attractions, seasonality, and local customs.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-flight', 'Flight Search Agent', 'Aviation Specialist', 'Discovers and compares real flights across airlines, stops, cabin classes, and calculates baggage and layover metrics.', 'You are the Flight Search Specialist. You find the best flight options considering duration, price, layovers, and luggage allowance without inventing fake schedules.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-hotel', 'Hotel Recommendation Agent', 'Hospitality Specialist', 'Finds verified accommodations comparing pricing, ratings, location proximity, and family or couple suitability.', 'You are the Hotel Recommendation Agent. You curate top-rated accommodations that match traveler preferences, proximity to attractions, and budget tier.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-itinerary', 'Itinerary Planning Agent', 'Schedule Architect', 'Synthesizes attractions, travel times, and dining into realistic day-by-day schedules optimized by geographic cluster.', 'You are the Itinerary Planning Agent. You create day-by-day schedules with morning, afternoon, and evening slots, avoiding rushed transit or impossible physical timings.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-budget', 'Budget Management Agent', 'Financial Analyst', 'Calculates detailed cost breakdowns across flights, hotels, transit, food, activities, and emergency buffers.', 'You are the Budget Management Agent. You estimate granular line-item costs, verify total trip budget constraints, and provide actionable money-saving advice.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-transport', 'Transportation Agent', 'Transit & Route Specialist', 'Analyzes local transit modes including metro, taxis, walking routes, rental cars, and airport connections.', 'You are the Transportation Specialist. You recommend optimal transit between points of interest with realistic duration, route clarity, and pricing.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-weather', 'Weather Agent', 'Meteorological Specialist', 'Checks destination forecast patterns, rainy periods, and adapts activities with indoor alternatives.', 'You are the Weather Specialist. You provide meteorological forecasts, season analysis, pack lists, and suggest rain-proof activity alternatives.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-food', 'Food & Restaurant Agent', 'Culinary Specialist', 'Recommends iconic regional dishes, dietary-tailored restaurants (vegetarian/vegan/halal), and dining spots near attractions.', 'You are the Culinary & Restaurant Specialist. You find memorable food experiences, authentic local restaurants, and cater to all dietary needs.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-safety', 'Travel Safety Agent', 'Advisory & Visa Specialist', 'Evaluates destination security, official travel advisories, visa entry mandates, emergency contacts, and scam precautions.', 'You are the Travel Safety Specialist. You provide authoritative safety advice, emergency contacts, common scams to avoid, and entry visa requirements.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-critic', 'Travel Critic Agent', 'Quality & Feasibility Auditor', 'Audits draft itineraries for schedule fatigue, transit feasibility, opening hours, budget overflows, and scores plans.', 'You are the Travel Critic Agent. You rigorously audit draft itineraries, scoring feasibility (1-10), pointing out flaws or timing conflicts, and demanding revisions if needed.', 'GEMINI', 'gemini-2.5-flash', true),

('ag-booking', 'Booking Assistant Agent', 'Reservation Specialist', 'Assists in preparing booking links, tracking confirmed reservation numbers, and handling cancellation notices.', 'You are the Booking Assistant Agent. You prepare validated booking links, structure reference trackers, and detail cancellation terms.', 'GEMINI', 'gemini-2.5-flash', true);

-- 4. Featured Global Destinations
INSERT INTO destinations (id, name, country, region, city, iata_code, latitude, longitude, description, hero_image_url, average_daily_budget_usd, currency, best_time_to_visit, safety_rating, popular, featured) VALUES
('dest-paris', 'Paris', 'France', 'Europe', 'Paris', 'CDG', 48.8566, 2.3522, 'The City of Light captivates travelers with monumental architecture, world-renowned museums, vibrant bistros, and iconic haute cuisine.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', 180.00, 'EUR', 'April to October', 'VERY_SAFE', true, true),

('dest-tokyo', 'Tokyo', 'Japan', 'Asia', 'Tokyo', 'HND', 35.6762, 139.6503, 'A dazzling blend of ultramodern neon skyscrapers and serene historic shrines, celebrated for world-class gastronomy and seamless transit.', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', 150.00, 'JPY', 'March to May & Sept to Nov', 'VERY_SAFE', true, true),

('dest-bali', 'Bali', 'Indonesia', 'Southeast Asia', 'Denpasar', 'DPS', -8.4095, 115.1889, 'An Indonesian tropical paradise famed for emerald rice terraces, spiritual temples, vibrant surfing beaches, and wellness sanctuaries.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', 70.00, 'IDR', 'May to September', 'SAFE', true, true),

('dest-goa', 'Goa', 'India', 'South Asia', 'Panaji', 'GOI', 15.2993, 74.1240, 'India pocket of coastal paradise featuring sun-kissed beaches, Portuguese colonial churches, spice plantations, and lively beach shacks.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', 60.00, 'INR', 'November to February', 'SAFE', true, true),

('dest-rome', 'Rome', 'Italy', 'Europe', 'Rome', 'FCO', 41.9028, 12.4964, 'The Eternal City where ancient amphitheaters, Vatican treasures, and lively piazzas meet unmatched culinary tradition.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', 160.00, 'EUR', 'April to June & Sept to Oct', 'VERY_SAFE', true, true),

('dest-dubai', 'Dubai', 'United Arab Emirates', 'Middle East', 'Dubai', 'DXB', 25.2048, 55.2708, 'A futuristic metropolis renowned for awe-inspiring skyline records, desert safaris, luxury shopping, and golden coastline.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', 210.00, 'AED', 'November to March', 'VERY_SAFE', true, true),

('dest-nyc', 'New York City', 'United States', 'North America', 'New York', 'JFK', 40.7128, -74.0060, 'The vibrant cultural epicenter with Broadway theaters, Central Park, towering skyline views, and 24/7 eclectic energy.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', 250.00, 'USD', 'April to June & Sept to Nov', 'VERY_SAFE', true, true),

('dest-swiss', 'Interlaken & Swiss Alps', 'Switzerland', 'Europe', 'Interlaken', 'ZRH', 46.6863, 7.8632, 'Majestic snow-capped peaks, crystal-clear alpine lakes, world-class scenic trains, and thrilling mountain adventures.', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', 240.00, 'CHF', 'June to August & Dec to March', 'VERY_SAFE', true, true);

-- 5. Attractions for Destinations
INSERT INTO attractions (id, destination_id, name, category, description, image_url, latitude, longitude, rating, review_count, estimated_duration_minutes, entry_fee_usd, opening_hours, recommended_time_of_day, is_indoor) VALUES
('att-eiffel', 'dest-paris', 'Eiffel Tower', 'HISTORICAL', 'The iconic wrought-iron lattice monument on the Champ de Mars, offering panoramic views of Paris.', 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=800&q=80', 48.8584, 2.2945, 4.8, 142000, 150, 32.00, '09:00 - 23:45', 'EVENING', false),
('att-louvre', 'dest-paris', 'Louvre Museum', 'MUSEUM', 'The world biggest art museum and historic monument housing the Mona Lisa and Venus de Milo.', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', 48.8606, 2.3376, 4.9, 118000, 210, 22.00, '09:00 - 18:00 (Closed Tue)', 'MORNING', true),
('att-notredame', 'dest-paris', 'Notre-Dame Cathedral & Seine Cruise', 'CULTURAL', 'Gothic masterpiece on Île de la Cité paired with a scenic river tour past historic bridges.', 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=800&q=80', 48.8530, 2.3499, 4.7, 75000, 120, 18.00, '10:00 - 22:00', 'AFTERNOON', false),

('att-sensoji', 'dest-tokyo', 'Sensō-ji Temple & Asakusa', 'HISTORICAL', 'Tokyo oldest Buddhist temple, entered through the iconic Kaminarimon thunder gate with lively market stalls.', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80', 35.7148, 139.7967, 4.8, 86000, 120, 0.00, '06:00 - 17:00', 'MORNING', false),
('att-shibuya', 'dest-tokyo', 'Shibuya Crossing & Sky', 'CULTURAL', 'The world famous scramble intersection followed by Shibuya Sky 360-degree open-air observation deck.', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80', 35.6595, 139.7005, 4.8, 92000, 90, 18.00, '10:00 - 22:30', 'EVENING', false),
('att-teamlab', 'dest-tokyo', 'teamLab Planets Digital Art', 'MUSEUM', 'Immersive body-interactive digital art museum walking through water and floating flower gardens.', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80', 35.6491, 139.7898, 4.9, 64000, 120, 28.00, '09:00 - 22:00', 'AFTERNOON', true),

('att-ubud', 'dest-bali', 'Tegallalang Rice Terraces & Ubud Monkey Forest', 'NATURE', 'Lush green stepped paddy fields and sanctuary housing hundreds of Balinese long-tailed monkeys.', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80', -8.4332, 115.2798, 4.7, 48000, 180, 8.00, '08:00 - 18:00', 'MORNING', false),
('att-tanahlot', 'dest-bali', 'Tanah Lot Sea Temple', 'CULTURAL', 'Ancient Hindu pilgrimage temple perched upon a striking coastal rock formation famed for sunsets.', 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80', -8.6212, 115.0868, 4.8, 59000, 120, 5.00, '07:00 - 19:00', 'EVENING', false),

('att-anjuna', 'dest-goa', 'Anjuna & Vagator Beaches', 'BEACH', 'Famed for red cliffs, bohemian beach cafes, golden sunsets, and water sports activities.', 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80', 15.5807, 73.7432, 4.6, 32000, 240, 0.00, 'Open 24 hours', 'AFTERNOON', false),
('att-aguada', 'dest-goa', 'Fort Aguada & Lighthouse', 'HISTORICAL', '17th-century Portuguese fortress overlooking the Arabian Sea, offering panoramic coastal views.', 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=800&q=80', 15.4925, 73.7736, 4.5, 27000, 90, 2.00, '09:30 - 17:30', 'MORNING', false),

('att-colosseum', 'dest-rome', 'The Roman Colosseum & Forum', 'HISTORICAL', 'The majestic ancient Flavian amphitheater where gladiators once fought, heart of ancient Rome.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', 41.8902, 12.4922, 4.9, 134000, 180, 24.00, '08:30 - 19:15', 'MORNING', false),
('att-vatican', 'dest-rome', 'Vatican Museums & St. Peter Basilica', 'MUSEUM', 'Immense papal art collection featuring Michelangelo Sistine Chapel ceiling and glorious Renaissance basilica.', 'https://images.unsplash.com/photo-1548625361-1959828882a8?auto=format&fit=crop&w=800&q=80', 41.9029, 12.4534, 4.9, 150000, 240, 28.00, '08:00 - 18:00', 'AFTERNOON', true);

-- 6. Hotels
INSERT INTO hotels (id, destination_id, name, hotel_type, tier, star_rating, user_rating, price_per_night_usd, address, latitude, longitude, image_url, amenities, family_friendly, cancellation_policy, booking_url) VALUES
('ht-paris-1', 'dest-paris', 'Le Marais Boutique Hotel', 'HOTEL', 'MID_RANGE', 4, 4.6, 195.00, '14 Rue de Turenne, 75004 Paris', 48.8558, 2.3638, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', '["Free High-Speed WiFi", "Breakfast Included", "Air Conditioning", "Concierge Service", "Design Interior"]', true, 'Free cancellation until 48h before arrival', 'https://booking.com/paris-marais-hotel'),
('ht-paris-2', 'dest-paris', 'Hôtel Ritz Paris', 'HOTEL', 'LUXURY', 5, 4.9, 850.00, '15 Place Vendôme, 75001 Paris', 48.8679, 2.3292, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', '["Luxury Spa", "Indoor Heated Pool", "Michelin-starred Dining", "Butler Service", "Limousine Transfer"]', true, 'Flexible cancellation up to 7 days', 'https://booking.com/ritz-paris'),
('ht-paris-3', 'dest-paris', 'Generator Paris Hostel & Suites', 'HOSTEL', 'BUDGET', 3, 4.2, 75.00, '9-11 Place du Colonel Fabien, 75010 Paris', 48.8770, 2.3705, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', '["Rooftop Bar", "Free WiFi", "24/7 Reception", "Cafe & Lounge", "Shared & Private Rooms"]', false, 'Non-refundable discount or free cancel +$10', 'https://booking.com/generator-paris'),

('ht-tokyo-1', 'dest-tokyo', 'Park Hotel Tokyo Shiodome', 'HOTEL', 'MID_RANGE', 4, 4.7, 185.00, '1-7-1 Higashi-Shinbashi, Minato-ku, Tokyo', 35.6628, 139.7594, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', '["Artist Decorated Rooms", "Tokyo Tower View", "Direct Metro Access", "Free High-Speed WiFi"]', true, 'Free cancellation up to 24h prior', 'https://booking.com/park-hotel-tokyo'),
('ht-tokyo-2', 'dest-tokyo', 'Aman Tokyo', 'HOTEL', 'LUXURY', 5, 4.9, 980.00, 'Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo', 35.6866, 139.7645, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', '["Panoramic Cityscape", "Traditional Onsen & Spa", "30m Indoor Pool", "Fine Dining", "Whisky Lounge"]', false, 'Free cancellation up to 72 hours prior', 'https://booking.com/aman-tokyo'),

('ht-bali-1', 'dest-bali', 'Maya Ubud Resort & Spa', 'RESORT', 'MID_RANGE', 5, 4.8, 160.00, 'Jl. Gunung Sari, Peliatan, Ubud, Bali', -8.5085, 115.2818, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80', '["Infinity Jungle Pool", "Yoga Pavilion", "River Spa", "Organic Breakfast", "Shuttle to Ubud Center"]', true, 'Free cancellation up to 48 hours prior', 'https://booking.com/maya-ubud'),

('ht-goa-1', 'dest-goa', 'Taj Fort Aguada Resort & Spa', 'RESORT', 'LUXURY', 5, 4.8, 220.00, 'Sinquerim Beach, Candolim, Goa', 15.4985, 73.7690, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', '["Oceanfront Views", "Luxury Jiva Spa", "Multiple Specialty Restaurants", "Kids Activity Club"]', true, 'Free cancellation 72h prior', 'https://booking.com/taj-fort-aguada');

-- 7. Sample Flights
INSERT INTO flights (id, airline, airline_code, flight_number, departure_airport, arrival_airport, departure_time, arrival_time, duration_minutes, is_direct, stops_count, price_usd, baggage_allowance, cabin_class, booking_url) VALUES
('fl-1', 'Air France', 'AF', 'AF123', 'JFK', 'CDG', '18:30', '07:45 (+1)', 435, true, 0, 680.00, '1 Carry-on (12kg), 1 Checked (23kg)', 'ECONOMY', 'https://airfrance.com/flight/AF123'),
('fl-2', 'Delta Air Lines', 'DL', 'DL264', 'JFK', 'CDG', '21:15', '10:50 (+1)', 455, true, 0, 715.00, '1 Carry-on (10kg), 1 Checked (23kg)', 'ECONOMY', 'https://delta.com/flight/DL264'),
('fl-3', 'Japan Airlines', 'JL', 'JL005', 'JFK', 'HND', '11:45', '15:20 (+1)', 875, true, 0, 1150.00, '2 Checked Bags (23kg each)', 'ECONOMY', 'https://jal.co.jp/flight/JL005'),
('fl-4', 'IndiGo', '6E', '6E521', 'BOM', 'GOI', '08:15', '09:30', 75, true, 0, 58.00, '1 Hand bag (7kg), 1 Checked (15kg)', 'ECONOMY', 'https://goindigo.in/flight/6E521'),
('fl-5', 'Air India', 'AI', 'AI842', 'BOM', 'GOI', '14:20', '15:40', 80, true, 0, 62.00, '1 Hand bag (7kg), 1 Checked (20kg)', 'ECONOMY', 'https://airindia.com/flight/AI842'),
('fl-6', 'Emirates', 'EK', 'EK202', 'JFK', 'DXB', '23:00', '19:45 (+1)', 765, true, 0, 890.00, '1 Hand bag (7kg), 2 Checked (23kg each)', 'ECONOMY', 'https://emirates.com/flight/EK202');

-- 8. Restaurants
INSERT INTO restaurants (id, destination_id, name, cuisine_type, price_level, rating, review_count, address, latitude, longitude, famous_dishes, has_vegetarian_options, has_vegan_options) VALUES
('rst-paris-1', 'dest-paris', 'Bistrot Paul Bert', 'French Traditional', '$$$', 4.7, 2400, '18 Rue Paul Bert, 75011 Paris', 48.8523, 2.3847, 'Steak Frites, Paris-Brest, Roasted Duck Breast', true, false),
('rst-paris-2', 'dest-paris', 'Wild & The Moon', 'Organic Vegan', '$$', 4.6, 1100, '55 Rue Charlot, 75003 Paris', 48.8631, 2.3639, 'Acai Bowl, Truffle Mushroom Toast, Cold-pressed Juices', true, true),

('rst-tokyo-1', 'dest-tokyo', 'Afuri Ramen Ebisu', 'Japanese Ramen', '$$', 4.8, 3800, '1-1-7 Ebisu, Shibuya, Tokyo', 35.6477, 139.7121, 'Yuzu Shio Ramen, Vegan Green Ramen, Grilled Pork Chashu', true, true),
('rst-tokyo-2', 'dest-tokyo', 'Tsukiji Outer Market Food Stalls', 'Street Food & Seafood', '$', 4.7, 8500, '4 Chome Tsukiji, Chuo, Tokyo', 35.6655, 139.7708, 'Fresh Tamagoyaki, Tuna Donburi, Wagyu Skewers', true, false),

('rst-goa-1', 'dest-goa', 'Fishermans Wharf', 'Goan & Seafood', '$$', 4.7, 4200, 'At The Riverside, Mobor, Cavelossim, Goa', 15.1633, 73.9438, 'Goan Fish Curry, Prawn Balchão, Bebinca Dessert', true, false),
('rst-goa-2', 'dest-goa', 'Bean Me Up', 'Vegan Garden Cafe', '$$', 4.8, 1600, 'Deulvaddo, Ozran Beach Rd, Anjuna, Goa', 15.5898, 73.7485, 'Tempeh Burger, Mezze Platter, Avocado Lime Cake', true, true);
