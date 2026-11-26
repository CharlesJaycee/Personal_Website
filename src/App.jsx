import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, ArrowRight, ArrowUp, ExternalLink, 
  Send, X, CheckCircle2, Zap, Code, Database, 
  Globe, Sparkles, GraduationCap, 
  Mail, Layers, Terminal, Volume2, VolumeX, AlertCircle, SkipForward,
  Copy, Check, Music
} from 'lucide-react';

// Import your profile photos from assets
import profileHome from './assets/profile-home.jpg';
import profileAbout from './assets/profile-about.jpg';

// Reusable Scroll Reveal wrapper component
function Reveal({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function App() {
  const WEB3FORMS_ACCESS_KEY = '08f1ece3-66f7-4524-9267-bb6c572eb665';

  // Start in Dark Mode by default
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);

  // Top Scroll Progress Bar & Floating Back-to-Top state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Custom Cursor Spotlight state
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  // One-click Copy Email state
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Interactive Skill card selection (for mobile tap or desktop hover)
  const [activeSkill, setActiveSkill] = useState(null);

  // 4-Track Ambient Background Playlist + Now-Playing Toast
  const playlist = [
    { title: 'Ambient Track 1', src: './track1.mp3' },
    { title: 'Ambient Track 2', src: './track2.mp3' },
    { title: 'Ambient Track 3', src: './track3.mp3' },
    { title: 'Ambient Track 4', src: './track4.mp3' }
  ];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const audioRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const userPausedRef = useRef(false);

  // Smart Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am Jay Assistant. Ask me anything about Charles Jaycee L. Grico, or tap a topic below to jump straight to it!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');

  // Typing animation state for Hero title
  const fullTitle = "Hi, I'm Charles Jaycee";
  const [typedTitle, setTypedTitle] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  const triggerNowPlayingToast = () => {
    setShowNowPlaying(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowNowPlaying(false);
    }, 3500);
  };

  // Loading progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + 4;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Autoplay audio on visit (with automatic first-interaction fallback for strict browsers)
  useEffect(() => {
    if (loading) return;

    const attemptAutoplay = () => {
      if (!audioRef.current || userPausedRef.current) return;
      audioRef.current.volume = 0.25;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          triggerNowPlayingToast();
          cleanupListeners();
        })
        .catch(() => {
          // Browser blocked unmuted autoplay; wait for first user click/keydown
        });
    };

    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', attemptAutoplay);
      window.removeEventListener('keydown', attemptAutoplay);
    };

    attemptAutoplay();
    window.addEventListener('pointerdown', attemptAutoplay);
    window.addEventListener('keydown', attemptAutoplay);

    return () => cleanupListeners();
  }, [loading]);

  // Run typing animation once loading finishes
  useEffect(() => {
    if (!loading && charIndex < fullTitle.length) {
      const timeout = setTimeout(() => {
        setTypedTitle((prev) => prev + fullTitle[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 85);
      return () => clearTimeout(timeout);
    }
  }, [loading, charIndex, fullTitle]);

  // Cursor spotlight tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (chatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen, isTyping]);

  // Scroll tracking: Active section, Top Scroll Progress Bar, and Floating Back-to-Top
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setScrollProgress(pct);
      setShowBackToTop(scrollTop > 450);

      const sections = ['home', 'about', 'educational', 'skills', 'projects', 'contacts'];
      const scrollPosition = scrollTop + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      userPausedRef.current = true;
      audioRef.current.pause();
      setIsPlayingMusic(false);
      setShowNowPlaying(false);
    } else {
      userPausedRef.current = false;
      audioRef.current.volume = 0.25;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          triggerNowPlayingToast();
        })
        .catch(() => setIsPlayingMusic(false));
    }
  };

  const nextTrack = () => {
    userPausedRef.current = false;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.25;
        audioRef.current
          .play()
          .then(() => {
            setIsPlayingMusic(true);
            triggerNowPlayingToast();
          })
          .catch(() => setIsPlayingMusic(false));
      }
    }, 50);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('charlesjayceegrico@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Smart Jay Assistant response engine with direct action buttons
  const processAssistantQuery = (rawText) => {
    const userText = rawText.trim();
    if (!userText) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: currentTime
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I am Jay Assistant. Charles Jaycee L. Grico is a BSIT student at Adamson University focused on C# programming and front-end web development.";
      let action = null;
      const query = userText.toLowerCase();

      if (query.includes('who are you') || query.includes('who') || query.includes('identity') || query.includes('about')) {
        botResponse = "I am Jay Assistant, the personal AI helper for Charles Jaycee L. Grico—a BSIT student at Adamson University passionate about software engineering and modern UI design.";
        action = { label: 'Go to About Me', type: 'scroll', target: 'about' };
      } else if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('language') || query.includes('tools')) {
        botResponse = "Charles works with C# (.NET & OOP), React.js, JavaScript, HTML5, CSS3, Tailwind CSS, and Git/GitHub.";
        action = { label: 'View Tech Stack', type: 'scroll', target: 'skills' };
      } else if (query.includes('project') || query.includes('work') || query.includes('portfolio') || query.includes('built')) {
        botResponse = "Charles has built a C# Student Management System, a Responsive Tourist Landing Page, and an interactive TCG Deck Strategy & Ratio Calculator.";
        action = { label: 'Explore Projects', type: 'scroll', target: 'projects' };
      } else if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('facebook') || query.includes('phone')) {
        botResponse = "You can email Charles directly at charlesjayceegrico@gmail.com or send a message through the Contact section below.";
        action = { label: 'Copy Email Address', type: 'copy' };
      } else if (query.includes('education') || query.includes('university') || query.includes('college') || query.includes('gwa') || query.includes('degree') || query.includes('major')) {
        botResponse = "Charles is pursuing a Bachelor of Science in Information Technology (BSIT) at Adamson University with a 1.00 GWA.";
        action = { label: 'Academic Timeline', type: 'scroll', target: 'educational' };
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          action,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 650);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    processAssistantQuery(chatInput);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Portfolio Message from ${formData.name}`
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 4000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  const frontendSkills = [
    { name: 'HTML5', icon: Globe, level: 92, note: 'Semantic markup, SEO structure & accessible layouts' },
    { name: 'CSS3', icon: Layers, level: 90, note: 'Custom animations, Flexbox/Grid & glassmorphism UI' },
    { name: 'JavaScript', icon: Code, level: 85, note: 'ES6+, DOM manipulation, async APIs & interactive logic' },
    { name: 'React.js', icon: Code, level: 84, note: 'Hooks, state management & modular component architecture' },
    { name: 'Tailwind CSS', icon: Layers, level: 91, note: 'Rapid responsive styling & dark/light theme systems' },
    { name: 'Git & GitHub', icon: Terminal, level: 86, note: 'Version control, branch workflows & GitHub Pages CI/CD' }
  ];

  const softwareSkills = [
    { name: 'C# (.NET)', icon: Terminal, level: 88, note: 'Console applications, file handling & role-based systems' },
    { name: 'OOP Principles', icon: Code, level: 86, note: 'Encapsulation, inheritance, polymorphism & clean classes' },
    { name: 'Data Structures', icon: Database, level: 83, note: 'Multi-dimensional & jagged arrays, lists & collections' },
    { name: 'Algorithms', icon: Zap, level: 84, note: 'Search/sort logic, input validation & step-by-step problem solving' }
  ];

  const projects = [
    {
      id: 'student-management-system',
      title: 'Student Management System',
      shortDesc: 'A C# console application engineered for student record management, featuring search, data entry, and removal logic.',
      fullDesc: 'Developed a console application utilizing object-oriented programming principles, nested loops, and switch structures. Features student record search algorithms, validation prompts, data entry handling, and array management.',
      imageBg: 'from-blue-950 to-zinc-950',
      previewCode: 'STUDENT MANAGEMENT SYSTEM v1.0\n[Language: C# (.NET)]\n- Record Search & Data Entry\n- Multi-dimensional & Jagged Arrays\n- OOP Architecture & Input Validation',
      tags: ['C#', '.NET', 'OOP', 'DATA STRUCTURES', 'CONSOLE APP']
    },
    {
      id: 'tourist-portfolio',
      title: 'Responsive Tourist Landing Page',
      shortDesc: 'A single-page tourist guide website featuring custom card layouts, gradients, and embedded media.',
      fullDesc: 'Designed and developed a responsive single-page tourist website featuring localized navigation sections, custom CSS card layouts, background color gradients, embedded auto-play media, and GitHub social integration.',
      imageBg: 'from-cyan-950 to-slate-900',
      previewCode: 'TOURIST PORTFOLIO WEBSITE\n[Tech: HTML5 + CSS3 + JS]\n- Responsive Card Layout & Gradients\n- Interactive Navigation Anchor Links\n- Embedded Media & Social Integration',
      tags: ['HTML5', 'CSS3', 'JAVASCRIPT', 'TAILWIND CSS', 'GITHUB']
    },
    {
      id: 'tcg-deck-builder',
      title: 'TCG Deck Strategy & Ratio Calculator',
      shortDesc: 'An interactive web application to calculate and optimize card ratios for competitive deck building.',
      fullDesc: 'Built an interactive utility web tool designed to calculate and optimize deck ratios between Basic, Stage 1, Stage 2 Pokémon, Trainer cards, and Energy distributions.',
      imageBg: 'from-amber-950 to-zinc-900',
      previewCode: 'TCG DECK OPTIMIZER\n[Status: ACTIVE]\n- Card Ratio Calculation Engine\n- Energy & Trainer Balance Helper\n- Interactive Deck Analyzer',
      tags: ['JAVASCRIPT', 'REACT', 'TAILWIND CSS', 'HTML5', 'GIT']
    }
  ];

  const experiences = [
    {
      year: '2026',
      role: 'Front-End Web Developer (Academic)',
      company: 'ADAMSON UNIVERSITY',
      desc: 'Designed and deployed responsive single-page web applications. Applied modern layout standards, custom CSS styling, component structures, and GitHub version control management.',
      tech: ['HTML5', 'CSS3', 'JAVASCRIPT', 'REACT', 'TAILWIND CSS', 'GIT', 'GITHUB']
    },
    {
      year: '2026',
      role: 'C# Systems Developer (Academic)',
      company: 'ADAMSON UNIVERSITY',
      desc: 'Programmed algorithms and system management tools in C#. Implemented core Object-Oriented Programming (OOP) concepts, data structures (multi-dimensional & jagged arrays), and input validation routines.',
      tech: ['C#', '.NET', 'OOP', 'DATA STRUCTURES', 'CONSOLE APPS', 'ALGORITHMS']
    },
    {
      year: '2025 - 2026',
      role: 'System Activity & Performance Analyst',
      company: 'LOGGY3 PLATFORM',
      desc: 'Monitored activity hours, input efficiency, and workflow metrics across execution tiers while ensuring consistent system data management.',
      tech: ['WORKFLOW MONITORING', 'METRICS TRACKING', 'SYSTEM LOGS', 'DATA MANAGEMENT']
    }
  ];

  return (
    <div className={darkMode ? 'dark bg-zinc-950 text-zinc-100 min-h-screen font-sans selection:bg-sky-500/30 selection:text-sky-200 transition-colors duration-300 relative' : 'bg-[#f7f8fa] text-zinc-900 min-h-screen font-sans selection:bg-indigo-500/20 selection:text-indigo-900 transition-colors duration-300 relative'}>
      
      {/* Smooth Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 dark:from-sky-400 dark:via-cyan-300 dark:to-emerald-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Custom Cursor Spotlight / Subtle Radial Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: darkMode
            ? `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.07), transparent 80%)`
            : `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.05), transparent 80%)`
        }}
      />

      {/* Multi-track Playlist Audio Player */}
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex].src}
        onEnded={nextTrack}
        preload="auto"
      />

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-opacity duration-500">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-950 dark:text-white transition-colors">
              CHARLES JAYCEE
            </h1>
            <p className="text-xs tracking-[0.3em] font-medium text-indigo-500 dark:text-sky-400 uppercase transition-colors">
              PORTFOLIO LOADING
            </p>
            <div className="w-56 h-[3px] bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto overflow-hidden relative mt-6">
              <div 
                className="h-full bg-indigo-600 dark:bg-sky-400 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <header className="fixed top-4 inset-x-0 z-40 px-4 pointer-events-none">
        <nav className="max-w-4xl mx-auto pointer-events-auto rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 px-6 py-3 shadow-lg shadow-black/[0.03] flex items-center justify-between transition-all duration-300">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-lg font-black tracking-tight text-indigo-950 dark:text-white hover:opacity-80 transition-colors cursor-pointer"
          >
            JAY<span className="text-indigo-600 dark:text-sky-400 transition-colors">.</span>
          </button>

          <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Me' },
              { id: 'educational', label: 'Academic Experience' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'contacts', label: 'Contacts' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform active:scale-95 cursor-pointer ${
                  activeSection === link.id
                    ? 'bg-indigo-600 dark:bg-sky-400 text-white dark:text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-sky-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* Play / Mute Music Button */}
            <button
              onClick={toggleMusic}
              aria-label="Toggle Background Music"
              title={isPlayingMusic ? `Playing: ${playlist[currentTrackIndex].title}` : 'Play Ambient Music'}
              className={`p-2 rounded-full border transition-all duration-300 cursor-pointer ${
                isPlayingMusic
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-zinc-100/80 dark:bg-zinc-800/80 border-zinc-200/80 dark:border-zinc-700/80 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-sky-400'
              }`}
            >
              {isPlayingMusic ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Next Track Button */}
            <button
              onClick={nextTrack}
              aria-label="Next Track"
              title={`Next Track (${playlist[(currentTrackIndex + 1) % playlist.length].title})`}
              className="p-2 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-sky-400 transition-all duration-300 cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle Theme"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 dark:bg-sky-400/10 dark:hover:bg-sky-400/20 border border-indigo-500/20 dark:border-sky-400/20 transition-all duration-300 cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-sky-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>
          </div>
        </nav>

        {/* Mini Now-Playing Toast / Track Title Display */}
        <div
          className={`max-w-4xl mx-auto mt-2.5 flex justify-end transition-all duration-300 ${
            showNowPlaying && isPlayingMusic
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="pointer-events-auto inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-md text-xs">
            <Music className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Now Playing:</span>
            <span className="font-bold text-indigo-600 dark:text-sky-400 transition-colors">
              {playlist[currentTrackIndex].title}
            </span>
            <span className="text-[10px] text-zinc-400">
              ({currentTrackIndex + 1}/{playlist.length})
            </span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 relative z-10">
        <section id="home" className="max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 text-left">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-indigo-950 dark:text-white transition-colors duration-300 min-h-[1.2em]">
                {typedTitle}
                <span className="inline-block w-[3px] h-[0.9em] bg-indigo-600 dark:bg-sky-400 ml-1 align-middle animate-pulse transition-colors duration-300" />
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-600 dark:text-sky-400 tracking-tight transition-colors duration-300">
                BSIT Student & Developer
              </h2>
            </div>

            <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed max-w-xl transition-colors duration-300">
              Welcome to my personal website! I am a passionate Information Technology student at Adamson University focused on C# programming logic, and responsive front-end web development.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => scrollToSection('projects')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-zinc-950 text-white font-semibold text-sm transition-all shadow-md gap-2 group cursor-pointer"
              >
                Explore Work 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a 
                href="#contacts"
                onClick={(e) => { e.preventDefault(); scrollToSection('contacts'); }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-sky-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium text-sm transition-all gap-2"
              >
                Get in Touch 
                <Mail className="w-4 h-4 text-indigo-600 dark:text-sky-400 transition-colors" />
              </a>
            </div>

            <div className="pt-6 space-y-2">
              <p className="text-xs uppercase tracking-widest font-semibold text-indigo-600/80 dark:text-sky-400/80 transition-colors">
                CONNECT
              </p>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://www.facebook.com/HeyItzceejay07/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-sky-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-all"
                  title="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/CharlesJaycee" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-sky-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-all"
                  title="GitHub"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/_mxkora/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-sky-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-all"
                  title="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="relative flex-1 w-full max-w-md flex justify-center items-center">
            <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-zinc-300/50 dark:border-zinc-700/50 group">
              <img 
                src={profileHome} 
                alt="Charles Jaycee" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-4 top-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-3.5 flex items-center space-x-3 transition hover:scale-105 z-20">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-sky-400 transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                BSIT Student{' '}
                <a
                  href="https://www.adamson.edu.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-sky-400 hover:underline transition-colors"
                >
                  @ Adamson
                </a>
              </span>
            </div>

            <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-3.5 flex items-center space-x-3 transition hover:scale-105 z-20">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-sky-400 transition-colors">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                C# & Front-End Focus
              </span>
            </div>

            <div className="absolute -left-2 bottom-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-3.5 flex items-center space-x-3 transition hover:scale-105 z-20">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-sky-400 transition-colors">
                <Code className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Web & Software Dev
              </span>
            </div>
          </div>
        </section>

        <section id="about" className="max-w-5xl mx-auto px-6 py-16">
          <Reveal>
            <div className="text-center space-y-2 mb-12">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-indigo-600 dark:text-sky-400 transition-colors">
                DISCOVER
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-950 dark:text-white transition-colors">
                About Me
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Reveal delay={100} className="md:col-span-4">
              <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
                <div className="w-44 h-56 rounded-2xl overflow-hidden mb-4 border border-zinc-300 dark:border-zinc-700 shadow-md">
                  <img 
                    src={profileAbout} 
                    alt="Charles Jaycee Portrait" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-lg text-indigo-950 dark:text-white transition-colors">
                  Charles Jaycee L. Grico
                </h3>
                <p className="text-xs text-indigo-600 dark:text-sky-400 font-medium mt-1 transition-colors">
                  BSIT Student @ Adamson University
                </p>
              </div>
            </Reveal>

            <div className="md:col-span-8 flex flex-col space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Reveal delay={200}>
                  <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-indigo-300 dark:hover:border-sky-500/40 transition">
                    <h3 className="font-bold text-lg text-indigo-950 dark:text-sky-300 mb-3 transition-colors">
                      Who Am I
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed transition-colors">
                      I am a Bachelor of Science in Information Technology (BSIT) student at Adamson University dedicated to building clean, accessible web interfaces and software solutions.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={300}>
                  <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-indigo-300 dark:hover:border-sky-500/40 transition">
                    <h3 className="font-bold text-lg text-indigo-950 dark:text-sky-300 mb-3 transition-colors">
                      My Approach
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed transition-colors">
                      I emphasize clean code structure, object-oriented principles, responsive layouts, and modern front-end practices in every academic project.
                    </p>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={400}>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-indigo-950 dark:text-white mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-3 transition-colors">
                    Personal Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-500 dark:text-sky-400 block transition-colors">
                        NAME
                      </span>
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                        Charles Jaycee L. Grico
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-500 dark:text-sky-400 block transition-colors">
                        LOCATION
                      </span>
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                        Philippines
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-500 dark:text-sky-400 block transition-colors">
                        DEGREE PROGRAM
                      </span>
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                        BSIT (Information Technology)
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-500 dark:text-sky-400 block transition-colors">
                        GWA
                      </span>
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                        1.00
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-500 dark:text-sky-400 block transition-colors">
                        EMAIL (ONE-CLICK COPY)
                      </span>
                      <button
                        onClick={handleCopyEmail}
                        title="Click to copy email"
                        className="mt-0.5 inline-flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer group"
                      >
                        <span>charlesjayceegrico@gmail.com</span>
                        {copiedEmail ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Copied!
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors" />
                        )}
                      </button>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-500 dark:text-sky-400 block transition-colors">
                        EDUCATION
                      </span>
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                        Adamson University
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <div className="py-8 overflow-hidden bg-zinc-100/50 dark:bg-zinc-900/40 border-y border-zinc-200/60 dark:border-zinc-800/60 my-8">
          <div className="whitespace-nowrap flex animate-marquee space-x-8 text-2xl sm:text-4xl font-extrabold tracking-tight text-indigo-950/20 dark:text-sky-400/20 select-none transition-colors">
            {Array(6).fill(0).map((_, i) => (
              <span key={i} className="inline-flex items-center space-x-6">
                <span>Charles Jaycee</span>
                <span className="text-indigo-400/40 dark:text-sky-500/40">•</span>
                <span>BSIT Student</span>
                <span className="text-indigo-400/40 dark:text-sky-500/40">•</span>
                <span>Adamson University</span>
                <span className="text-indigo-400/40 dark:text-sky-500/40">•</span>
              </span>
            ))}
          </div>
        </div>

        <section id="educational" className="max-w-5xl mx-auto px-6 py-16">
          <Reveal>
            <div className="text-center space-y-2 mb-14">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-indigo-600 dark:text-sky-400 transition-colors">
                CAREER & ACADEMIC PATH
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-950 dark:text-white transition-colors">
                Academic & Tech Experience
              </h2>
            </div>
          </Reveal>

          <div className="relative border-l-2 border-indigo-200 dark:border-zinc-800 ml-4 md:ml-32 space-y-12 transition-colors">
            {experiences.map((exp, index) => (
              <Reveal key={index} delay={index * 150}>
                <div className="relative pl-8 md:pl-10 group">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-indigo-600 dark:border-sky-400 group-hover:scale-125 transition-all" />
                  <div className="md:absolute md:-left-36 md:top-1.5 text-xs font-bold text-indigo-600 dark:text-sky-400 uppercase tracking-wider mb-2 md:mb-0 transition-colors">
                    {exp.year}
                  </div>
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition">
                    <h3 className="text-xl font-bold text-indigo-950 dark:text-white transition-colors">
                      {exp.role}
                    </h3>
                    <span className="text-xs font-semibold tracking-wider text-indigo-500 dark:text-sky-400 uppercase block mt-1 mb-4 transition-colors">
                      {exp.company}
                    </span>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 transition-colors">
                      {exp.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      {exp.tech.map((t, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 rounded-full bg-indigo-50/70 dark:bg-zinc-800 text-[11px] font-semibold text-indigo-700 dark:text-sky-300 border border-indigo-200/50 dark:border-zinc-700/50 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="skills" className="max-w-5xl mx-auto px-6 py-16">
          <Reveal>
            <div className="text-center space-y-2 mb-14">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-indigo-600 dark:text-sky-400 transition-colors">
                SKILLS & TOOLS (HOVER OR TAP FOR DETAILS)
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-950 dark:text-white transition-colors">
                My Tech Stack
              </h2>
            </div>
          </Reveal>

          <div className="space-y-12">
            <div>
              <Reveal>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-indigo-950 dark:text-white transition-colors">
                    Front-End & Web Development
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Core technologies I use to build modern, responsive, and component-based user interfaces.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {frontendSkills.map((item, idx) => {
                  const isSelected = activeSkill === item.name;
                  return (
                    <Reveal key={idx} delay={idx * 75}>
                      <div
                        onClick={() => setActiveSkill(isSelected ? null : item.name)}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-indigo-400 dark:hover:border-sky-400/60 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-sky-400 group-hover:scale-110 transition-all shrink-0">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                                {item.name}
                              </span>
                              <span className="text-xs font-bold text-indigo-600 dark:text-sky-400">
                                {item.level}%
                              </span>
                            </div>
                            {/* Animated Proficiency Bar */}
                            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-2">
                              <div
                                className="h-full bg-indigo-600 dark:bg-sky-400 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${item.level}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Tooltip / Usage Note revealed on hover or tap */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isSelected
                              ? 'max-h-20 opacity-100 mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800'
                              : 'max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-3 group-hover:pt-2.5 group-hover:border-t group-hover:border-zinc-100 dark:group-hover:border-zinc-800'
                          }`}
                        >
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {item.note}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            <div>
              <Reveal>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-indigo-950 dark:text-white transition-colors">
                    Software Engineering & Programming
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Programming languages, data structures, and foundational computer science principles.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {softwareSkills.map((item, idx) => {
                  const isSelected = activeSkill === item.name;
                  return (
                    <Reveal key={idx} delay={idx * 75}>
                      <div
                        onClick={() => setActiveSkill(isSelected ? null : item.name)}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-indigo-400 dark:hover:border-sky-400/60 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-sky-400 group-hover:scale-110 transition-all shrink-0">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                                {item.name}
                              </span>
                              <span className="text-xs font-bold text-indigo-600 dark:text-sky-400">
                                {item.level}%
                              </span>
                            </div>
                            {/* Animated Proficiency Bar */}
                            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-2">
                              <div
                                className="h-full bg-indigo-600 dark:bg-sky-400 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${item.level}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Tooltip / Usage Note revealed on hover or tap */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isSelected
                              ? 'max-h-20 opacity-100 mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800'
                              : 'max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-3 group-hover:pt-2.5 group-hover:border-t group-hover:border-zinc-100 dark:group-hover:border-zinc-800'
                          }`}
                        >
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {item.note}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="max-w-5xl mx-auto px-6 py-16">
          <Reveal>
            <div className="text-center space-y-2 mb-14">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-indigo-600 dark:text-sky-400 transition-colors">
                PORTFOLIO
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-950 dark:text-white transition-colors">
                Selected Works
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj, index) => (
              <Reveal key={proj.id} delay={index * 150}>
                <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition duration-300">
                  <div className={`h-48 bg-gradient-to-br ${proj.imageBg} p-5 flex flex-col justify-between text-white relative group overflow-hidden`}>
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        PROJECT
                      </span>
                      <Code className="w-4 h-4 opacity-70" />
                    </div>

                    <pre className="font-mono text-[11px] opacity-80 z-10 leading-relaxed overflow-hidden">
                      {proj.previewCode}
                    </pre>

                    <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-indigo-950 dark:text-white transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed transition-colors">
                        {proj.shortDesc}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-sky-400 hover:bg-indigo-50/50 dark:hover:bg-zinc-800 text-indigo-700 dark:text-sky-300 font-semibold text-xs tracking-wider uppercase transition-all text-center cursor-pointer"
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="text-center mt-12">
              <a
                href="https://github.com/CharlesJaycee"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-sky-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium text-xs tracking-wider uppercase transition-all gap-2"
              >
                VIEW MORE PROJECTS ON GITHUB <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
              </a>
            </div>
          </Reveal>
        </section>

        <section id="contacts" className="max-w-3xl mx-auto px-6 py-16">
          <Reveal>
            <div className="text-center space-y-2 mb-12">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-indigo-600 dark:text-sky-400 transition-colors">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-950 dark:text-white transition-colors">
                Contact Me
              </h2>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h3 className="font-bold text-lg text-indigo-950 dark:text-white transition-colors">
                  Send an Email directly.
                </h3>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-zinc-800 border border-indigo-200/60 dark:border-zinc-700 text-xs font-semibold text-indigo-700 dark:text-sky-300 hover:opacity-90 transition cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied Email!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>

              {formStatus === 'success' ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Message Sent!
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Thank you for reaching out to Charles Jaycee. Your message has been delivered and will be replied to shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  {formStatus === 'error' && (
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Failed to send message. Please try again or email charlesjayceegrico@gmail.com directly.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase font-semibold text-indigo-600 dark:text-sky-400 mb-2 transition-colors">
                      NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-indigo-600 dark:text-sky-400 mb-2 transition-colors">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-indigo-600 dark:text-sky-400 mb-2 transition-colors">
                      MESSAGE
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-sky-400 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-zinc-950 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {formStatus === 'sending' ? 'SENDING MESSAGE...' : 'SEND MESSAGE'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Charles Jaycee L. Grico. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => scrollToSection('home')} className="hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer">Back to top ↑</button>
          </div>
        </div>
      </footer>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-sky-400">
                PROJECT PREVIEW
              </span>
              <h3 className="text-2xl font-extrabold text-indigo-950 dark:text-white">
                {selectedProject.title}
              </h3>
            </div>

            <div className={`p-4 rounded-2xl bg-gradient-to-br ${selectedProject.imageBg} text-white font-mono text-xs shadow-inner`}>
              <pre className="whitespace-pre-wrap">{selectedProject.previewCode}</pre>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {selectedProject.fullDesc}
            </p>

            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-sky-400 uppercase tracking-wider block mb-2">
                TECHNOLOGIES USED
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-zinc-800 text-xs font-semibold text-indigo-700 dark:text-sky-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 dark:bg-sky-400 text-white dark:text-zinc-950 font-semibold text-xs tracking-wider uppercase transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Back-to-Top Button (Bottom-Left) */}
      <button
        onClick={() => scrollToSection('home')}
        aria-label="Back to Top"
        title="Back to Top"
        className={`fixed bottom-6 left-6 z-40 p-3 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl text-indigo-600 dark:text-sky-400 hover:scale-110 transition-all duration-300 cursor-pointer ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Smart Jay Assistant (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center space-x-2.5 px-4 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition duration-300 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-indigo-950 dark:text-white pr-1 transition-colors">
              Jay Assistant
            </span>
          </button>
        )}

        {chatOpen && (
          <div className="w-[340px] sm:w-[380px] h-[500px] bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-sky-400 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-950 dark:text-white leading-tight">
                    Jay Assistant
                  </h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-400 font-medium">Smart Mode</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[84%] px-4 py-3 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white dark:bg-sky-400 dark:text-zinc-950 rounded-br-xs font-medium shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-xs border border-zinc-200/60 dark:border-zinc-700/60'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.action && (
                      <button
                        onClick={() => {
                          if (msg.action.type === 'scroll') {
                            scrollToSection(msg.action.target);
                          } else if (msg.action.type === 'copy') {
                            handleCopyEmail();
                          }
                        }}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-sky-500/30 text-[11px] font-bold text-indigo-600 dark:text-sky-400 hover:opacity-90 transition cursor-pointer"
                      >
                        <span>
                          {msg.action.type === 'copy' && copiedEmail
                            ? 'Copied Email!'
                            : msg.action.label}
                        </span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <span className="text-[9px] text-zinc-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-1 px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 w-16">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200" />
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div className="px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950/30 border-t border-zinc-100 dark:border-zinc-800 flex items-center space-x-2 overflow-x-auto">
              {[
                'who are you',
                'skills',
                'projects',
                'contact'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => processAssistantQuery(chip)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-semibold text-indigo-600 dark:text-sky-300 hover:bg-indigo-50 dark:hover:bg-zinc-700 whitespace-nowrap transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-sky-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2.5 rounded-full bg-indigo-600 dark:bg-sky-400 text-white dark:text-zinc-950 disabled:opacity-40 hover:opacity-90 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}