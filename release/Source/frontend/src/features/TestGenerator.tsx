import { Dispatch, SetStateAction } from 'react';

interface TestGeneratorProps {
    language: string;
    setLanguage: Dispatch<SetStateAction<string>>;
    code: string;
    setCode: Dispatch<SetStateAction<string>>;
    testFramework: string;
    setTestFramework: Dispatch<SetStateAction<string>>;
}

const TEST_FRAMEWORKS: Record<string, string[]> = {
    python: ['pytest', 'unittest'],
    javascript: ['jest', 'mocha', 'vitest'],
    typescript: ['jest', 'vitest'],
    java: ['junit', 'testng'],
    'cpp': ['googletest', 'catch2'],
    go: ['testing'],
    rust: ['cargo test'],
    csharp: ['nunit', 'xunit'],
    php: ['phpunit'],
    ruby: ['rspec', 'minitest']
};

export default function TestGenerator({
    language,
    setLanguage,
    code,
    setCode,
    testFramework,
    setTestFramework
}: TestGeneratorProps) {
    const availableFrameworks = TEST_FRAMEWORKS[language] || ['auto'];

    return (
        <div className="space-y-4">
            {/* Language Selector */}
            <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                    Programming Language
                </label>
                <select
                    value={language}
                    onChange={(e) => {
                        setLanguage(e.target.value);
                        setTestFramework('auto');
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                </select>
            </div>

            {/* Test Framework Selector */}
            <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                    Test Framework
                </label>
                <select
                    value={testFramework}
                    onChange={(e) => setTestFramework(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                    <option value="auto">Auto (Recommended)</option>
                    {availableFrameworks.map(framework => (
                        <option key={framework} value={framework}>
                            {framework}
                        </option>
                    ))}
                </select>
            </div>

            {/* Code Input */}
            <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                    Code to Test
                </label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste the code you want to generate tests for..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                    rows={12}
                />
            </div>

            {/* Info Box */}
            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                <p className="text-sm text-teal-200">
                    <span className="font-bold">🧪 Auto-generates:</span> Happy path tests • Edge cases • Error handling • Mock objects • Setup/teardown • Clear assertions
                </p>
            </div>
        </div>
    );
}
