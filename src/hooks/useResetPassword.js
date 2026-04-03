import { useMutation } from "@tanstack/react-query";
import { resetPasswordUser } from "../auth.api.js/reset-password.js";

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (resetData) => resetPasswordUser(resetData),
        onSuccess: (data) => {
            console.log("Password Reset Success:", data.message);
        },
        onError: (error) => {
            console.error(
                "Reset Password Error:", 
                error.response?.data?.message || error.message
            );
        }
    });
};