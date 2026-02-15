/**
 * Daily quotes from Sri Srimad Gour Govinda Swami Maharaj.
 * Add more quotes here — they'll cycle through based on the day.
 */
export const quotes = [
  {
    id: 1,
    text: "Unless one gets the mercy of a sādhu, a pure devotee, one cannot get kṛṣṇa-bhakti. This is the only way.",
    source: "Lecture, 1995",
  },
  {
    id: 2,
    text: "Guru is not a man of this material world. He is the manifestation of Krishna's mercy.",
    source: "Guru Tattva",
  },
  {
    id: 3,
    text: "The crying of the heart is the only price for getting Krishna.",
    source: "Lecture, 1994",
  },
  {
    id: 4,
    text: "Without sadhu-sanga, without the association of a pure devotee, no one can develop love of God.",
    source: "How to Find Guru",
  },
  {
    id: 5,
    text: "Krishna is not attained by scholarship, by intelligence, or by much hearing. He is attained only by one whom He chooses.",
    source: "Lecture, 1996",
  },
  {
    id: 6,
    text: "Simplicity is the key. A simple heart can receive the mercy of the Lord.",
    source: "Simplicity and Faith",
  },
  {
    id: 7,
    text: "The guru is always present. One who has eyes to see can see him everywhere.",
    source: "A Sadhu is Always Present",
  },
];

/** Get quote for a specific day (cycles through quotes) */
export function getQuoteForDay(dayOffset: number = 0): typeof quotes[0] {
  const today = new Date();
  today.setDate(today.getDate() - dayOffset);
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return quotes[dayOfYear % quotes.length];
}

/** Get all quotes */
export function getAllQuotes() {
  return quotes;
}
