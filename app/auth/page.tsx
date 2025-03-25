import { SignInForm } from "@/components/signin-form";
import { SignUpForm } from "@/components/signup-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
	return (
		<div className="max-w-3xl mx-auto p-6 md:p-10">
			<div className="pt-10 md:pt-32">
				{/* Responsive Title */}
				<h1 className="scroll-m-20 text-[40px] md:text-[60px] lg:text-[90px] font-extrabold tracking-tight text-center mb-5">
					HealthSync
				</h1>

				{/* Responsive Tabs */}
				<Tabs defaultValue="sign-in" className="w-full max-w-[500px] mx-auto">
					<TabsList className="grid w-full grid-cols-2 md:grid-cols-2">
						<TabsTrigger value="sign-in">Sign In</TabsTrigger>
						<TabsTrigger value="sign-up">Sign Up</TabsTrigger>
					</TabsList>

					{/* Sign In Tab Content */}
					<TabsContent value="sign-in">
						<SignInForm />
					</TabsContent>

					{/* Sign Up Tab Content */}
					<TabsContent value="sign-up">
						<SignUpForm />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
