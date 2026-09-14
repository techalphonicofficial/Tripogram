export const spitiValleyFaqs = [
  {
    question: "Is Spiti Valley safe for travel?",
    answer: "Yes, with proper planning and guidance, Spiti Valley is safe for travelers.",
  },
  {
    question: "When is the best time to visit Spiti Valley?",
    answer: "May to October is best for the Spiti circuit, while December to March is best for the winter snow experience.",
  },
  {
    question: "What is the difference between Spiti Circuit and Spiti Winter trip?",
    answer: "The Spiti circuit covers the full loop via Shimla and Manali, while the winter trip is limited to the Shimla route with snow and extreme conditions.",
  },
  {
    question: "Is Spiti Valley suitable for beginners?",
    answer: "Yes, Spiti Valley is suitable for beginners when booked as a guided tour with proper preparation.",
  },
  {
    question: "Can I do a Spiti trip by bike?",
    answer: "Yes, Spiti Valley is one of the most popular biking routes in India.",
  },
  {
    question: "Is network available in Spiti?",
    answer: "Connectivity is limited in Spiti Valley. BSNL usually works best in remote areas.",
  },
  {
    question: "Do I need permits for Spiti?",
    answer: "Indian travelers usually do not need permits for Spiti Valley.",
  },
  {
    question: "What should I pack for Spiti?",
    answer: "Carry warm clothes, sunglasses, sunscreen, essential medicines, comfortable shoes, and personal essentials.",
  },
  {
    question: "Is Chandratal Lake accessible year-round?",
    answer: "No, Chandratal Lake is usually accessible only during the summer months.",
  },
  {
    question: "Is prior booking necessary?",
    answer: "Yes, advance booking is recommended, especially during peak travel seasons.",
  },
];

export const himachalFaqs = [
  {
    question: "What is the best time to visit Himachal Pradesh?",
    answer: "March to June is great for pleasant weather, while December to February is best for snow trips. Some high-altitude routes are best between May and October.",
  },
  {
    question: "Which are the most popular trips in Himachal?",
    answer: "Popular Himachal trips include Spiti Valley, Manali, Kasol, Kheerganga, Jibhi, Tirthan Valley, McLeodganj, and Bir Billing.",
  },
  {
    question: "Is Himachal safe for group trips and solo travelers?",
    answer: "Yes, Himachal is generally safe for group trips and solo travelers when you travel with proper planning, verified stays, and reliable transport.",
  },
  {
    question: "Do Himachal trips include transport from Delhi?",
    answer: "Many Himachal tour packages include Delhi-to-Delhi transport, but inclusions can vary by package.",
  },
  {
    question: "Are Himachal packages suitable for beginners?",
    answer: "Yes, many Himachal packages are beginner-friendly. High-altitude or trek-based trips may need basic fitness and preparation.",
  },
  {
    question: "What should I pack for a Himachal trip?",
    answer: "Pack warm layers, comfortable shoes, personal medicines, sunscreen, sunglasses, reusable water bottle, and valid ID proof.",
  },
  {
    question: "Can I book Himachal trips for a private group?",
    answer: "Yes, many Himachal trips can be arranged for private groups depending on dates, group size, and availability.",
  },
  {
    question: "Is snowfall guaranteed in Himachal?",
    answer: "Snowfall depends on the destination, altitude, and weather conditions. Winter months have the highest chances of snow.",
  },
];

export function getPageFaqs(type, slug, apiFaqs) {
  if (Array.isArray(apiFaqs) && apiFaqs.length > 0) return apiFaqs;
  if (type === "trip" && slug === "spiti-valley") return spitiValleyFaqs;
  if (type === "destination" && slug === "himachal") return himachalFaqs;
  return [];
}

export function getFaqSchema(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: String(item.answer || "").replace(/<[^>]*>/g, ""),
      },
    })),
  };
}
