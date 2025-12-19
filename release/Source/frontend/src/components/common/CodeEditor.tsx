import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    language: string;
    code: string;
    onChange: (value: string | undefined) => void;
    height?: string;
    readOnly?: boolean;
}

export default function CodeEditor({ language, code, onChange, height = '400px', readOnly = false }: CodeEditorProps) {
    const getMonacoLanguage = (lang: string): string => {
        const langMap: { [key: string]: string } = {
            'python': 'python',
            'javascript': 'javascript',
            'typescript': 'typescript',
            'java': 'java',
            'cpp': 'cpp',
            'c++': 'cpp',
            'c': 'c',
            'csharp': 'csharp',
            'c#': 'csharp',
            'ruby': 'ruby',
            'go': 'go',
            'rust': 'rust',
            'php': 'php',
            'swift': 'swift',
            'kotlin': 'kotlin',
            'r': 'r',
            'perl': 'perl',
            'lua': 'lua',
            'bash': 'shell',
            'scala': 'scala',
            'Python': 'python',
            'JavaScript': 'javascript',
            'TypeScript': 'typescript',
            'Java': 'java',
            'C++': 'cpp',
            'C': 'c',
            'C#': 'csharp',
            'Ruby': 'ruby',
            'Go': 'go',
            'Rust': 'rust',
            'PHP': 'php',
            'Swift': 'swift',
            'Kotlin': 'kotlin',
            'R': 'r',
            'Perl': 'perl',
            'Lua': 'lua',
            'Bash': 'shell',
            'Scala': 'scala',
        };
        return langMap[lang] || 'plaintext';
    };

    return (
        <div className="rounded-xl overflow-hidden border border-emerald-500/30 shadow-lg" style={{ height }}>
            <Editor
                height="100%"
                language={getMonacoLanguage(language)}
                value={code}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    padding: { top: 12, bottom: 12 },
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    readOnly: readOnly,
                }}
            />
        </div>
    );
}
