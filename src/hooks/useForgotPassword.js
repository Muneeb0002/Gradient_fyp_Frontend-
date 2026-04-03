import { useMutation } from "@tanstack/react-query";
import { forgotPasswordUser } from "../auth.api.js/forgot-password.api.js";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPasswordUser,
        onSuccess: (data) => {
            console.log("OTP Sent Successfully:", data.message);
            // Yahan aap toast notification dikha sakte hain
        },
        onError: (error) => {
            console.error("Error sending OTP:", error.response?.data?.message || error.message);
        }
    });
};