// Comprehensive airport coordinates (latitude, longitude)
// Covers major airports worldwide for flight route map

export const airportCoordinates: Record<string, [number, number]> = {
  // ============================================
  // UNITED STATES
  // ============================================
  // California (Spotter HQ area)
  LAX: [33.9416, -118.4085],  // Los Angeles International
  SFO: [37.6213, -122.3790],  // San Francisco
  SAN: [32.7336, -117.1897],  // San Diego
  SJC: [37.3639, -121.9289],  // San Jose
  OAK: [37.7213, -122.2208],  // Oakland
  BUR: [34.2007, -118.3585],  // Burbank
  LGB: [33.8177, -118.1516],  // Long Beach
  ONT: [34.0560, -117.6012],  // Ontario
  SNA: [33.6757, -117.8682],  // Santa Ana/Orange County
  
  // East Coast
  JFK: [40.6413, -73.7781],   // New York JFK
  EWR: [40.6895, -74.1745],   // Newark
  LGA: [40.7769, -73.8740],   // LaGuardia
  BOS: [42.3656, -71.0096],   // Boston
  PHL: [39.8744, -75.2424],   // Philadelphia
  DCA: [38.8512, -77.0402],   // Washington Reagan
  IAD: [38.9531, -77.4565],   // Washington Dulles
  BWI: [39.1774, -76.6684],   // Baltimore
  MIA: [25.7959, -80.2870],   // Miami
  FLL: [26.0742, -80.1506],   // Fort Lauderdale
  MCO: [28.4312, -81.3081],   // Orlando
  TPA: [27.9756, -82.5333],   // Tampa
  ATL: [33.6407, -84.4277],   // Atlanta
  CLT: [35.2140, -80.9431],   // Charlotte
  RDU: [35.8801, -78.7880],   // Raleigh-Durham
  
  // Central US
  ORD: [41.9742, -87.9073],   // Chicago O'Hare
  MDW: [41.7868, -87.7522],   // Chicago Midway
  DFW: [32.8998, -97.0403],   // Dallas Fort Worth
  IAH: [29.9902, -95.3368],   // Houston Intercontinental
  HOU: [29.6454, -95.2789],   // Houston Hobby
  AUS: [30.1975, -97.6664],   // Austin
  DEN: [39.8561, -104.6737],  // Denver
  MSP: [44.8848, -93.2223],   // Minneapolis
  DTW: [42.2162, -83.3554],   // Detroit
  CLE: [41.4058, -81.8539],   // Cleveland
  STL: [38.7487, -90.3700],   // St. Louis
  MCI: [39.2976, -94.7139],   // Kansas City
  MSY: [29.9934, -90.2580],   // New Orleans
  
  // West Coast
  SEA: [47.4502, -122.3088],  // Seattle
  PDX: [45.5898, -122.5951],  // Portland
  PHX: [33.4373, -112.0078],  // Phoenix
  LAS: [36.0840, -115.1537],  // Las Vegas
  SLC: [40.7899, -111.9791],  // Salt Lake City
  
  // Hawaii & Alaska
  HNL: [21.3245, -157.9251],  // Honolulu
  OGG: [20.8986, -156.4305],  // Maui
  ANC: [61.1743, -149.9962],  // Anchorage

  // ============================================
  // INDIA
  // ============================================
  BLR: [13.1986, 77.7066],    // Bengaluru
  HYD: [17.2403, 78.4294],    // Hyderabad
  DEL: [28.5562, 77.1000],    // Delhi
  BOM: [19.0896, 72.8656],    // Mumbai
  MAA: [12.9941, 80.1709],    // Chennai
  CCU: [22.6547, 88.4467],    // Kolkata
  GOI: [15.3809, 73.8314],    // Goa
  COK: [10.1520, 76.3919],    // Kochi
  PNQ: [18.5822, 73.9197],    // Pune
  AMD: [23.0772, 72.6347],    // Ahmedabad
  JAI: [26.8242, 75.8122],    // Jaipur
  GAU: [26.1061, 91.5859],    // Guwahati
  TRV: [8.4821, 76.9199],     // Thiruvananthapuram
  IXC: [30.6735, 76.7885],    // Chandigarh
  LKO: [26.7606, 80.8893],    // Lucknow
  SXR: [33.9871, 74.7742],    // Srinagar
  IXB: [26.6812, 88.3286],    // Bagdogra
  VNS: [25.4524, 82.8593],    // Varanasi
  IXR: [23.3143, 85.3217],    // Ranchi
  PAT: [25.5913, 85.0880],    // Patna
  NAG: [21.0922, 79.0472],    // Nagpur
  IDR: [22.7218, 75.8011],    // Indore
  BBI: [20.2444, 85.8178],    // Bhubaneswar
  RPR: [21.1804, 81.7388],    // Raipur
  VTZ: [17.7212, 83.2245],    // Visakhapatnam
  CJB: [11.0300, 77.0434],    // Coimbatore
  IXM: [9.8345, 78.0934],     // Madurai
  TRZ: [10.7654, 78.7098],    // Tiruchirappalli
  MYQ: [12.2300, 76.6500],    // Mysore

  // ============================================
  // UNITED KINGDOM
  // ============================================
  LHR: [51.4700, -0.4543],    // London Heathrow
  LGW: [51.1537, -0.1821],    // London Gatwick
  STN: [51.8860, 0.2389],     // London Stansted
  LTN: [51.8747, -0.3683],    // London Luton
  LCY: [51.5048, 0.0495],     // London City
  MAN: [53.3537, -2.2750],    // Manchester
  BHX: [52.4539, -1.7480],    // Birmingham
  EDI: [55.9508, -3.3615],    // Edinburgh
  GLA: [55.8642, -4.4331],    // Glasgow
  BRS: [51.3827, -2.7190],    // Bristol
  NCL: [55.0375, -1.6917],    // Newcastle
  LPL: [53.3336, -2.8497],    // Liverpool
  BFS: [54.6575, -6.2158],    // Belfast
  ABZ: [57.2019, -2.1978],    // Aberdeen
  EMA: [52.8311, -1.3281],    // East Midlands
  SOU: [50.9503, -1.3568],    // Southampton
  CWL: [51.3967, -3.3433],    // Cardiff
  
  // ============================================
  // EUROPE
  // ============================================
  // France
  CDG: [49.0097, 2.5479],     // Paris Charles de Gaulle
  ORY: [48.7233, 2.3794],     // Paris Orly
  NCE: [43.6584, 7.2159],     // Nice
  LYS: [45.7256, 5.0811],     // Lyon
  MRS: [43.4393, 5.2214],     // Marseille
  TLS: [43.6291, 1.3639],     // Toulouse
  BOD: [44.8283, -0.7156],    // Bordeaux
  
  // Germany
  FRA: [50.0379, 8.5622],     // Frankfurt
  MUC: [48.3537, 11.7750],    // Munich
  BER: [52.3667, 13.5033],    // Berlin
  DUS: [51.2895, 6.7668],     // Dusseldorf
  HAM: [53.6304, 9.9882],     // Hamburg
  CGN: [50.8659, 7.1427],     // Cologne
  STR: [48.6899, 9.2220],     // Stuttgart
  
  // Netherlands
  AMS: [52.3105, 4.7683],     // Amsterdam
  RTM: [51.9569, 4.4372],     // Rotterdam
  EIN: [51.4501, 5.3743],     // Eindhoven
  
  // Spain
  MAD: [40.4983, -3.5676],    // Madrid
  BCN: [41.2974, 2.0833],     // Barcelona
  PMI: [39.5517, 2.7388],     // Palma de Mallorca
  AGP: [36.6749, -4.4991],    // Malaga
  ALC: [38.2822, -0.5582],    // Alicante
  VLC: [39.4893, -0.4816],    // Valencia
  SVQ: [37.4180, -5.8931],    // Seville
  IBZ: [38.8729, 1.3731],     // Ibiza
  TFS: [28.0445, -16.5725],   // Tenerife South
  LPA: [27.9319, -15.3866],   // Gran Canaria
  
  // Italy
  FCO: [41.8003, 12.2389],    // Rome Fiumicino
  MXP: [45.6306, 8.7281],     // Milan Malpensa
  LIN: [45.4451, 9.2768],     // Milan Linate
  VCE: [45.5053, 12.3519],    // Venice
  NAP: [40.8860, 14.2908],    // Naples
  BGY: [45.6739, 9.7042],     // Bergamo
  BLQ: [44.5354, 11.2887],    // Bologna
  FLR: [43.8100, 11.2051],    // Florence
  PSA: [43.6839, 10.3927],    // Pisa
  CAG: [39.2515, 9.0543],     // Cagliari
  CTA: [37.4668, 15.0664],    // Catania
  PMO: [38.1760, 13.0999],    // Palermo
  
  // Switzerland
  ZRH: [47.4647, 8.5492],     // Zurich
  GVA: [46.2370, 6.1092],     // Geneva
  BSL: [47.5990, 7.5291],     // Basel
  
  // Austria
  VIE: [48.1103, 16.5697],    // Vienna
  SZG: [47.7933, 13.0043],    // Salzburg
  INN: [47.2602, 11.3440],    // Innsbruck
  
  // Belgium
  BRU: [50.9014, 4.4844],     // Brussels
  CRL: [50.4592, 4.4538],     // Charleroi
  
  // Portugal
  LIS: [38.7756, -9.1354],    // Lisbon
  OPO: [41.2481, -8.6814],    // Porto
  FAO: [37.0144, -7.9659],    // Faro
  FNC: [32.6979, -16.7745],   // Madeira
  
  // Greece
  ATH: [37.9364, 23.9445],    // Athens
  SKG: [40.5197, 22.9709],    // Thessaloniki
  HER: [35.3396, 25.1803],    // Heraklion
  RHO: [36.4054, 28.0862],    // Rhodes
  CFU: [39.6019, 19.9117],    // Corfu
  JMK: [37.4351, 25.3481],    // Mykonos
  JTR: [36.3992, 25.4793],    // Santorini
  
  // Turkey
  IST: [41.2753, 28.7519],    // Istanbul
  SAW: [40.8986, 29.3092],    // Istanbul Sabiha
  ESB: [40.1281, 32.9951],    // Ankara
  AYT: [36.8987, 30.8005],    // Antalya
  ADB: [38.2924, 27.1570],    // Izmir
  DLM: [36.7131, 28.7925],    // Dalaman
  BJV: [37.2506, 27.6643],    // Bodrum
  
  // Scandinavia
  CPH: [55.6180, 12.6508],    // Copenhagen
  OSL: [60.1976, 11.0004],    // Oslo
  ARN: [59.6519, 17.9186],    // Stockholm Arlanda
  GOT: [57.6628, 12.2798],    // Gothenburg
  HEL: [60.3172, 24.9633],    // Helsinki
  BGO: [60.2934, 5.2181],     // Bergen
  TRD: [63.4578, 10.9240],    // Trondheim
  
  // Eastern Europe
  PRG: [50.1008, 14.2600],    // Prague
  WAW: [52.1657, 20.9671],    // Warsaw
  KRK: [50.0777, 19.7848],    // Krakow
  BUD: [47.4298, 19.2611],    // Budapest
  OTP: [44.5711, 26.0850],    // Bucharest
  SOF: [42.6952, 23.4062],    // Sofia
  ZAG: [45.7429, 16.0688],    // Zagreb
  BEG: [44.8184, 20.3091],    // Belgrade
  LJU: [46.2237, 14.4576],    // Ljubljana
  
  // Russia
  SVO: [55.9726, 37.4146],    // Moscow Sheremetyevo
  DME: [55.4088, 37.9063],    // Moscow Domodedovo
  LED: [59.8003, 30.2625],    // St. Petersburg
  
  // Ireland
  DUB: [53.4264, -6.2499],    // Dublin
  SNN: [52.7020, -8.9248],    // Shannon
  ORK: [51.8413, -8.4911],    // Cork
  
  // ============================================
  // MIDDLE EAST
  // ============================================
  DXB: [25.2532, 55.3657],    // Dubai
  AUH: [24.4330, 54.6511],    // Abu Dhabi
  SHJ: [25.3286, 55.5172],    // Sharjah
  DOH: [25.2609, 51.6138],    // Doha
  BAH: [26.2708, 50.6336],    // Bahrain
  KWI: [29.2266, 47.9689],    // Kuwait
  MCT: [23.5933, 58.2844],    // Muscat
  RUH: [24.9578, 46.6989],    // Riyadh
  JED: [21.6796, 39.1565],    // Jeddah
  DMM: [26.4712, 49.7979],    // Dammam
  MED: [24.5534, 39.7051],    // Medina
  AMM: [31.7226, 35.9932],    // Amman
  TLV: [32.0055, 34.8854],    // Tel Aviv
  BEY: [33.8209, 35.4884],    // Beirut
  CAI: [30.1219, 31.4056],    // Cairo
  HRG: [27.1783, 33.7994],    // Hurghada
  SSH: [27.9773, 34.3950],    // Sharm El Sheikh
  
  // ============================================
  // ASIA PACIFIC
  // ============================================
  // Southeast Asia
  SIN: [1.3644, 103.9915],    // Singapore
  KUL: [2.7456, 101.7099],    // Kuala Lumpur
  BKK: [13.6900, 100.7501],   // Bangkok Suvarnabhumi
  DMK: [13.9126, 100.6068],   // Bangkok Don Mueang
  HKT: [8.1132, 98.3169],     // Phuket
  CNX: [18.7669, 98.9626],    // Chiang Mai
  SGN: [10.8188, 106.6520],   // Ho Chi Minh City
  HAN: [21.2212, 105.8070],   // Hanoi
  DAD: [16.0439, 108.1994],   // Da Nang
  CGK: [6.1256, 106.6559],    // Jakarta
  DPS: [8.7482, 115.1672],    // Bali
  MNL: [14.5086, 121.0194],   // Manila
  CEB: [10.3075, 123.9794],   // Cebu
  RGN: [16.9073, 96.1332],    // Yangon
  PNH: [11.5466, 104.8442],   // Phnom Penh
  REP: [13.4107, 103.8128],   // Siem Reap
  VTE: [17.9883, 102.5633],   // Vientiane
  
  // East Asia
  HKG: [22.3080, 113.9185],   // Hong Kong
  PEK: [40.0799, 116.6031],   // Beijing Capital
  PKX: [39.5098, 116.4105],   // Beijing Daxing
  PVG: [31.1443, 121.8083],   // Shanghai Pudong
  SHA: [31.1979, 121.3363],   // Shanghai Hongqiao
  CAN: [23.3924, 113.2988],   // Guangzhou
  SZX: [22.6393, 113.8107],   // Shenzhen
  CTU: [30.5785, 103.9471],   // Chengdu
  CKG: [29.7192, 106.6417],   // Chongqing
  XIY: [34.4471, 108.7516],   // Xi'an
  WUH: [30.7838, 114.2081],   // Wuhan
  HGH: [30.2295, 120.4344],   // Hangzhou
  NKG: [31.7420, 118.8620],   // Nanjing
  TPE: [25.0777, 121.2328],   // Taipei Taoyuan
  TSA: [25.0694, 121.5525],   // Taipei Songshan
  KHH: [22.5771, 120.3500],   // Kaohsiung
  MFM: [22.1496, 113.5920],   // Macau
  
  // Japan
  NRT: [35.7720, 140.3929],   // Tokyo Narita
  HND: [35.5494, 139.7798],   // Tokyo Haneda
  KIX: [34.4347, 135.2441],   // Osaka Kansai
  ITM: [34.7855, 135.4380],   // Osaka Itami
  NGO: [34.8584, 136.8050],   // Nagoya
  FUK: [33.5859, 130.4511],   // Fukuoka
  CTS: [42.7752, 141.6925],   // Sapporo
  OKA: [26.1958, 127.6459],   // Okinawa
  
  // South Korea
  ICN: [37.4602, 126.4407],   // Seoul Incheon
  GMP: [37.5583, 126.7906],   // Seoul Gimpo
  PUS: [35.1795, 128.9383],   // Busan
  CJU: [33.5113, 126.4929],   // Jeju
  
  // ============================================
  // OCEANIA
  // ============================================
  SYD: [-33.9399, 151.1753],  // Sydney
  MEL: [-37.6690, 144.8410],  // Melbourne
  BNE: [-27.3842, 153.1175],  // Brisbane
  PER: [-31.9403, 115.9669],  // Perth
  ADL: [-34.9450, 138.5306],  // Adelaide
  CNS: [-16.8858, 145.7555],  // Cairns
  OOL: [-28.1644, 153.5047],  // Gold Coast
  AKL: [-37.0082, 174.7850],  // Auckland
  WLG: [-41.3272, 174.8052],  // Wellington
  CHC: [-43.4894, 172.5323],  // Christchurch
  ZQN: [-45.0211, 168.7392],  // Queenstown
  NAN: [-17.7554, 177.4436],  // Fiji Nadi
  PPT: [-17.5537, -149.6071], // Tahiti
  
  // ============================================
  // AFRICA
  // ============================================
  JNB: [-26.1392, 28.2460],   // Johannesburg
  CPT: [-33.9715, 18.6021],   // Cape Town
  DUR: [-29.6144, 31.1197],   // Durban
  NBO: [-1.3192, 36.9278],    // Nairobi
  ADD: [8.9779, 38.7993],     // Addis Ababa
  LOS: [6.5774, 3.3212],      // Lagos
  ABV: [9.0065, 7.2632],      // Abuja
  ACC: [5.6052, -0.1668],     // Accra
  CMN: [33.3675, -7.5898],    // Casablanca
  RAK: [31.6069, -8.0363],    // Marrakech
  TUN: [36.8510, 10.2272],    // Tunis
  ALG: [36.6910, 3.2154],     // Algiers
  DAR: [-6.8781, 39.2026],    // Dar es Salaam
  MRU: [-20.4302, 57.6836],   // Mauritius
  SEZ: [-4.6743, 55.5218],    // Seychelles
  
  // ============================================
  // SOUTH & CENTRAL AMERICA
  // ============================================
  GRU: [-23.4356, -46.4731],  // Sao Paulo
  GIG: [-22.8099, -43.2505],  // Rio de Janeiro
  BSB: [-15.8711, -47.9186],  // Brasilia
  EZE: [-34.8222, -58.5358],  // Buenos Aires
  SCL: [-33.3930, -70.7858],  // Santiago
  LIM: [-12.0219, -77.1143],  // Lima
  BOG: [4.7016, -74.1469],    // Bogota
  MDE: [6.1645, -75.4231],    // Medellin
  UIO: [-0.1292, -78.3575],   // Quito
  CCS: [10.6012, -66.9912],   // Caracas
  PTY: [9.0714, -79.3835],    // Panama City
  SJO: [9.9939, -84.2088],    // San Jose Costa Rica
  GUA: [14.5833, -90.5275],   // Guatemala City
  MEX: [19.4363, -99.0721],   // Mexico City
  CUN: [21.0365, -86.8771],   // Cancun
  GDL: [20.5218, -103.3111],  // Guadalajara
  MTY: [25.7785, -100.1070],  // Monterrey
  TIJ: [32.5411, -116.9700],  // Tijuana
  PVR: [20.6801, -105.2544],  // Puerto Vallarta
  SJD: [23.1518, -109.7211],  // Los Cabos
  HAV: [22.9892, -82.4091],   // Havana
  NAS: [25.0390, -77.4662],   // Nassau
  MBJ: [18.5037, -77.9134],   // Montego Bay
  SXM: [18.0410, -63.1089],   // St. Maarten
  AUA: [12.5014, -70.0152],   // Aruba
  CUR: [12.1889, -68.9598],   // Curacao
  PUJ: [18.5674, -68.3634],   // Punta Cana
  SDQ: [18.4297, -69.6689],   // Santo Domingo
  SJU: [18.4394, -66.0018],   // San Juan Puerto Rico
  
  // ============================================
  // CANADA
  // ============================================
  YYZ: [43.6777, -79.6248],   // Toronto
  YVR: [49.1967, -123.1815],  // Vancouver
  YUL: [45.4706, -73.7408],   // Montreal
  YYC: [51.1215, -114.0076],  // Calgary
  YEG: [53.3097, -113.5792],  // Edmonton
  YOW: [45.3225, -75.6692],   // Ottawa
  YHZ: [44.8808, -63.5085],   // Halifax
  YWG: [49.9100, -97.2399],   // Winnipeg
  YQB: [46.7911, -71.3933],   // Quebec City
};

export function getAirportCoordinates(iataCode: string): [number, number] | null {
  if (!iataCode) return null;
  return airportCoordinates[iataCode.toUpperCase()] || null;
}

// Helper to check if we have coordinates for an airport
export function hasCoordinates(iataCode: string): boolean {
  return !!airportCoordinates[iataCode?.toUpperCase()];
}
