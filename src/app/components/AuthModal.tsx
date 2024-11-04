"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useGoogleSignIn } from "@/lib/auth/hooks";
// import { cn } from "@/lib/utils";

interface AuthModalProps {
  defaultView?: "login" | "signup";
  trigger?: React.ReactNode;
}

export default function AuthModal({
  defaultView = "login",
  trigger,
}: AuthModalProps = {}) {
  // States
  const [view, setView] = React.useState<"login" | "signup">(defaultView);
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Hooks
  //   const { user } = useAuth();
  const { mutate: signInWithGoogle, isPending: googleIsLoading } =
    useGoogleSignIn();

  const isFormValid = () => {
    if (view === "login") {
      return formData.email && formData.password;
    }
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.password
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation regex
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    //TODO handles login and signup logic
    if (view === "login") {
      // Login logic
    } else {
      // Signup logic
    }

    // If validation passes, show success toast
    toast.success(
      view === "login"
        ? "Logged in successfully!"
        : "Account created successfully!"
    );
    setIsOpen(false);
    // Add your authentication logic here
    console.log("Form submitted:", formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Login</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {view === "login" ? "Login" : "Sign Up"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {view === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={!isFormValid()}>
            {view === "login" ? "Login" : "Continue"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => signInWithGoogle()}
              disabled={googleIsLoading}>
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
          </div>
          <div className="text-center text-sm">
            {view === "login" ? (
              <p className="text-muted-foreground">
                New user?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4 hover:text-primary"
                  onClick={() => setView("signup")}>
                  Click to Sign Up
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already a user?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4 hover:text-primary"
                  onClick={() => setView("login")}>
                  Click to Login
                </button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
