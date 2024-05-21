import Image from "next/image";
import { CodeiumLogo } from "./codeium";
import { CodeiumBlueBokeh } from "./img/CodeiumBlueBokeh";
import { CodeiumGreenBokeh } from "./img/CodeiumGreenBokeh";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-stretch dark:bg-neutral-900">
      <div className="p-8 bg-neutral-900">
        <CodeiumBlueBokeh />
        <CodeiumGreenBokeh />
        <div className="px-16 pt-16 pb-8">
          <div className="flex flex-col items-stretch">
            <h1 className="text-3xl tracking-tight font-semibold bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent text-center">
              AI Code Completion in CodeSandbox
            </h1>
            <h2 className="text-xl flex flex-row items-center justify-center mt-2 text-white">
              <span className="opacity-50">Powered by </span>
              <a
                href="https://codeium.com"
                rel="noreferrer"
                target="_blank"
                className="opacity-80 hover:opacity-100 transition-opacity ml-2"
              >
                <CodeiumLogo className="max-h-7 min-h-7" />
              </a>
            </h2>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mt-8 text-white opacity-80">
            Get started
          </h2>
          <div className="opacity-70 text-white">
            To use Codeium in CodeSandbox, start writing code. Once a code
            suggestion appears after your cursor, press tab to accept the
            suggestion.
          </div>
        </div>
      </div>
      <div className="px-8 relative">
        <div className="bg-neutral-900 h-1/2 absolute top-0 left-0 w-full" />
        <video
          width="100%"
          controls
          autoPlay={true}
          loop
          className="z-10 relative rounded-lg border border-neutral-500 shadow-lg"
        >
          <source src="/codesandbox-demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="p-8 mt-8">
        <h2 className="text-xl font-semibold mt-8 bg-gradient-to-r from-neutral-600 to-neutral-900 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent inline">
          Configuring Codeium on CodeSandbox
        </h2>
        <div className="opacity-70">
          By default, AI features are not turned on in your CodeSandbox Devbox.
          To enable code completion, visit your settings page and turn on AI
          features.
        </div>
        <div className="mt-4 mb-16">
          <img
            alt="CodeSandbox Demo"
            src="https://exafunction.github.io/public/demos/codesandbox-settings.png"
            className="w-full"
          />
        </div>

        <h2 className="text-xl font-semibold bg-gradient-to-r dark:from-neutral-200 dark:to-neutral-400 from-neutral-600 to-neutral-900 bg-clip-text text-transparent inline">
          What's Codeium?
        </h2>
        <div className="opacity-70 flex flex-row mt-2 font-light">
          Codeium is an AI coding assistant that provides intelligent
          suggestions as you write code. In addition to code completion, Codeium
          allows you to chat with your code, refactor code blocks, and generate
          code snippets using natural language. It supports over 70 programming
          languages and integrates with more than 40 code editors, including
          CodeSandbox.
        </div>
        <div className="p-8 flex flex-col gap-8 items-center max-w-xl mx-auto">
          <img src="/codesandbox-editors.png" alt="CodeSandbox Demo" />
          <img src="/codesandbox-languages.png" alt="CodeSandbox Demo" />
        </div>
        <a
          className="mx-auto block text-center"
          href="https://codeium.com"
          target="_blank"
          rel="noreferrer"
        >
          <button className="mt-4 bg-gradient-to-r from-teal-600 to-teal-900 p-4 font-medium rounded-lg hover:shadow-lg hover:shadow-teal-500/10 transition-shadow text-white">
            Learn more about Codeium
          </button>
        </a>
      </div>
    </main>
  );
}
