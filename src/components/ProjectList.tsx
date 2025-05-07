import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { projectsList } from "@/lib/dummy-data";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, FileText } from "lucide-react";

export default function ProjectList() {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return <Badge className="bg-blue-600 text-white">In Progress</Badge>;
      case "draft":
        return <Badge variant="outline" className="border-zinc-700 text-zinc-300">Draft</Badge>;
      case "submitted":
        return <Badge className="bg-green-600 text-white">Submitted</Badge>;
      default:
        return <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 lg:p-8 relative">
      {/* Background accents similar to landing page */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent"></div>
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">My Claims</h2>
            <p className="text-zinc-400 max-w-[600px]">
              Track and manage your VA disability claims in one place
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 text-sm">
                <Plus className="h-4 w-4 mr-2" /> Create New Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">Create New Claim</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-300">Type of Claim</label>
                  <select className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:border-blue-600 focus:ring-blue-600">
                    <option>Disability Compensation</option>
                    <option>Education Benefits</option>
                    <option>Healthcare</option>
                    <option>Home Loan</option>
                    <option>Pension</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-300">Claim Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter claim name" 
                    className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-600 focus:ring-blue-600" 
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Create Claim <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {projectsList.length === 0 ? (
          <div className="border border-zinc-800 rounded-xl p-12 bg-zinc-900/30 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No claims yet</h3>
            <p className="text-zinc-400 mb-6">Get started by creating your first VA disability claim</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" /> Create Your First Claim
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-zinc-900 border border-zinc-800 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-white">Create New Claim</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-300">Type of Claim</label>
                    <select className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:border-blue-600 focus:ring-blue-600">
                      <option>Disability Compensation</option>
                      <option>Education Benefits</option>
                      <option>Healthcare</option>
                      <option>Home Loan</option>
                      <option>Pension</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-300">Claim Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter claim name" 
                      className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-600 focus:ring-blue-600" 
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                      Create Claim <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/20 shadow-lg">
            <Table>
              <TableHeader className="bg-zinc-900/80">
                <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-300 font-medium">Name</TableHead>
                  <TableHead className="text-zinc-300 font-medium">Status</TableHead>
                  <TableHead className="text-zinc-300 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsList.map((project) => (
                  <TableRow key={project.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <TableCell className="font-medium text-white">{project.name}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" className="mr-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                        Edit
                      </Button>
                      <Button variant="destructive" className="bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 border border-red-900/50">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
} 