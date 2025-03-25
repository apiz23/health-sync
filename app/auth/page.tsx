import { SignInForm } from "@/components/signin-form";
import { SignUpForm } from "@/components/signup-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
	return (
		<div className="max-w-3xl mx-auto gap-6 p-6 md:p-10">
			<div className="pt-32">
				<h1 className="scroll-m-20 text-[60px] font-extrabold tracking-tight lg:text-[90px] text-center mb-5">
					HealthSync
				</h1>
				<Tabs defaultValue="sign-in" className="w-[400px] mx-auto">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="sign-in">Sign In</TabsTrigger>
						<TabsTrigger value="sign-up">Sign Up</TabsTrigger>
					</TabsList>
					<TabsContent value="sign-in">
						<SignInForm />
					</TabsContent>
					<TabsContent value="sign-up">
						<SignUpForm />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
