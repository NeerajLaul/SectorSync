import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Senior Project Manager",
    company: "TechFlow Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "SectorSync recommended SAFe for our enterprise project and it was spot on. The detailed scoring helped me get stakeholder buy-in immediately.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Agile Coach",
    company: "Digital Innovations",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "I use this tool with every client to start our engagement. It provides an objective baseline and sparks great conversations about methodology fit.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "VP of Engineering",
    company: "BuildRight Solutions",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "We were forcing Scrum on projects where it didn't fit. The assessment revealed we needed a hybrid approach - project success rates improved 40%.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Product Director",
    company: "InnovateCo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "The factor contribution analysis is brilliant. It showed us exactly why Continuous Delivery was our best match. Implementation went smoothly.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "PMO Director",
    company: "Enterprise Systems Ltd",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "We now require all PMs to complete this assessment before proposing a methodology. It's standardized our approach and reduced methodology debates.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Scrum Master",
    company: "AgileFirst Tech",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "Helped me realize that PRINCE2 was a better fit for our regulated environment than pure Scrum. The transparency in scoring was eye-opening.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            Trusted by Project Professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how project managers and teams are using SectorSync to make better methodology decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground">"{testimonial.content}"</p>
                  
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}