import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MessageCardProps {
    title?: string;
    message: string;
    type?: "error" | "success" | "info";
}

const typeStyles = {
    error: {
        iconColor: "text-red-500",
        borderColor: "border-red-200",
        bgColor: "bg-red-50",
    },
    success: {
        iconColor: "text-green-500",
        borderColor: "border-green-200",
        bgColor: "bg-green-50",
    },
    info: {
        iconColor: "text-blue-500",
        borderColor: "border-blue-200",
        bgColor: "bg-blue-50",
    },
};

const MessageCard: React.FC<MessageCardProps> = ({
    title = "Notice",
    message,
    type = "info",
}) => {
    const styles = typeStyles[type];

    return (
        <Card className={`w-full mx-auto shadow-none border ${styles.borderColor} ${styles.bgColor}`}>
            <CardHeader className="flex items-center gap-2">
                <AlertCircle className={`w-6 h-6 ${styles.iconColor}`} />
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-700">{message}</p>
            </CardContent>
        </Card>
    );
};

export default MessageCard;
