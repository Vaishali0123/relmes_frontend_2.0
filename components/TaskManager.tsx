// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Calendar,
//   Clock,
//   Plus,
//   FileText,
//   CheckCircle,
//   Circle,
//   AlertCircle,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useAuthContext } from "@/app/auth/components/auth";
// import axios from "axios";
// import { API } from "@/app/utils/helpers";

// interface Task {
//   id: string;
//   _id?: string;
//   title: string;
//   desc?: string;
//   status: "pending" | "in-progress" | "completed";
//   priority: "low" | "medium" | "high";
//   dueDate: string;
//   timeSpent: number; // in hours
//   createdAt: string;
//   completed?: string;
//   description: string;
// }

// const TaskManager = () => {
//   const { toast } = useToast();
//   const [tasks, setTasks] = useState<Task[]>([]);

//   const { data } = useAuthContext();
//   const userId = data?.id;

//   // const [tasks, setTasks] = useState<Task[]>([
//   //   {
//   //     id: "1",
//   //     title: "Design landing page",
//   //     description: "Create a modern landing page for Relmes",
//   //     status: "completed",
//   //     priority: "high",
//   //     dueDate: "2024-01-15",
//   //     timeSpent: 8,
//   //     createdAt: "2024-01-10",
//   //   },
//   //   {
//   //     id: "2",
//   //     title: "Implement task management",
//   //     description: "Build task tracking and reporting system",
//   //     status: "in-progress",
//   //     priority: "high",
//   //     dueDate: "2024-01-20",
//   //     timeSpent: 12,
//   //     createdAt: "2024-01-12",
//   //   },
//   //   {
//   //     id: "3",
//   //     title: "Setup deployment",
//   //     description: "Configure production deployment pipeline",
//   //     status: "pending",
//   //     priority: "medium",
//   //     dueDate: "2024-01-25",
//   //     timeSpent: 0,
//   //     createdAt: "2024-01-14",
//   //   },
//   // ]);

//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     priority: "medium" as const,
//     dueDate: "",
//     timeSpent: 0,
//   });

//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   useEffect(() => {
//     if (!userId) return;
//     const fetchTasks = async () => {
//       try {
//         const res = await axios.get(`${API}/getTasks/${userId}`);
//         const rawTasks = res?.data?.user?.todos || [];
//         const formattedTasks = rawTasks.map((task: Task) => ({
//           id: task._id,
//           title: task.title,
//           description: task.desc,
//           status: task.completed ? "completed" : "pending",
//           priority: "medium", // default (API doesn't have it)
//           dueDate: "", // you can extend later
//           timeSpent: 0,
//           createdAt: task.createdAt,
//         }));
//         setTasks(formattedTasks);
//       } catch (err) {
//         console.log(err);
//         toast({
//           title: "Error",
//           description: "Failed to load tasks",
//           variant: "destructive",
//         });
//       }
//     };

//     fetchTasks();
//   }, [userId]);
//   const addTask = async () => {
//     if (!newTask.title.trim()) {
//       toast({
//         title: "Error",
//         description: "Task title is required",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const res = await axios.post(`${API}/addtask/${userId}`, {
//         title: newTask.title,
//         desc: newTask.description,
//       });

//       if (res?.data?.success) {
//         const newApiTask: Task = {
//           id: Date.now().toString(), // fallback
//           title: newTask.title,
//           description: newTask.description,
//           // desc: newTask.description,
//           status: "pending",
//           priority: newTask.priority,
//           dueDate: newTask.dueDate,
//           timeSpent: newTask.timeSpent,
//           createdAt: new Date().toISOString(),
//         };
//         setTasks([newApiTask, ...tasks]);
//         setNewTask({
//           title: "",
//           description: "",
//           priority: "medium",
//           dueDate: "",
//           timeSpent: 0,
//         });
//         setIsAddDialogOpen(false);

//         toast({
//           title: "Success",
//           description: "Task added successfully",
//         });
//       }
//     } catch (e) {
//       console.log(e);
//       toast({
//         title: "Error",
//         description: "Failed to add task",
//         variant: "destructive",
//       });
//     }
//   };

//   // const addTask = () => {
//   //   if (!newTask.title.trim()) {
//   //     toast({
//   //       title: "Error",
//   //       description: "Task title is required",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   const task: Task = {
//   //     id: Date.now().toString(),
//   //     ...newTask,
//   //     status: "pending",
//   //     createdAt: new Date().toISOString().split("T")[0],
//   //   };

//   //   setTasks([...tasks, task]);
//   //   setNewTask({
//   //     title: "",
//   //     description: "",
//   //     priority: "medium",
//   //     dueDate: "",
//   //     timeSpent: 0,
//   //   });
//   //   setIsAddDialogOpen(false);

//   //   toast({
//   //     title: "Success",
//   //     description: "Task added successfully",
//   //   });
//   // };
//   const updateTaskStatus = async (id: string, status: Task["status"]) => {
//     const updatedTasks = tasks.map((task) =>
//       task.id === id ? { ...task, status } : task
//     );
//     setTasks(updatedTasks);

//     try {
//       await axios.post(`${API}/updateTask`, {
//         userId,
//         taskId: id,
//       });
//     } catch (err) {
//       console.log(err);
//       toast({
//         title: "Error",
//         description: "Failed to update task status",
//         variant: "destructive",
//       });
//     }
//   };

//   // const updateTaskStatus = (id: string, status: Task["status"]) => {
//   //   setTasks(
//   //     tasks.map((task) => (task.id === id ? { ...task, status } : task))
//   //   );
//   // };

//   const getStatusIcon = (status: Task["status"]) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "in-progress":
//         return <AlertCircle className="h-4 w-4 text-blue-500" />;
//       default:
//         return <Circle className="h-4 w-4 text-gray-400" />;
//     }
//   };

//   const getPriorityColor = (priority: Task["priority"]) => {
//     switch (priority) {
//       case "high":
//         return "destructive";
//       case "medium":
//         return "default";
//       case "low":
//         return "secondary";
//     }
//   };

//   const generateReport = () => {
//     const completedTasks = tasks.filter((task) => task.status === "completed");
//     const totalTimeSpent = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
//     const completionRate =
//       tasks.length > 0
//         ? ((completedTasks.length / tasks.length) * 100).toFixed(1)
//         : 0;

//     return {
//       totalTasks: tasks.length,
//       completedTasks: completedTasks.length,
//       inProgressTasks: tasks.filter((task) => task.status === "in-progress")
//         .length,
//       pendingTasks: tasks.filter((task) => task.status === "pending").length,
//       totalTimeSpent,
//       completionRate,
//       tasks: completedTasks,
//     };
//   };

//   const report = generateReport();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-4xl text-black font-bold bg-gradient-primary bg-clip-text  mb-2">
//             Task Manager
//           </h1>
//           <p className="text-muted-foreground">
//             Track your tasks and generate comprehensive work reports
//           </p>
//         </div>

//         <Tabs defaultValue="tasks" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-2 max-w-md">
//             <TabsTrigger value="tasks">My Tasks</TabsTrigger>
//             <TabsTrigger value="report">Work Report</TabsTrigger>
//           </TabsList>

//           <TabsContent value="tasks" className="space-y-6">
//             <div className="flex justify-between items-center">
//               <div className="flex gap-4">
//                 <Card className="p-4">
//                   <div className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     <span className="font-semibold">
//                       {report.completedTasks} Completed
//                     </span>
//                   </div>
//                 </Card>
//                 <Card className="p-4">
//                   <div className="flex items-center gap-2">
//                     <AlertCircle className="h-5 w-5 text-blue-500" />
//                     <span className="font-semibold">
//                       {report.inProgressTasks} In Progress
//                     </span>
//                   </div>
//                 </Card>
//                 <Card className="p-4">
//                   <div className="flex items-center gap-2">
//                     <Circle className="h-5 w-5 text-gray-400" />
//                     <span className="font-semibold">
//                       {report.pendingTasks} Pending
//                     </span>
//                   </div>
//                 </Card>
//               </div>

//               <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="default" className="animate-fade-in">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Task
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Add New Task</DialogTitle>
//                     <DialogDescription>
//                       Create a new task to track your work
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="title">Task Title</Label>
//                       <Input
//                         id="title"
//                         value={newTask.title}
//                         onChange={(e) =>
//                           setNewTask({ ...newTask, title: e.target.value })
//                         }
//                         placeholder="Enter task title"
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="description">Description</Label>
//                       <Textarea
//                         id="description"
//                         value={newTask.description}
//                         onChange={(e) =>
//                           setNewTask({
//                             ...newTask,
//                             description: e.target.value,
//                           })
//                         }
//                         placeholder="Task description"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="priority">Priority</Label>
//                         <Select
//                           value={newTask.priority}
//                           onValueChange={(value: any) =>
//                             setNewTask({ ...newTask, priority: value })
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="low">Low</SelectItem>
//                             <SelectItem value="medium">Medium</SelectItem>
//                             <SelectItem value="high">High</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div>
//                         <Label htmlFor="dueDate">Due Date</Label>
//                         <Input
//                           id="dueDate"
//                           type="date"
//                           value={newTask.dueDate}
//                           onChange={(e) =>
//                             setNewTask({ ...newTask, dueDate: e.target.value })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsAddDialogOpen(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button onClick={addTask}>Add Task</Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             <Card className="animate-fade-in">
//               <CardHeader>
//                 <CardTitle>All Tasks</CardTitle>
//                 <CardDescription>Manage and track your tasks</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-12">Status</TableHead>
//                       <TableHead>Task</TableHead>
//                       <TableHead>Priority</TableHead>
//                       <TableHead>Due Date</TableHead>
//                       <TableHead>Time Spent</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {tasks.map((task) => (
//                       <TableRow key={task.id} className="hover-scale">
//                         <TableCell>{getStatusIcon(task.status)}</TableCell>
//                         <TableCell>
//                           <div>
//                             <div className="font-medium">{task.title}</div>
//                             <div className="text-sm text-muted-foreground">
//                               {task.description}
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant={getPriorityColor(task.priority)}>
//                             {task.priority}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-1">
//                             <Calendar className="h-4 w-4" />
//                             {task.dueDate}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-1">
//                             <Clock className="h-4 w-4" />
//                             {task.timeSpent}h
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Select
//                             value={task.status}
//                             onValueChange={(value) =>
//                               updateTaskStatus(task.id, value as Task["status"])
//                             }
//                           >
//                             <SelectTrigger className="w-32">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="pending">Pending</SelectItem>
//                               <SelectItem value="in-progress">
//                                 In Progress
//                               </SelectItem>
//                               <SelectItem value="completed">
//                                 Completed
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="report" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <Card className="animate-fade-in">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Total Tasks
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{report.totalTasks}</div>
//                 </CardContent>
//               </Card>

//               <Card className="animate-fade-in">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Completion Rate
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-green-600">
//                     {report.completionRate}%
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="animate-fade-in">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Total Hours
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">
//                     {report.totalTimeSpent}h
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="animate-fade-in">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Avg. per Task
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">
//                     {report.totalTasks > 0
//                       ? (report.totalTimeSpent / report.totalTasks).toFixed(1)
//                       : 0}
//                     h
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="animate-fade-in">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <FileText className="h-5 w-5" />
//                   Work Report Summary
//                 </CardTitle>
//                 <CardDescription>
//                   Detailed breakdown of completed tasks and time allocation
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="prose prose-sm max-w-none">
//                   <h4>Report Period: {new Date().toLocaleDateString()}</h4>
//                   <p>
//                     During this period, <strong>{report.completedTasks}</strong>{" "}
//                     out of <strong>{report.totalTasks}</strong> tasks were
//                     completed, achieving a{" "}
//                     <strong>{report.completionRate}%</strong> completion rate.
//                   </p>
//                   <p>
//                     Total time invested:{" "}
//                     <strong>{report.totalTimeSpent} hours</strong>
//                   </p>
//                 </div>

//                 {report.tasks.length > 0 && (
//                   <div>
//                     <h4 className="font-semibold mb-3">Completed Tasks</h4>
//                     <div className="space-y-2">
//                       {report.tasks.map((task) => (
//                         <div
//                           key={task.id}
//                           className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
//                         >
//                           <div>
//                             <div className="font-medium">{task.title}</div>
//                             <div className="text-sm text-muted-foreground">
//                               {task.description}
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="font-medium">{task.timeSpent}h</div>
//                             <Badge
//                               variant={getPriorityColor(task.priority)}
//                               className="text-xs"
//                             >
//                               {task.priority}
//                             </Badge>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <Button variant="outline" className="w-full mt-4">
//                   <FileText className="h-4 w-4 mr-2" />
//                   Export Report
//                 </Button>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default TaskManager;
import React from "react";

function TaskManager() {
  return <div></div>;
}

export default TaskManager;
