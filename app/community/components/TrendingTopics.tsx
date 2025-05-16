"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePosts } from "../lib/mock-data-adapter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TrendingTopicsProps {
  className?: string;
  limit?: number;
}

interface TrendingTopic {
  tag: string;
  count: number;
  growth: number; // Percentage growth (simulated)
}

export function TrendingTopics({ className = "", limit = 5 }: TrendingTopicsProps) {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const { data: posts } = usePosts();

  // Calculate trending topics based on post tags
  useEffect(() => {
    // Count tag occurrences
    const tagCounts: Record<string, number> = {};
    
    posts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by count
    const sortedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({
        tag,
        count,
        // Simulate growth percentage (would be calculated from historical data in a real app)
        growth: Math.floor(Math.random() * 200) - 50 // -50% to +150%
      }))
      .sort((a, b) => b.count - a.count || b.growth - a.growth)
      .slice(0, limit);
    
    setTrendingTopics(sortedTags);
  }, [posts, limit]);

  return (
    <Card className={cn("overflow-hidden border shadow-sm", className)}>
      <CardHeader className="border-b bg-muted/20 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
          
          <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
            <Link href="/community">
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {trendingTopics.length > 0 ? (
          <div className="space-y-3">
            {trendingTopics.map((topic) => (
              <div key={topic.tag} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="hover:bg-muted">
                    {topic.tag}
                  </Badge>
                  <span className="text-muted-foreground text-xs">{topic.count} posts</span>
                </div>
                
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  topic.growth > 0 ? "text-green-600 dark:text-green-500" : 
                  topic.growth < 0 ? "text-red-600 dark:text-red-500" : 
                  "text-muted-foreground"
                )}>
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>{topic.growth > 0 ? '+' : ''}{topic.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No trending topics found
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TrendingTopics; 