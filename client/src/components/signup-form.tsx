import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import usePostAndPut from "@/hooks/usePostAndPut";
import SpinnerLoader from "./SpinnerLoader";
import img from "@/assets/img.png"

interface User {
    name: string;
    email: string;
    password: string;
}

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
    const post = usePostAndPut(axios.post);
    const navigate = useNavigate();

    const defaultUserData: User = {
        name: "",
        email: "",
        password: "",
    };

    const [userData, setUserData] = useState<User>(defaultUserData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUserData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await post.callApi("auth/signup", userData, false, false, true);
        console.log(response);
        navigate("/");
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSignUp} className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome to Nexora</h1>
                                <p className="text-balance text-gray-500 dark:text-gray-400">
                                    create your account
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="john doe..."
                                    required
                                    value={userData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={userData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={userData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <Button disabled={post.loading} type="submit" className="w-full">
                                {
                                    post.loading ?
                                        <div className="flex items-center justify-center gap-3" >
                                            <span>
                                                Please wait
                                            </span>
                                            <SpinnerLoader color="white" size="10" />
                                        </div> : "Sign up"
                                }
                            </Button>
                            <div className="text-center text-sm">
                                if you have an account?
                                <Link to="/login" className="underline underline-offset-4">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="relative rounded-l-2xl hidden bg-gray-100 md:block dark:bg-gray-800">
                        <img
                            src={img}
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-gray-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-gray-900 dark:text-gray-400 dark:hover:[&_a]:text-gray-50">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}