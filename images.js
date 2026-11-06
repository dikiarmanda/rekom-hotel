// High quality aesthetic visuals pool (array of images per hotel)
const visualPool = {
  "PanaHouse Surabaya": [
    "https://images.trvl-media.com/lodging/43000000/42690000/42684000/42683925/b48f9c12.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  ],
  "Kampi Hotel Tunjungan": [
    "https://images.trvl-media.com/lodging/33000000/32570000/32567100/32567064/f4aca263.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  ],
  "Bobocabin Pacet": [
    "https://images.trvl-media.com/lodging/98000000/97060000/97058800/97058764/283bef04.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  ],
  "Royal Hotel and Villa Trawas": [
    "https://images.trvl-media.com/lodging/9000000/8320000/8310400/8310389/90b800a5.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  ],
  "Ecolodge Seloliman": [
    "https://images.trvl-media.com/lodging/9000000/8320000/8310400/8310389/90b800a5.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  ],
  "Luminor Hotel Airport Sidoarjo": [
    "https://images.trvl-media.com/lodging/9000000/8320000/8310400/8310389/90b800a5.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  ],
  "Platinum Hotel Tunjungan Surabaya": [
    "https://media-cdn.tripadvisor.com/media/photo-s/29/38/0b/f8/welcome-to-hotel-platinum.jpg",
  ],
  "DoubleTree by Hilton Surabaya": [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  ],
  "Bumi Surabaya City Resort": [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
  ],
  "Trans Luxury Hotel Surabaya": [
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
  ],
  "JW Marriott Hotel Surabaya": [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  ],
  "ASTON Sidoarjo City Hotel & Conference Center": [
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
  ],
  "Aston Mojokerto Hotel & Conference Center": [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
  ],
  "Hotel Tugu Malang": [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
  ],
  "The Shalimar Boutique Hotel": [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  ],
  "Grand Mercure Malang Mirama": [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
  ],
  "Shanaya Resort Malang": [
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
  ],
  "Ijen Suites Hotel": [
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  ],
  "Hotel Aria Gajayana Malang": [
    "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
  ],
  "Kertanegara Premium Guest House": [
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  ],
  "Boutique B21 Malang, Azana Hotels Collection": [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
  ],
  "Grand Citihub Hotel @kajoetangan": [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
  ],
};