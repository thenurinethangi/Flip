import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc } from "firebase/firestore"
import { fetchSignInMethodsForEmail } from "firebase/auth";

export const registerOrLoginUser = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return {
            success: true,
            action: "registered",
            user: userCredential.user,
        };
    } catch (error: any) {
        const code = error.code;

        if (code === "auth/email-already-in-use") {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                return {
                    success: true,
                    action: "login",
                    user: userCredential.user,
                };
            } catch (loginError: any) {
                if (loginError.code === "auth/wrong-password") {
                    return {
                        success: false,
                        message: "Incorrect password. Please try again.",
                    };
                } else if (loginError.code === "auth/user-not-found") {
                    return {
                        success: false,
                        message: "User does not exist.",
                    };
                } else if (loginError.code === "auth/invalid-credential") {
                    return {
                        success: false,
                        message: "Incorrect email or password!",
                    };
                } else {
                    return {
                        success: false,
                        message: loginError.message,
                    };
                }
            }
        } else if (code === "auth/invalid-email") {
            return {
                success: false,
                message: "Invalid email format.",
            };
        } else if (code === "auth/weak-password") {
            return {
                success: false,
                message: "Password too weak. Minimum 6 characters required.",
            };
        } else {
            return {
                success: false,
                message: error.message,
            };
        }
    }
};

export const login = async (email: string, password: string) => {

    return await signInWithEmailAndPassword(auth, email, password);
}