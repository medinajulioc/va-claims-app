import { generateMeta } from "@/lib/utils";

import {
  WelcomeCard,
  LeaderboardCard,
  LearningPathCard,
  ChartMostActivity,
  ProgressStatisticsCard,
  StudentSuccessCard,
  CourseProgressByMonth,
  CoursesListTable
} from "@/app/dashboard/(auth)/academy/components";

export async function generateMetadata() {
  return generateMeta({
    title: "Academy Admin Dashboard",
    description:
      "Admin dashboard template for schools and educational institutions. Built with shadcn/ui, Tailwind CSS, Next.js.",
    canonical: "/academy"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Academy</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-12 xl:col-span-6">
          <WelcomeCard />
        </div>
        <div className="lg:col-span-6 xl:col-span-3">
          <LearningPathCard />
        </div>
        <div className="lg:col-span-6 xl:col-span-3">
          <LeaderboardCard />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <StudentSuccessCard
          currentSuccessRate={88}
          previousSuccessRate={85}
          totalStudents={1500}
          passingStudents={1320}
        />
        <ProgressStatisticsCard />
        <ChartMostActivity />
      </div>
      <div className="mt-4 gap-4 space-y-4 xl:grid xl:grid-cols-2 xl:space-y-0">
        <CourseProgressByMonth />
        <CoursesListTable />
      </div>
    </div>
  );
}
