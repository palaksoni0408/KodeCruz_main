import { useState, useEffect, useMemo, useCallback } from 'react';
import { Code2, Bug, Sparkles, ArrowRightLeft, BarChart3, Play, FileCode, Lightbulb, Map, Users, Terminal, Shield, FlaskConical, Wrench } from 'lucide-react';
import { apiService } from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import CollaborativeRoom from './components/CollaborativeRoom';
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import FeatureCard from './components/common/FeatureCard';
import ResponseCard from './components/common/ResponseCard';
import ExplainCode from './features/ExplainCode';
import DebugCode from './features/DebugCode';
import GenerateCode from './features/GenerateCode';
import ConvertLogic from './features/ConvertLogic';
import ComplexityAnalysis from './features/ComplexityAnalysis';
import TraceCode from './features/TraceCode';
import Snippets from './features/Snippets';
import ProjectIdeas from './features/ProjectIdeas';
import Roadmaps from './features/Roadmaps';
import Playground from './features/Playground';
import CodeReview from './features/CodeReview';
import TestGenerator from './features/TestGenerator';
import RefactorCode from './features/RefactorCode';
import Dashboard from './components/Dashboard';
import WorkflowBuilder from './components/workflow/WorkflowBuilder';

type Feature =
  | 'explain'
  | 'debug'
  | 'generate'
  | 'convert'
  | 'complexity'
  | 'trace'
  | 'snippets'
  | 'projects'
  | 'roadmaps'
  | 'playground'
  | 'collaborate'
  | 'review'      // AI Code Review
  | 'tests'       // Test Generator
  | 'refactor';   // Refactor Engine

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }
  const [activeFeature, setActiveFeature] = useState<Feature>('explain');
  const [showDashboard, setShowDashboard] = useState(true);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  // Form states
  const [language, setLanguage] = useState('python');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [code, setCode] = useState('');
  const [testFramework, setTestFramework] = useState<string>('auto');
  const [refactorType, setRefactorType] = useState<string>('general');
  const [logic, setLogic] = useState('');

  // Playground states
  const [playgroundCode, setPlaygroundCode] = useState('print("Hello, World!")');
  const [playgroundLanguage, setPlaygroundLanguage] = useState('Python');
  const [playgroundStdin, setPlaygroundStdin] = useState('');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);

  const assetBaseUrl = useMemo(() => {
    const assetEnv = import.meta.env.VITE_ASSET_BASE_URL;
    if (assetEnv) {
      return assetEnv.replace(/\/$/, '');
    }
    const apiEnv = import.meta.env.VITE_API_URL;
    if (apiEnv) {
      return apiEnv.replace(/\/$/, '');
    }
    if (import.meta.env.DEV) {
      return 'http://localhost:8000';
    }
    return 'https://kodescruxxx.onrender.com';
  }, []);

  const buildImageUrl = useCallback((filename: string) => {
    const encoded = encodeURIComponent(filename);
    return `${assetBaseUrl}/images/${encoded}`;
  }, [assetBaseUrl]);

  const featureBackgrounds = useMemo<Record<Feature, string>>(() => ({
    explain: buildImageUrl('Generated Image November 19, 2025 - 1_23PM.png'),
    debug: buildImageUrl('Generated Image November 19, 2025 - 1_24PM.png'),
    generate: buildImageUrl('Generated Image November 19, 2025 - 1_24PM (1).png'),
    convert: buildImageUrl('Generated Image November 19, 2025 - 1_25PM.png'),
    complexity: buildImageUrl('Generated Image November 19, 2025 - 1_26PM.png'),
    trace: buildImageUrl('Generated Image November 19, 2025 - 1_27PM.png'),
    snippets: buildImageUrl('Generated Image November 19, 2025 - 1_29PM.png'),
    projects: buildImageUrl('Generated Image November 19, 2025 - 1_30PM.png'),
    roadmaps: buildImageUrl('Generated Image November 19, 2025 - 1_31PM.png'),
    playground: buildImageUrl('Generated Image November 19, 2025 - 1_33PM.png'),
    collaborate: buildImageUrl('Generated Image November 19, 2025 - 1_33PM (1).png'),
    review: buildImageUrl('Generated Image November 19, 2025 - 1_24PM.png'),
    tests: buildImageUrl('Generated Image November 19, 2025 - 1_24PM (1).png'),
    refactor: buildImageUrl('Generated Image November 19, 2025 - 1_25PM.png'),
  }), [buildImageUrl]);

  const featureVideos = useMemo<Record<Feature, string | undefined>>(() => ({
    explain: buildImageUrl('45569-443244046_small.mp4'),
    debug: undefined,
    generate: undefined,
    convert: undefined,
    complexity: undefined,
    trace: undefined,
    snippets: undefined,
    projects: undefined,
    roadmaps: undefined,
    playground: undefined,
    collaborate: undefined,
    review: undefined,
    tests: undefined,
    refactor: undefined,
  }), [buildImageUrl]);

  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  const featureBackgroundStyle = useMemo(() => {
    if (activeFeature === 'collaborate') {
      return {};
    }

    // If there is a video for this feature, do not show the background image
    if (featureVideos[activeFeature]) {
      return {};
    }

    const imageUrl = featureBackgrounds[activeFeature];
    if (!imageUrl) {
      return {};
    }

    if (imageLoadErrors.has(imageUrl)) {
      return {
        background: 'linear-gradient(135deg, rgba(12,20,39,0.95), rgba(11,15,25,0.95))',
      };
    }

    return {
      backgroundImage: `linear-gradient(135deg, rgba(12,20,39,0.78), rgba(11,15,25,0.72)), url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }, [featureBackgrounds, activeFeature, imageLoadErrors, featureVideos]);

  useEffect(() => {
    const handleImageError = (imageUrl: string) => {
      setImageLoadErrors(prev => new Set(prev).add(imageUrl));
    };

    if (activeFeature !== 'collaborate') {
      const imageUrl = featureBackgrounds[activeFeature];
      if (imageUrl) {
        const img = new Image();
        img.onerror = () => handleImageError(imageUrl);
        img.onload = () => {
          setImageLoadErrors(prev => {
            const newSet = new Set(prev);
            newSet.delete(imageUrl);
            return newSet;
          });
        };
        img.src = imageUrl;
      }
    }
  }, [activeFeature, featureBackgrounds]);

  useEffect(() => {
    const wakeBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const wakeResponse = await fetch(`${apiUrl}/wake`, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (wakeResponse.ok) {
          setBackendConnected(true);
        }
      } catch (error) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          const healthResponse = await fetch(`${apiUrl}/health`, {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' },
          });
          if (healthResponse.ok) {
            setBackendConnected(true);
          } else {
            setBackendConnected(false);
          }
        } catch (healthError) {
          console.error('Backend connection check failed:', healthError);
          setBackendConnected(false);
        }
      }
    };

    wakeBackend();
    const interval = setInterval(wakeBackend, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const preloadImages = () => {
      Object.values(featureBackgrounds).forEach((imageUrl) => {
        const img = new Image();
        img.src = imageUrl;
        img.onerror = () => {
          console.warn(`Failed to load background image: ${imageUrl}`);
        };
      });
    };
    preloadImages();
  }, [featureBackgrounds]);

  const features = [
    { id: 'explain' as Feature, icon: Code2, label: 'Explain Code', color: 'blue' },
    { id: 'debug' as Feature, icon: Bug, label: 'Debug Code', color: 'red' },
    { id: 'generate' as Feature, icon: Sparkles, label: 'Generate Code', color: 'purple' },
    { id: 'convert' as Feature, icon: ArrowRightLeft, label: 'Convert Logic', color: 'green' },
    { id: 'complexity' as Feature, icon: BarChart3, label: 'Analyze Complexity', color: 'orange' },
    { id: 'trace' as Feature, icon: Play, label: 'Trace Code', color: 'cyan' },
    { id: 'snippets' as Feature, icon: FileCode, label: 'Code Snippets', color: 'pink' },
    { id: 'projects' as Feature, icon: Lightbulb, label: 'Project Ideas', color: 'yellow' },
    { id: 'roadmaps' as Feature, icon: Map, label: 'Learning Roadmaps', color: 'indigo' },
    { id: 'playground' as Feature, icon: Terminal, label: 'Code Playground', color: 'emerald' },
    { id: 'collaborate' as Feature, icon: Users, label: 'Collaborative Rooms', color: 'violet' },
    { id: 'review' as Feature, icon: Shield, label: 'Code Review', color: 'red' },
    { id: 'tests' as Feature, icon: FlaskConical, label: 'Test Generator', color: 'teal' },
    { id: 'refactor' as Feature, icon: Wrench, label: 'Refactor Code', color: 'amber' },
  ];

  useEffect(() => {
    const loadSupportedLanguages = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/supported_languages`);
        if (response.ok) {
          const data = await response.json();
          setSupportedLanguages(data.languages || []);
        }
      } catch (error) {
        console.error('Failed to load supported languages:', error);
      }
    };
    loadSupportedLanguages();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const startTime = performance.now();

      if (activeFeature === 'playground') {
        if (!playgroundCode || !playgroundLanguage) {
          setError('Please provide code and select a language');
          setLoading(false);
          return;
        }
        const execResult = await apiService.executeCode(
          playgroundCode,
          playgroundLanguage,
          playgroundStdin
        );
        setExecutionResult(execResult);

        // Log activity for playground
        const duration = performance.now() - startTime;
        apiService.logActivity('playground', playgroundLanguage, true, duration).catch(console.error);

        setLoading(false);
        return;
      }

      let streamFunction: (onChunk: (chunk: string) => void) => Promise<void>;

      switch (activeFeature) {
        case 'explain':
          if ((!topic && !code) || !language || !level) {
            setError('Please provide either code or topic, along with language and level');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamExplainCode(language, topic, level, code, onChunk);
          break;

        case 'debug':
          if (!code || !language) {
            setError('Please provide code and language');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamDebugCode(language, code, topic, onChunk);
          break;

        case 'generate':
          if (!topic || !language || !level) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamGenerateCode(language, topic, level, onChunk);
          break;

        case 'convert':
          if (!logic || !language) {
            setError('Please provide logic and target language');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamConvertLogic(logic, language, onChunk);
          break;

        case 'complexity':
          if (!code) {
            setError('Please provide code to analyze');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamAnalyzeComplexity(code, onChunk);
          break;

        case 'trace':
          if (!code || !language) {
            setError('Please provide code and language');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamTraceCode(code, language, onChunk);
          break;

        case 'snippets':
          if (!topic || !language) {
            setError('Please provide topic and language');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamGetSnippets(language, topic, onChunk);
          break;

        case 'projects':
          if (!topic || !level) {
            setError('Please provide topic and level');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamGetProjects(level, topic, onChunk);
          break;

        case 'roadmaps':
          if (!topic || !level) {
            setError('Please provide topic and level');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamGetRoadmaps(level, topic, onChunk);
          break;

        case 'review':
          if (!code || !language) {
            setError('Please provide code and language for review');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamReviewCode(code, language, onChunk);
          break;

        case 'tests':
          if (!code || !language) {
            setError('Please provide code and language for test generation');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamGenerateTests(code, language, testFramework, onChunk);
          break;

        case 'refactor':
          if (!code || !language) {
            setError('Please provide code and language for refactoring');
            setLoading(false);
            return;
          }
          streamFunction = (onChunk) => apiService.streamRefactorCode(code, language, refactorType, onChunk);
          break;

        default:
          setLoading(false);
          return;
      }

      await streamFunction((chunk: string) => {
        setResponse(prev => prev + chunk);
      });

      // Log activity for streaming features
      const duration = performance.now() - startTime;
      apiService.logActivity(activeFeature, language, true, duration).catch(console.error);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Log failed activity
      const duration = performance.now() - (performance.now()); // Approximate
      apiService.logActivity(activeFeature, language, false, duration).catch(console.error);
    } finally {
      setLoading(false);
    }
  };

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'explain':
        return (
          <ExplainCode
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            topic={topic}
            setTopic={setTopic}
            level={level}
            setLevel={setLevel}
          />
        );
      case 'debug':
        return (
          <DebugCode
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            topic={topic}
            setTopic={setTopic}
          />
        );
      case 'generate':
        return (
          <GenerateCode
            language={language}
            setLanguage={setLanguage}
            topic={topic}
            setTopic={setTopic}
            level={level}
            setLevel={setLevel}
          />
        );
      case 'convert':
        return (
          <ConvertLogic
            language={language}
            setLanguage={setLanguage}
            logic={logic}
            setLogic={setLogic}
          />
        );
      case 'complexity':
        return (
          <ComplexityAnalysis
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
          />
        );
      case 'trace':
        return (
          <TraceCode
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
          />
        );
      case 'snippets':
        return (
          <Snippets
            language={language}
            setLanguage={setLanguage}
            topic={topic}
            setTopic={setTopic}
          />
        );
      case 'projects':
        return (
          <ProjectIdeas
            level={level}
            setLevel={setLevel}
            topic={topic}
            setTopic={setTopic}
          />
        );
      case 'roadmaps':
        return (
          <Roadmaps
            level={level}
            setLevel={setLevel}
            topic={topic}
            setTopic={setTopic}
          />
        );
      case 'review':
        return (
          <CodeReview
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
          />
        );
      case 'tests':
        return (
          <TestGenerator
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            testFramework={testFramework}
            setTestFramework={setTestFramework}
          />
        );
      case 'refactor':
        return (
          <RefactorCode
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            refactorType={refactorType}
            setRefactorType={setRefactorType}
          />
        );

      case 'playground':
        return (
          <Playground
            language={playgroundLanguage}
            setLanguage={setPlaygroundLanguage}
            code={playgroundCode}
            setCode={setPlaygroundCode}
            stdin={playgroundStdin}
            setStdin={setPlaygroundStdin}
            supportedLanguages={supportedLanguages}
            executionResult={executionResult}
            backgroundStyle={featureBackgroundStyle}
          />
        );
      default:
        return null;
    }
  };

  if (activeFeature === 'collaborate') {
    return (
      <Layout>
        <div className="flex-1 flex flex-col container mx-auto px-4 py-4 w-full max-w-[1920px]">
          <Header backendConnected={backendConnected} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <Sidebar
              features={features}
              activeFeature={activeFeature}
              setActiveFeature={(id) => setActiveFeature(id as Feature)}
              onFeatureChange={() => {
                setResponse('');
                setError('');
                setExecutionResult(null);
              }}
            />
            <div className="lg:col-span-4">
              <CollaborativeRoom />
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col container mx-auto px-4 py-4 w-full max-w-[1920px]">
        <Header backendConnected={backendConnected} />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Sidebar
            features={features}
            activeFeature={activeFeature}
            setActiveFeature={(id) => setActiveFeature(id as Feature)}
            onFeatureChange={() => {
              setResponse('');
              setError('');
              setExecutionResult(null);
              setShowDashboard(false);
              setShowWorkflowBuilder(false);
            }}
            onDashboardClick={() => {
              setShowDashboard(true);
              setShowWorkflowBuilder(false);

              // Reset active feature visual state if needed, or keep last active
            }}
            onWorkflowClick={() => {
              setShowWorkflowBuilder(true);
              setShowDashboard(false);

            }}
          />
          <div className="lg:col-span-4">
            {showDashboard ? (
              <Dashboard />
            ) : showWorkflowBuilder ? (
              <WorkflowBuilder />
            ) : (
              <div className="space-y-4 pb-8">
                <FeatureCard
                  title={features.find(f => f.id === activeFeature)?.label || ''}
                  icon={features.find(f => f.id === activeFeature)?.icon}
                  onSubmit={handleSubmit}
                  loading={loading}
                  isPlayground={activeFeature === 'playground'}
                  backgroundStyle={featureBackgroundStyle}
                  videoUrl={featureVideos[activeFeature]}
                  error={error}
                >
                  {renderFeatureContent()}
                </FeatureCard>

                {activeFeature !== 'playground' && (
                  <ResponseCard
                    response={response}
                    loading={loading}
                    backgroundStyle={featureBackgroundStyle}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}