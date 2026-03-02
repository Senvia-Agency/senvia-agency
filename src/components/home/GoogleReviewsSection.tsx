import { Star, ExternalLink, Quote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleReviews } from '@/hooks/useGoogleReviews';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const GOOGLE_BUSINESS_LINK = "https://www.google.com/maps/place/Senvia/@39.7587917,-8.8055327,17z/data=!3m1!4b1!4m6!3m5!1s0xd2273bf06de7bb5:0xea1f521b3f7d88fc!8m2!3d39.7587876!4d-8.8029578!16s%2Fg%2F11xmfdmng5";

const GoogleReviewsSection = () => {
  const { ref, isIntersecting: isInView } = useIntersectionObserver({ threshold: 0.1 });
  const { data, isLoading } = useGoogleReviews();

  const rating = data?.rating || 5.0;
  const totalReviews = data?.totalReviews || 0;
  const reviews = data?.reviews || [];

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            O Que Dizem os Nossos Clientes
          </h2>
          
          <div className={`inline-flex flex-col sm:flex-row items-center gap-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-4 transition-all duration-500 delay-200 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <span className="text-4xl font-bold text-foreground">{rating.toFixed(1)}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="h-8 w-px bg-border/50 hidden sm:block" />
            <span className="text-muted-foreground text-sm font-medium">
              {isLoading ? 'A carregar...' : `${totalReviews} avaliações verificadas`}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className={`bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 animate-pulse transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-3/4 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : (
            reviews.slice(0, 3).map((review, index) => (
              <div
                key={review.name + index}
                className={`group relative bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 hover:bg-card/50 hover:border-border/50 transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
                <div className="flex items-center gap-3 mb-4">
                  {review.photoUrl ? (
                    <img 
                      src={review.photoUrl.replace('=s128', '=s80')} 
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                      width="40"
                      height="40"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                      {getInitials(review.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{review.name}</p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-4">"{review.text}"</p>
                <p className="text-xs text-muted-foreground/60">{review.date}</p>
              </div>
            ))
          )}
        </div>

        <div className={`text-center transition-all duration-500 delay-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button variant="outline" size="lg" className="group" asChild>
            <a href={GOOGLE_BUSINESS_LINK} target="_blank" rel="noopener noreferrer">
              Ver todas as avaliações no Google
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsSection;
