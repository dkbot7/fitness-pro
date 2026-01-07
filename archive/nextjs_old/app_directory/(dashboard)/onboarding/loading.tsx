import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function OnboardingLoading() {
  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4">
          {/* Progress Indicator Skeleton */}
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-2 flex-1 mx-1" />
            ))}
          </div>

          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Form Content Skeleton */}
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="cursor-pointer transition-all hover:shadow-md">
                <CardContent className="p-6 text-center space-y-4">
                  <Skeleton className="h-16 w-16 mx-auto rounded-full" />
                  <Skeleton className="h-5 w-32 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons Skeleton */}
          <div className="flex justify-between pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
