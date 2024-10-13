import clsx from "clsx";
import type { Metadata } from "next";
import { Roboto_Flex as Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Desvende",
	description: "Desvende a palavra",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={clsx(roboto.className, "bg-indigo-950 text-gray-100")}>
				{children}
				<Toaster position="top-center" reverseOrder={false} />
			</body>
		</html>
	);
}
