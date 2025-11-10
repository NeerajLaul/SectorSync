import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

const faqs = [
  {
    question: "How accurate are the recommendations?",
    answer: "Our scoring algorithm is built on research-backed compatibility models and has been refined through years of real-world validation. The system analyzes 12 key factors with nuanced sensitivity weights, gate rules, and nudge algorithms to ensure high accuracy. Most users report 95%+ alignment with expert consultant recommendations."
  },
  {
    question: "Which methodologies does the tool evaluate?",
    answer: "We evaluate 8 major methodologies: Scrum, SAFe (Scaled Agile Framework), Waterfall, PRINCE2, Lean Six Sigma, Hybrid approaches, Disciplined Agile, and Continuous Delivery. Each is scored independently based on how well it fits your specific context."
  },
  {
    question: "How long does the assessment take?",
    answer: "The assessment consists of 12 questions and typically takes 3-5 minutes to complete. You can pause and resume at any time. Results are generated instantly once you submit your answers."
  },
  {
    question: "Can I save and share my results?",
    answer: "Yes! Free users can save and share results via a unique URL. Professional and Enterprise users get additional export options including PDF reports with detailed analysis, perfect for stakeholder presentations."
  },
  {
    question: "What if I disagree with the recommendation?",
    answer: "The detailed scoring breakdown shows exactly how each factor contributed to every methodology's score. This transparency helps you understand the reasoning and make informed decisions. Remember, the tool provides recommendations - you make the final choice based on your full context."
  },
  {
    question: "Is the tool really free?",
    answer: "Yes! The core assessment tool is 100% free forever with unlimited assessments. No credit card required. Paid plans add features like team collaboration, custom branding, and advanced analytics, but the recommendation engine is always free."
  },
  {
    question: "Can I customize the scoring for my organization?",
    answer: "Enterprise customers can work with our team to adjust sensitivity weights and create custom gate rules based on their specific organizational context and constraints. This ensures recommendations align perfectly with your unique environment."
  },
  {
    question: "How often is the scoring algorithm updated?",
    answer: "We continuously refine the scoring algorithm based on user feedback and implementation outcomes. Major updates happen quarterly, and we notify all users of significant changes. The current engine is version 3.0."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-32">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about SectorSync and methodology recommendations.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Button variant="outline">Contact Support</Button>
        </div>
      </div>
    </section>
  );
}