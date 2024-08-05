import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "What is TripMate?",
      answer:
        "TripMate is a travel companion web application that helps you find and explore new places, providing detailed information, directions, and travel data for various locations.",
    },
    {
      question: "How do I search for places?",
      answer:
        "You can search for places using the search bar on the map interface. The search results will be displayed as markers on the map, and you can click on them to view more details.",
    },
    {
      question: "How can I get directions?",
      answer:
        "To get directions, select your starting point and destination on the map. The app will provide you with the best route, including step-by-step navigation instructions.",
    },
    {
      question: "Is my location data secure?",
      answer:
        "Yes, TripMate prioritizes your privacy and security. Your location data is only used to provide you with relevant travel information and is not shared with third parties.",
    },
    {
      question: "How does the AI trip planner work?",
      answer:
        "The AI trip planner uses advanced algorithms to create personalized itineraries based on your preferences, interests, and travel history. Simply input your desired destination and preferences, and the AI will generate a detailed trip plan for you.",
    },
    {
      question: "Can I use TripMate offline?",
      answer:
        "Currently, TripMate requires an internet connection to fetch the latest travel data and provide accurate directions. Offline functionality is planned for future releases.",
    },
  ];

  return (
    <section className="bg-[#f3f7f6] py-12 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 flex justify-center items-center flex-col gap-3 md:gap-4 lg:gap-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-center text-black sm:text-4xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="max-w-xl mx-auto mt-3 text-gray-700 sm:mt-6 text-md sm:text-lg sm:leading-snug dark:text-gray-300">
            Here are some of our most frequently asked questions. If you have a
            question that is not answered here, please contact us.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-1/2">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="px-4 py-6 md:text-base lg:text-lg">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
