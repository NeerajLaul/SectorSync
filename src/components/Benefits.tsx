import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Make data-driven methodology decisions",
  "Reduce implementation failures by 60%",
  "Improve project success rates",
  "Save weeks of research and analysis",
  "Get buy-in with evidence-based recommendations",
  "Avoid costly methodology mismatches"
];

const useCases = [
  {
    title: "Project Managers",
    description: "Choose the right methodology for each project based on context, not trends.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    title: "Agile Coaches",
    description: "Guide teams to methodologies that fit their maturity and organizational constraints.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    title: "Organizations",
    description: "Standardize methodology selection with a consistent, repeatable assessment process.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
];

export function Benefits() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl">
                Transform How You Choose Methodologies
              </h2>
              <p className="text-lg text-muted-foreground">
                Join project managers and teams using SectorSync to make smarter, 
                evidence-based decisions about project management approaches.
              </p>
            </div>

            <div className="grid gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3">
                      <ImageWithFallback
                        src={useCase.image}
                        alt={useCase.title}
                        className="w-full h-32 sm:h-full object-cover"
                      />
                    </div>
                    <div className="sm:w-2/3 p-6">
                      <h3 className="text-xl mb-2">{useCase.title}</h3>
                      <p className="text-muted-foreground">{useCase.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}