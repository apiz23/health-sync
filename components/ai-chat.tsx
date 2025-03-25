"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

interface Message {
	role: "user" | "assistant";
	content: string;
}

export default function ChatDialog() {
	const [messages, setMessages] = useState<Message[]>([
		{ role: "assistant", content: "Hello! How can I help you today?" },
	]);
	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const sendMessage = async () => {
		if (!input.trim()) return;

		const userId = sessionStorage.getItem("userId");
		if (!userId) {
			console.error("User ID not found in session storage");
			return;
		}

		const userMessage: Message = { role: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/chat`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ session_id: userId, message: input }),
			});

			if (!response.ok) throw new Error("Failed to fetch response");

			const data = await response.json();
			const aiMessage: Message = { role: "assistant", content: data.response };

			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<Dialog>
			<DialogTrigger className="py-2 text-center">
				<Button variant="outline" className="text-black w-full bg-white">
					Start Chat Session
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-black">Chatting With AI</DialogTitle>
					<DialogDescription>
						Ask Anything related your physical or diseases
					</DialogDescription>
				</DialogHeader>

				<div className="w-full mx-auto h-[60vh] flex flex-col">
					<div className="flex-1 overflow-y-auto p-2 space-y-2">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`p-2 rounded-lg w-fit max-w-[75%] whitespace-pre-wrap ${
									msg.role === "user"
										? "bg-blue-500 text-white ml-auto text-right"
										: "bg-gray-300 text-black mr-auto text-left"
								}`}
							>
								{msg.content.split("\n").map((line, i) => {
									if (/^\*\*(.*?)\*\*/.test(line)) {
										return (
											<p key={i} className="font-bold">
												{line.replace(/\*\*/g, "")}
											</p>
										);
									} else if (/^\d+\./.test(line)) {
										return (
											<ul key={i} className="list-disc pl-5">
												<li>{line.replace(/^\d+\.\s*/, "")}</li>
											</ul>
										);
									}
									// Regular text
									return <p key={i}>{line}</p>;
								})}
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					<div className="flex gap-2 mt-4">
						<Input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={async (e) => {
								if (e.key === "Enter") await sendMessage();
							}}
							className="flex-1 p-2 border rounded-lg text-black"
							placeholder="Type your message..."
						/>
						<Button
							onClick={sendMessage}
							className="bg-blue-500 text-white px-4 py-2 rounded-lg"
						>
							Send
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
