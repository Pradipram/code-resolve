import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="m-auto">
      <div className="flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center max-w-2xl w-full">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 text-center whitespace-nowrap">
            Welcome to{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Code-Resolve
            </span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
            Save your code for revision, practice DSA and competitive
            programming problems, and level up your coding skills.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
              <Image
                src="/file.svg"
                alt="DSA"
                width={32}
                height={32}
                className="mb-2"
              />
              <h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
                DSA Practice
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                Solve curated Data Structures & Algorithms problems and track
                your progress.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
              <Image
                src="/window.svg"
                alt="CP"
                width={32}
                height={32}
                className="mb-2"
              />
              <h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
                Competitive Programming
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                Tackle real-world coding challenges and prepare for contests.
              </p>
            </div>
          </div>
          <a href="/dashboard">
            <Button
              variant={"link"}
              className="text-blue-600 dark:text-blue-400"
            >
              Get Started
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
