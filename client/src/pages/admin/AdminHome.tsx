import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PageLoader from "@/components/PageLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MessageCard from "@/components/MessageCard";

const AdminHome = () => {
    const get = useGetAndDelete(axios.get);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState<string>('');

    const getUsers = async () => {
        const response = await get.callApi("auth/get-users", false, false);
        if (response?.data?.users) {
            setUsers(response.data.users);
            if (response.data.users.length === 0) {
                setMessage("Users not found");
            }
        } else {
            setMessage("Users not found");
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            {get.loading ? (
                <PageLoader />
            ) : (
                message == '' &&
                <div className="w-full flex items-center justify-center">
                    <Card className="w-full border-gray-300 shadow-none">
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Table>
                                <TableCaption>Users with plan</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Plan Name</TableHead>
                                        <TableHead>Plan Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map(
                                        (
                                            user: {
                                                name: string;
                                                email: string;
                                                plans: {
                                                    status: string;
                                                    pricingPlan: { planName: string };
                                                }[];
                                            },
                                            index: number
                                        ) => (
                                            <TableRow key={index}>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    {user.plans.length > 0
                                                        ? user.plans[0].pricingPlan.planName
                                                        : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {user.plans.length > 0
                                                        ? user.plans[0].status
                                                        : "-"}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
            {message !== '' && <MessageCard message={message} type="info" />}
        </>
    );
};

export default AdminHome;
