import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ShadcnDemo: React.FC = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-12 bg-background text-foreground min-h-screen">
      <div>
        <h2 className="text-2xl font-bold mb-4">Shadcn/UI Dialog Demo</h2>
        <Dialog>
          <DialogTrigger className="btn btn-primary">Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Shadcn/UI Tabs Demo</h2>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Make changes to your account here.</TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
