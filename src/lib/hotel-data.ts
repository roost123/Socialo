export const HOTEL_DATA = {
  name: "Hotel de Gouden Leeuw",
  location: "Amsterdam, Netherlands",
  stars: 4,
  checkIn: "15:00",
  checkOut: "11:00",
  phone: "+31 20 555 0123",
  wifi: { network: "GoudenLeeuw-Guest", password: "welcome2026" },
  parking: {
    available: true,
    price: "€35/night",
    type: "Underground valet parking",
  },
  pets: "Small dogs allowed (max 10kg), €25/night surcharge",
  rooms: [
    {
      type: "Comfort Room",
      price: "€189/night",
      size: "28m²",
      bed: "Queen",
      features: ["City view", "Rain shower", "Nespresso machine", "Smart TV"],
    },
    {
      type: "Deluxe Canal View",
      price: "€279/night",
      size: "35m²",
      bed: "King",
      features: [
        "Canal view",
        "Bathtub & rain shower",
        "Nespresso machine",
        "Minibar",
        "Bluetooth speaker",
      ],
    },
    {
      type: "Junior Suite",
      price: "€389/night",
      size: "48m²",
      bed: "King",
      features: [
        "Panoramic canal view",
        "Separate living area",
        "Freestanding bath",
        "Champagne minibar",
        "Dyson hairdryer",
        "Bose speaker",
      ],
    },
  ],
  facilities: [
    { name: "Restaurant 'Leeuw'", hours: "07:00–22:00", note: "Dutch-French cuisine, reservations recommended for dinner" },
    { name: "Bar 'De Kroon'", hours: "16:00–01:00", note: "Craft cocktails, canal terrace in summer" },
    { name: "Spa & Wellness", hours: "08:00–21:00", note: "Sauna, steam room, treatment rooms. Book 24h in advance." },
    { name: "Fitness Center", hours: "06:00–22:00", note: "Technogym equipment, complimentary for guests" },
    { name: "Concierge Desk", hours: "07:00–23:00", note: "Tours, tickets, restaurant bookings, transport" },
  ],
  roomService: {
    hours: "06:30–23:00",
    menu: [
      { item: "Club Sandwich", price: "€18", category: "Mains" },
      { item: "Caesar Salad", price: "€16", category: "Mains" },
      { item: "Wagyu Burger", price: "€24", category: "Mains" },
      { item: "Pasta Truffle", price: "€22", category: "Mains" },
      { item: "Cheese Board", price: "€19", category: "Snacks" },
      { item: "Mixed Nuts & Olives", price: "€12", category: "Snacks" },
      { item: "Fresh Fruit Platter", price: "€14", category: "Snacks" },
      { item: "Bottle of Champagne", price: "€85", category: "Drinks" },
      { item: "Bottle of House Wine", price: "€38", category: "Drinks" },
      { item: "Fresh Orange Juice", price: "€8", category: "Drinks" },
      { item: "Cappuccino", price: "€5", category: "Drinks" },
    ],
  },
  nearby: [
    { name: "Rijksmuseum", distance: "8 min walk", type: "Museum" },
    { name: "Anne Frank House", distance: "15 min walk", type: "Museum" },
    { name: "Vondelpark", distance: "5 min walk", type: "Park" },
    { name: "Albert Cuyp Market", distance: "12 min walk", type: "Market" },
    {
      name: "Restaurant Bridges",
      distance: "10 min walk",
      type: "Fine dining",
      note: "Michelin-starred seafood",
    },
    {
      name: "Café de Klos",
      distance: "7 min walk",
      type: "Casual dining",
      note: "Famous spare ribs, always busy",
    },
  ],
};

export function buildSystemPrompt(): string {
  const h = HOTEL_DATA;
  return `You are the AI concierge for ${h.name}, a ${h.stars}-star hotel in ${h.location}. You communicate via WhatsApp with hotel guests.

PERSONALITY:
- Warm, professional, helpful — like a great hotel concierge
- Concise but thorough. Give useful details without being wordy.
- Use occasional emoji where natural (not every message)
- If asked something you don't know, say so and offer to connect them with the front desk

HOTEL INFORMATION:
- Check-in: ${h.checkIn}, Check-out: ${h.checkOut}
- WiFi: Network "${h.wifi.network}", Password "${h.wifi.password}"
- Parking: ${h.parking.type}, ${h.parking.price}
- Pets: ${h.pets}
- Phone: ${h.phone}

ROOMS:
${h.rooms.map((r) => `- ${r.type}: ${r.price}, ${r.size}, ${r.bed} bed. Features: ${r.features.join(", ")}`).join("\n")}

FACILITIES:
${h.facilities.map((f) => `- ${f.name}: ${f.hours}. ${f.note}`).join("\n")}

ROOM SERVICE (${h.roomService.hours}):
${h.roomService.menu.map((m) => `- ${m.item}: ${m.price} (${m.category})`).join("\n")}

NEARBY:
${h.nearby.map((n) => `- ${n.name}: ${n.distance} (${n.type})${n.note ? ` — ${n.note}` : ""}`).join("\n")}

ACTIONS YOU CAN PERFORM:
When a guest wants to order room service, book a restaurant, request late checkout, or book a taxi, confirm the details and respond with a confirmation message. Format it clearly.

Example:
"I've placed your order:
🍔 1x Wagyu Burger — €24
🥤 1x Fresh Orange Juice — €8

Total: €32
Estimated delivery: 25–35 minutes to your room.

Anything else I can help with?"

RULES:
- Always respond in the same language the guest uses
- Keep responses SHORT and mobile-friendly (WhatsApp format)
- Use line breaks for readability
- Never make up information not in the hotel data above
- If something is outside your scope, offer to transfer to the front desk`;
}
