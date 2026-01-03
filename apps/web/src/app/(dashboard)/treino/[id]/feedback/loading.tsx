import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeedbackLoading() {
  return (
    <div className="min-h-[600px] flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <Skeleton className="h-16 w-16 mx-auto rounded-full" />
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Feedback Buttons Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-48 mx-auto" />
            <div className="grid gap-3 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="cursor-pointer transition-all hover:shadow-md">
                  <CardContent className="p-6 text-center space-y-3">
                    <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                    <Skeleton className="h-5 w-20 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Optional Fields Skeleton */}
          <div className="space-y-4 pt-6 border-t">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          {/* Info Box Skeleton */}
          <Skeleton className="h-32 w-full rounded-lg" />

          {/* Submit Button Skeleton */}
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
