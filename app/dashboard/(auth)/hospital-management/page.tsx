import { generateMeta } from "@/lib/utils";

import CalendarDateRangePicker from "@/components/custom-date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SummaryCards,
  Notes,
  PlannedCalendar,
  HospitalReports,
  PatientVisitsChart,
  PatientsByDepartmentChart,
  PatientsWithLastProcedure,
  UpcomingAppointments
} from "@/app/dashboard/(auth)/hospital-management/components";
import CustomDateRangePicker from "@/components/custom-date-range-picker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "Hospital Admin Management",
    description:
      "The hospital admin dashboard is a template for managing and analyzing hospital data and monitoring operational processes.",
    canonical: "/hospital-management"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Hospital Management</h1>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <Button>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Activities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <SummaryCards />
          <div className="gap-4 space-y-4 md:grid-cols-2 lg:grid lg:grid-cols-7 lg:space-y-0">
            <PatientVisitsChart />
            <PatientsByDepartmentChart />
          </div>
          <div className="gap-4 space-y-4 md:grid-cols-2 lg:grid lg:grid-cols-7 lg:space-y-0">
            <UpcomingAppointments />
            <PatientsWithLastProcedure />
          </div>
          <div className="gap-4 space-y-4 md:grid-cols-2 lg:grid lg:grid-cols-2 lg:space-y-0">
            <PlannedCalendar />
            <Notes />
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <HospitalReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
