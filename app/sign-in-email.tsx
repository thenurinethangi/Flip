import { Redirect } from "expo-router";

export default function SignInEmailRedirect() {
	return <Redirect href="/(auth)/sign-in-email" />;
}
