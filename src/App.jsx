import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, ArrowRight, ArrowUp, ExternalLink, 
  Send, X, CheckCircle2, Zap, Code, Database, 
  Globe, Sparkles, GraduationCap, 
  Mail, Layers, Terminal, Volume2, Volume1, VolumeX, AlertCircle, SkipForward,
  Copy, Check, Clock, Cpu, Monitor, Play, Square
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

    if (ref.current) observer.observe(ref.current);
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

// Split-Text Staggered Section Header Component
function SectionHeading({ subtitle, title }) {
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
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = title.split(' ');

  return (
    <div ref={ref} className="text-center space-y-2 mb-14">
      <span
        className={`inline-block text-xs uppercase tracking-[0.25em] font-bold text-zinc-700 dark:text-zinc-400 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        {subtitle}
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white flex flex-wrap justify-center gap-x-2.5 gap-y-1">
        {words.map((word, i) => (
          <span
            key={i}
            style={{ transitionDelay: `${i * 95 + 100}ms` }}
            className={`inline-block transition-all duration-600 ease-out transform ${
              isVisible
                ? 'opacity-100 translate-y-0 blur-0'
                : 'opacity-0 translate-y-6 blur-[2px]'
            }`}
          >
            {word}
          </span>
        ))}
      </h2>
    </div>
  );
}

// Animated Section Divider Component
function AnimatedDivider() {
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
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center">
      <div className="relative w-full flex items-center justify-center">
        <div
          className={`h-[1px] bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-700 to-transparent transition-all duration-1000 ease-out ${
            isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'
          }`}
        />
        <span
          className={`absolute w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-700 delay-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        />
      </div>
    </div>
  );
}

// Glassmorphism "Spotlight Border" Card Component
function SpotlightCard({ children, className = '', onClick, darkMode }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: -300, y: -300 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-3xl p-[1px] overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: hovered
          ? `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${
              darkMode ? 'rgba(239, 68, 68, 0.75)' : 'rgba(220, 38, 38, 0.65)'
            }, transparent 75%)`
          : undefined
      }}
    >
      {/* Base border fallback */}
      <div className="absolute inset-0 rounded-3xl border border-zinc-300/80 dark:border-zinc-800 pointer-events-none" />
      <div className="relative h-full w-full rounded-[23px] bg-white dark:bg-zinc-900 transition-colors duration-300">
        {children}
      </div>
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

  // Top Scroll Progress Bar, Scroll Y & Floating Back-to-Top state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Custom Red Cursor Spotlight & Minimalist Cursor Ring state
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [ringPos, setRingPos] = useState({ x: -500, y: -500 });
  const [cursorHovering, setCursorHovering] = useState(false);

  // One-click Copy Email state
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Interactive Skill card selection
  const [activeSkill, setActiveSkill] = useState(null);

  // Live Manila Time & Dynamic Greeting state
  const [manilaTime, setManilaTime] = useState('');
  const [manilaGreeting, setManilaGreeting] = useState('Welcome');

  // 4-Track Ambient Background Playlist + Web Audio API Real-Time Equalizer + Fade + Scrubber + Volume
  const playlist = [
    { title: 'Ambient Track 1', src: './track1.mp3' },
    { title: 'Ambient Track 2', src: './track2.mp3' },
    { title: 'Ambient Track 3', src: './track3.mp3' },
    { title: 'Ambient Track 4', src: './track4.mp3' }
  ];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [showVolumePopover, setShowVolumePopover] = useState(false);
  const [volume, setVolume] = useState(0.28);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [eqBars, setEqBars] = useState([25, 45, 35, 60, 30]);
  const [audioIntensity, setAudioIntensity] = useState(0);

  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const userPausedRef = useRef(false);

  // Smart Chatbot + Guided Tour state
  const [chatOpen, setChatOpen] = useState(false);
  const [isTouring, setIsTouring] = useState(false);
  const tourTimeoutsRef = useRef([]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am Jay Assistant. Ask me anything about Charles Jaycee L. Grico, or tap "Give me a quick tour" for a guided walkthrough!',
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

  // Live Manila Time & Dynamic Greeting updater
  useEffect(() => {
    const updateClockAndGreeting = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(now);
        setManilaTime(formatted);

        const hour24 = parseInt(
          new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila',
            hour: 'numeric',
            hour12: false
          }).format(now),
          10
        );

        if (hour24 >= 5 && hour24 < 12) {
          setManilaGreeting('Good Morning from Manila');
        } else if (hour24 >= 12 && hour24 < 18) {
          setManilaGreeting('Good Afternoon from Manila');
        } else if (hour24 >= 18 && hour24 < 23) {
          setManilaGreeting('Good Evening from Manila');
        } else {
          setManilaGreeting('Late Night Coding Session');
        }
      } catch {
        setManilaTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setManilaGreeting('Welcome from Manila');
      }
    };
    updateClockAndGreeting();
    const timer = setInterval(updateClockAndGreeting, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio Fade-In & Fade-Out Helper
  const fadeAudioTo = (targetVol, durationMs = 450, onComplete) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const startVol = audioRef.current.volume;
    const steps = 15;
    const stepTime = durationMs / steps;
    const delta = (targetVol - startVol) / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep += 1;
      if (!audioRef.current) {
        clearInterval(fadeIntervalRef.current);
        return;
      }
      const nextVol = Math.max(0, Math.min(1, startVol + delta * currentStep));
      audioRef.current.volume = nextVol;

      if (currentStep >= steps) {
        audioRef.current.volume = Math.max(0, Math.min(1, targetVol));
        clearInterval(fadeIntervalRef.current);
        if (onComplete) onComplete();
      }
    }, stepTime);
  };

  // Initialize Web Audio API Analyser for real-time audio visualizer & Hero soundwave ring
  const setupAudioVisualizer = () => {
    if (!audioRef.current || audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 32;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      // Fallback animation handles bars if Web Audio context isn't permitted
    }
  };

  // Drive live equalizer bars + Hero Soundwave Ring intensity
  useEffect(() => {
    if (!isPlayingMusic) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setEqBars([20, 20, 20, 20, 20]);
      setAudioIntensity(0);
      return;
    }

    const updateBars = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const indices = [1, 3, 5, 7, 9];
        const nextBars = indices.map((idx) => {
          const val = dataArray[idx] || 0;
          return Math.max(18, Math.min(100, Math.round((val / 255) * 100)));
        });
        setEqBars(nextBars);
        const avg = nextBars.reduce((acc, v) => acc + v, 0) / nextBars.length;
        setAudioIntensity(avg / 100);
      } else {
        const nextBars = [
          25 + Math.round(Math.random() * 65),
          35 + Math.round(Math.random() * 60),
          20 + Math.round(Math.random() * 75),
          40 + Math.round(Math.random() * 55),
          25 + Math.round(Math.random() * 65)
        ];
        setEqBars(nextBars);
        setAudioIntensity(0.45);
      }
      animFrameRef.current = requestAnimationFrame(updateBars);
    };

    animFrameRef.current = requestAnimationFrame(updateBars);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlayingMusic]);

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

  // Autoplay audio on visit with smooth fade-in
  useEffect(() => {
    if (loading) return;

    const attemptAutoplay = () => {
      if (!audioRef.current || userPausedRef.current) return;
      setupAudioVisualizer();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      audioRef.current.volume = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          setPlayerExpanded(true);
          fadeAudioTo(volume, 700);
          cleanupListeners();
        })
        .catch(() => {
          // Wait for first user gesture if browser blocks autoplay
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

  // Cursor spotlight + smooth-trailing minimalist cursor ring tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target;
      const isInteractive =
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList.contains('cursor-pointer'));
      setCursorHovering(Boolean(isInteractive));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let rafId;
    const followCursor = () => {
      setRingPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.2,
        y: prev.y + (mousePos.y - prev.y) * 0.2
      }));
      rafId = requestAnimationFrame(followCursor);
    };
    rafId = requestAnimationFrame(followCursor);
    return () => cancelAnimationFrame(rafId);
  }, [mousePos]);

  useEffect(() => {
    if (chatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen, isTyping]);

  // Scroll tracking: Active section, Top Scroll Progress Bar, Parallax, and Floating Back-to-Top
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (currentScroll / docHeight) * 100)) : 0;
      setScrollProgress(pct);
      setShowBackToTop(currentScroll > 450);

      const sections = ['home', 'about', 'educational', 'skills', 'projects', 'contacts'];
      const scrollPosition = currentScroll + 220;

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
    setupAudioVisualizer();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    if (isPlayingMusic) {
      userPausedRef.current = true;
      fadeAudioTo(0, 350, () => {
        if (audioRef.current) audioRef.current.pause();
        setIsPlayingMusic(false);
      });
    } else {
      userPausedRef.current = false;
      audioRef.current.volume = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          setPlayerExpanded(true);
          fadeAudioTo(volume, 450);
        })
        .catch(() => setIsPlayingMusic(false));
    }
  };

  const nextTrack = () => {
    userPausedRef.current = false;
    setupAudioVisualizer();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    const switchAction = () => {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      setCurrentTrackIndex(nextIndex);
      setAudioProgress(0);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = 0;
          audioRef.current
            .play()
            .then(() => {
              setIsPlayingMusic(true);
              setPlayerExpanded(true);
              fadeAudioTo(volume, 450);
            })
            .catch(() => setIsPlayingMusic(false));
        }
      }, 50);
    };

    if (isPlayingMusic) {
      fadeAudioTo(0, 220, switchAction);
    } else {
      switchAction();
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const handleScrubAudio = (e) => {
    if (!audioRef.current || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = clickRatio * audioDuration;
    audioRef.current.currentTime = newTime;
    setAudioProgress(newTime);
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

  // Stop Guided Tour helper
  const stopGuidedTour = () => {
    tourTimeoutsRef.current.forEach((id) => clearTimeout(id));
    tourTimeoutsRef.current = [];
    setIsTouring(false);
  };

  // Start Guided Tour Mode in Jay Assistant
  const startGuidedTour = () => {
    stopGuidedTour();
    setIsTouring(true);

    const tourSteps = [
      {
        delay: 0,
        section: 'home',
        text: "Starting your guided tour! First up: Charles Jaycee's Hero overview—a BSIT student at Adamson University focused on C# and modern web development."
      },
      {
        delay: 3200,
        section: 'about',
        text: 'Step 2: About Me & Setup Bento. Here you can check his 1.00 GWA academic standing, core principles, and daily Visual Studio / React workflow.'
      },
      {
        delay: 6800,
        section: 'educational',
        text: 'Step 3: Academic & Tech Experience. A timeline covering his front-end web projects, C# OOP systems, and Loggy3 performance tracking.'
      },
      {
        delay: 10400,
        section: 'skills',
        text: 'Step 4: My Tech Stack. Hover or tap any skill card to inspect proficiency levels across React, Tailwind CSS, JavaScript, and C# (.NET).'
      },
      {
        delay: 14000,
        section: 'projects',
        text: 'Step 5: Selected Works. Explore his C# Student Management System, Responsive Tourist Page, and TCG Deck Strategy Calculator.'
      },
      {
        delay: 17600,
        section: 'contacts',
        text: 'Final Stop: Contact Me! You can copy his email in one click or send a direct message right from this form. Tour complete!'
      }
    ];

    tourSteps.forEach((step, idx) => {
      const tId = setTimeout(() => {
        scrollToSection(step.section);
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + idx,
            sender: 'bot',
            text: step.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (idx === tourSteps.length - 1) {
          setIsTouring(false);
        }
      }, step.delay);
      tourTimeoutsRef.current.push(tId);
    });
  };

  // Smart Jay Assistant response engine
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

    if (userText.toLowerCase().includes('tour')) {
      startGuidedTour();
      return;
    }

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
    }, 600);
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

  // Compute subtle mouse + scroll parallax offsets for Hero floating badges
  const normX = typeof window !== 'undefined' ? (mousePos.x - window.innerWidth / 2) / 45 : 0;
  const normY = typeof window !== 'undefined' ? (mousePos.y - window.innerHeight / 2) / 45 : 0;
  const scrollParallax = Math.min(35, scrollY * 0.08);

  const navSections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'educational', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contacts', label: 'Contacts' }
  ];

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
      imageBg: 'from-zinc-900 to-black',
      previewCode: 'STUDENT MANAGEMENT SYSTEM v1.0\n[Language: C# (.NET)]\n- Record Search & Data Entry\n- Multi-dimensional & Jagged Arrays\n- OOP Architecture & Input Validation',
      tags: ['C#', '.NET', 'OOP', 'DATA STRUCTURES', 'CONSOLE APP']
    },
    {
      id: 'tourist-portfolio',
      title: 'Responsive Tourist Landing Page',
      shortDesc: 'A single-page tourist guide website featuring custom card layouts, gradients, and embedded media.',
      fullDesc: 'Designed and developed a responsive single-page tourist website featuring localized navigation sections, custom CSS card layouts, background color gradients, embedded auto-play media, and GitHub social integration.',
      imageBg: 'from-neutral-900 to-zinc-950',
      previewCode: 'TOURIST PORTFOLIO WEBSITE\n[Tech: HTML5 + CSS3 + JS]\n- Responsive Card Layout & Gradients\n- Interactive Navigation Anchor Links\n- Embedded Media & Social Integration',
      tags: ['HTML5', 'CSS3', 'JAVASCRIPT', 'TAILWIND CSS', 'GITHUB']
    },
    {
      id: 'tcg-deck-builder',
      title: 'TCG Deck Strategy & Ratio Calculator',
      shortDesc: 'An interactive web application to calculate and optimize card ratios for competitive deck building.',
      fullDesc: 'Built an interactive utility web tool designed to calculate and optimize deck ratios between Basic, Stage 1, Stage 2 Pokémon, Trainer cards, and Energy distributions.',
      imageBg: 'from-stone-900 to-zinc-950',
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

  const scrubPercent = audioDuration > 0 ? Math.min(100, (audioProgress / audioDuration) * 100) : 0;

  return (
    <div className={darkMode ? 'dark bg-zinc-950 text-zinc-100 min-h-screen font-sans selection:bg-white selection:text-black transition-colors duration-300 relative overflow-x-hidden' : 'bg-[#f7f8fa] text-black min-h-screen font-sans selection:bg-black selection:text-white transition-colors duration-300 relative overflow-x-hidden'}>
      
      {/* Custom Monochrome & Red Scrollbar Styling + Film Grain Animation */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${darkMode ? '#09090b' : '#f4f4f5'};
        }
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#27272a' : '#a1a1aa'};
          border-radius: 9999px;
          border: 2px solid ${darkMode ? '#09090b' : '#f4f4f5'};
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
      `}</style>

      {/* Subtle Dot-Matrix / Blueprint Grid Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-45 dark:opacity-35 transition-opacity duration-300"
        style={{
          backgroundImage: darkMode
            ? 'radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px)'
            : 'radial-gradient(rgba(0, 0, 0, 0.14) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Grain / Film Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.035] dark:opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Smooth Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-black via-red-600 to-black dark:from-white dark:via-red-500 dark:to-white transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Custom Red Cursor Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: darkMode
            ? `radial-gradient(540px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.12), transparent 80%)`
            : `radial-gradient(540px circle at ${mousePos.x}px ${mousePos.y}px, rgba(220, 38, 38, 0.09), transparent 80%)`
        }}
      />

      {/* Custom Minimalist Cursor Ring (Desktop Pointer) */}
      <div
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-50 rounded-full border transition-[width,height,border-color,background-color] duration-200 ease-out"
        style={{
          width: cursorHovering ? '42px' : '26px',
          height: cursorHovering ? '42px' : '26px',
          transform: `translate3d(${ringPos.x - (cursorHovering ? 21 : 13)}px, ${
            ringPos.y - (cursorHovering ? 21 : 13)
          }px, 0)`,
          borderColor: cursorHovering
            ? 'rgba(239, 68, 68, 0.85)'
            : darkMode
            ? 'rgba(255, 255, 255, 0.35)'
            : 'rgba(0, 0, 0, 0.35)',
          backgroundColor: cursorHovering ? 'rgba(239, 68, 68, 0.08)' : 'transparent'
        }}
      />

      {/* Smooth Section Anchor Indicator Dots (Right Margin) */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end space-y-3">
        {navSections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              aria-label={`Jump to ${sec.label}`}
              className="group flex items-center gap-2.5 py-0.5 cursor-pointer"
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 text-black dark:text-white transition-all duration-200 ${
                  isActive
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {sec.label}
              </span>
              <span
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-2.5 bg-red-600 dark:bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                    : 'w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 group-hover:bg-black dark:group-hover:bg-white'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Multi-track Playlist Audio Player */}
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex].src}
        onEnded={nextTrack}
        onTimeUpdate={() => {
          if (audioRef.current) setAudioProgress(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setAudioDuration(audioRef.current.duration || 0);
        }}
        preload="auto"
      />

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-opacity duration-500">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white transition-colors">
              CHARLES JAYCEE
            </h1>
            <p className="text-xs tracking-[0.3em] font-medium text-zinc-700 dark:text-zinc-400 uppercase transition-colors">
              PORTFOLIO LOADING
            </p>
            <div className="w-56 h-[3px] bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto overflow-hidden relative mt-6">
              <div 
                className="h-full bg-black dark:bg-white transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <header className="fixed top-4 inset-x-0 z-40 px-4 pointer-events-none">
        <nav className="max-w-4xl mx-auto pointer-events-auto rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 shadow-lg shadow-black/[0.04] flex items-center justify-between transition-all duration-300">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-lg font-black tracking-tight text-black dark:text-white hover:opacity-80 transition-colors cursor-pointer"
          >
            JAY<span className="text-red-600 dark:text-red-500">.</span>
          </button>

          <div className="hidden md:flex items-center space-x-1">
            {navSections.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform active:scale-95 cursor-pointer ${
                  activeSection === link.id
                    ? 'bg-black dark:bg-white text-white dark:text-black font-semibold shadow-sm'
                    : 'text-zinc-800 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 relative">
            {/* Compact Expandable Mini-Player Pill with Real Audio Waveform, Scrubber & Volume Popover */}
            <div
              onMouseEnter={() => setPlayerExpanded(true)}
              onMouseLeave={() => {
                if (!isPlayingMusic) setPlayerExpanded(false);
                setShowVolumePopover(false);
              }}
              className="relative flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-300/80 dark:border-zinc-700/80 p-1 transition-all duration-300"
            >
              <button
                onClick={toggleMusic}
                aria-label="Toggle Background Music"
                title={isPlayingMusic ? 'Pause Music' : 'Play Ambient Music'}
                className={`p-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isPlayingMusic
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {isPlayingMusic ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Expandable Track Title + Live Equalizer + Clickable Audio Scrubber */}
              <div
                className={`flex flex-col justify-center overflow-hidden transition-all duration-300 ${
                  isPlayingMusic || playerExpanded
                    ? 'max-w-[175px] opacity-100 px-2.5'
                    : 'max-w-0 opacity-0 px-0'
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* Real-Time Audio Equalizer Bars */}
                  <div className="flex items-end gap-[2px] h-3 w-3.5 shrink-0" aria-hidden="true">
                    {eqBars.map((heightPct, i) => (
                      <span
                        key={i}
                        style={{ height: `${heightPct}%` }}
                        className="w-[2px] rounded-full bg-red-600 dark:bg-red-400 transition-all duration-75"
                      />
                    ))}
                  </div>

                  <span className="text-[11px] font-semibold text-black dark:text-zinc-200 truncate whitespace-nowrap">
                    {playlist[currentTrackIndex].title}
                  </span>
                </div>

                {/* Clickable Audio Scrubbing Progress Bar */}
                <div
                  onClick={handleScrubAudio}
                  title="Click to seek track position"
                  className="w-full h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mt-1 cursor-pointer overflow-hidden group/scrub"
                >
                  <div
                    className="h-full bg-black dark:bg-white group-hover/scrub:bg-red-600 dark:group-hover/scrub:bg-red-400 transition-all duration-100"
                    style={{ width: `${scrubPercent}%` }}
                  />
                </div>
              </div>

              {/* Volume Slider Popover Trigger */}
              <button
                type="button"
                onClick={() => setShowVolumePopover((prev) => !prev)}
                aria-label="Adjust Volume"
                title="Adjust Volume"
                className="p-1.5 rounded-full text-black dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300 cursor-pointer"
              >
                <Volume1 className="w-3.5 h-3.5" />
              </button>

              {/* Next Track Button */}
              <button
                onClick={nextTrack}
                aria-label="Next Track"
                title={`Next Track (${playlist[(currentTrackIndex + 1) % playlist.length].title})`}
                className="p-1.5 rounded-full text-black dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300 cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Volume Slider Popover */}
              {showVolumePopover && (
                <div className="absolute right-0 top-11 z-50 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-300 dark:border-zinc-800 shadow-xl flex items-center gap-2.5">
                  <VolumeX className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume Slider"
                    className="w-24 accent-red-600 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono font-bold text-black dark:text-zinc-200 w-7 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle Theme"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300/80 dark:border-zinc-700 transition-all duration-300 cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-white transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-black transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-28 pb-16 relative z-10">
        <section id="home" className="max-w-5xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 text-left">
            {/* Dynamic Greeting + Live Manila Time & Availability Status Pill */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-300/80 dark:border-zinc-800 shadow-sm text-xs">
              <span className="inline-flex items-center gap-1.5 font-bold text-black dark:text-zinc-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {manilaGreeting}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-zinc-800 dark:text-zinc-400">
                <Clock className="w-3 h-3 text-black dark:text-zinc-300" />
                {manilaTime || 'PHT'}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black dark:text-white transition-colors duration-300 min-h-[1.2em]">
                {typedTitle}
                <span className="inline-block w-[3px] h-[0.9em] bg-red-600 dark:bg-red-500 ml-1 align-middle animate-pulse transition-colors duration-300" />
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-800 dark:text-zinc-400 tracking-tight transition-colors duration-300">
                BSIT Student & Developer
              </h2>
            </div>

            <p className="text-zinc-900 dark:text-zinc-300 text-base leading-relaxed max-w-xl transition-colors duration-300">
              Welcome to my personal website! I am a passionate Information Technology student at Adamson University focused on C# programming logic, and responsive front-end web development.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => scrollToSection('projects')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm transition-all shadow-md gap-2 group cursor-pointer"
              >
                Explore Work 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a 
                href="#contacts"
                onClick={(e) => { e.preventDefault(); scrollToSection('contacts'); }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-zinc-400 dark:border-zinc-700 hover:border-black dark:hover:border-white bg-white/70 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-black dark:text-zinc-200 font-medium text-sm transition-all gap-2"
              >
                Get in Touch 
                <Mail className="w-4 h-4 text-black dark:text-zinc-300 transition-colors" />
              </a>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-xs uppercase tracking-widest font-bold text-zinc-800 dark:text-zinc-500 transition-colors">
                CONNECT
              </p>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://www.facebook.com/HeyItzceejay07/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 hover:border-black dark:hover:border-white bg-white dark:bg-zinc-900 text-black dark:text-zinc-300 hover:opacity-80 transition-all"
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
                  className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 hover:border-black dark:hover:border-white bg-white dark:bg-zinc-900 text-black dark:text-zinc-300 hover:opacity-80 transition-all"
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
                  className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 hover:border-black dark:hover:border-white bg-white dark:bg-zinc-900 text-black dark:text-zinc-300 hover:opacity-80 transition-all"
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
            {/* Hero Soundwave Ring Around Profile Photo (Reacts to live audio intensity) */}
            <div
              className="absolute w-76 h-84 sm:w-84 sm:h-100 rounded-[34px] border border-red-500/40 dark:border-red-500/45 pointer-events-none transition-all duration-150"
              style={{
                transform: `scale(${1 + audioIntensity * 0.065})`,
                opacity: isPlayingMusic ? 0.35 + audioIntensity * 0.55 : 0.12,
                boxShadow: isPlayingMusic
                  ? `0 0 ${Math.round(18 + audioIntensity * 28)}px rgba(239, 68, 68, ${
                      0.18 + audioIntensity * 0.35
                    })`
                  : 'none'
              }}
            />

            <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-zinc-300 dark:border-zinc-800 group z-10">
              <img 
                src={profileHome} 
                alt="Charles Jaycee" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating Badge 1 with Parallax Depth */}
            <div
              style={{
                transform: `translate3d(${-normX * 0.8}px, ${-normY * 0.8 - scrollParallax * 0.5}px, 0)`
              }}
              className="absolute -left-4 top-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-300 dark:border-zinc-800 shadow-xl rounded-2xl p-3.5 flex items-center space-x-3 transition-transform duration-150 ease-out z-20"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-black dark:text-zinc-200">
                BSIT Student{' '}
                <a
                  href="https://www.adamson.edu.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-zinc-400 hover:decoration-black dark:hover:decoration-white font-bold text-black dark:text-white transition-colors"
                >
                  @ Adamson
                </a>
              </span>
            </div>

            {/* Floating Badge 2 with Opposite Parallax Depth */}
            <div
              style={{
                transform: `translate3d(${normX * 1.1}px, calc(-50% + ${normY * 1.1 + scrollParallax * 0.4}px), 0)`
              }}
              className="absolute -right-4 top-1/2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-300 dark:border-zinc-800 shadow-xl rounded-2xl p-3.5 flex items-center space-x-3 transition-transform duration-150 ease-out z-20"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white transition-colors">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-black dark:text-zinc-200">
                C# & Front-End Focus
              </span>
            </div>

            {/* Floating Badge 3 with Parallax Depth */}
            <div
              style={{
                transform: `translate3d(${-normX * 0.6}px, ${normY * 0.9 - scrollParallax * 0.3}px, 0)`
              }}
              className="absolute -left-2 bottom-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-300 dark:border-zinc-800 shadow-xl rounded-2xl p-3.5 flex items-center space-x-3 transition-transform duration-150 ease-out z-20"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white transition-colors">
                <Code className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-black dark:text-zinc-200">
                Web & Software Dev
              </span>
            </div>
          </div>
        </section>

        <AnimatedDivider />

        <section id="about" className="max-w-5xl mx-auto px-6 py-16">
          <SectionHeading subtitle="DISCOVER" title="About Me" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Reveal delay={100} className="md:col-span-4">
              <SpotlightCard darkMode={darkMode} className="h-full shadow-sm">
                <div className="h-full p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="w-44 h-56 rounded-2xl overflow-hidden mb-4 border border-zinc-300 dark:border-zinc-700 shadow-md">
                    <img 
                      src={profileAbout} 
                      alt="Charles Jaycee Portrait" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-black dark:text-white transition-colors">
                    Charles Jaycee L. Grico
                  </h3>
                  <p className="text-xs text-zinc-800 dark:text-zinc-400 font-medium mt-1 transition-colors">
                    BSIT Student @ Adamson University
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>

            <div className="md:col-span-8 flex flex-col space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Reveal delay={200}>
                  <SpotlightCard darkMode={darkMode} className="h-full shadow-sm">
                    <div className="h-full p-6">
                      <h3 className="font-bold text-lg text-black dark:text-white mb-3 transition-colors">
                        Who Am I
                      </h3>
                      <p className="text-sm text-zinc-900 dark:text-zinc-300 leading-relaxed transition-colors">
                        I am a Bachelor of Science in Information Technology (BSIT) student at Adamson University dedicated to building clean, accessible web interfaces and software solutions.
                      </p>
                    </div>
                  </SpotlightCard>
                </Reveal>

                <Reveal delay={300}>
                  <SpotlightCard darkMode={darkMode} className="h-full shadow-sm">
                    <div className="h-full p-6">
                      <h3 className="font-bold text-lg text-black dark:text-white mb-3 transition-colors">
                        My Approach
                      </h3>
                      <p className="text-sm text-zinc-900 dark:text-zinc-300 leading-relaxed transition-colors">
                        I emphasize clean code structure, object-oriented principles, responsive layouts, and modern front-end practices in every academic project.
                      </p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              </div>

              <Reveal delay={400}>
                <SpotlightCard darkMode={darkMode} className="shadow-sm">
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-black dark:text-white mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-3 transition-colors">
                      Personal Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-400 block transition-colors">
                          NAME
                        </span>
                        <span className="text-sm font-semibold text-black dark:text-zinc-200 mt-0.5 block">
                          Charles Jaycee L. Grico
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-400 block transition-colors">
                          LOCATION
                        </span>
                        <span className="text-sm font-semibold text-black dark:text-zinc-200 mt-0.5 block">
                          Philippines
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-400 block transition-colors">
                          DEGREE PROGRAM
                        </span>
                        <span className="text-sm font-semibold text-black dark:text-zinc-200 mt-0.5 block">
                          BSIT (Information Technology)
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-400 block transition-colors">
                          GWA
                        </span>
                        <span className="text-sm font-semibold text-black dark:text-zinc-200 mt-0.5 block">
                          1.00
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-400 block transition-colors">
                          EMAIL (ONE-CLICK COPY)
                        </span>
                        <button
                          onClick={handleCopyEmail}
                          title="Click to copy email"
                          className="mt-0.5 inline-flex items-center gap-2 text-sm font-semibold text-black dark:text-zinc-200 hover:opacity-75 transition-opacity cursor-pointer group"
                        >
                          <span>charlesjayceegrico@gmail.com</span>
                          {copiedEmail ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Copied!
                            </span>
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                          )}
                        </button>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-400 block transition-colors">
                          EDUCATION
                        </span>
                        <span className="text-sm font-semibold text-black dark:text-zinc-200 mt-0.5 block">
                          Adamson University
                        </span>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>

          {/* Interactive Developer "Focus & Setup" Bento Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={150}>
              <SpotlightCard darkMode={darkMode} className="h-full shadow-sm">
                <div className="h-full p-6 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-300">
                      CURRENT FOCUS
                    </span>
                    <Cpu className="w-4 h-4 text-black dark:text-zinc-400 group-hover:rotate-12 transition-transform" />
                  </div>
                  <h4 className="font-bold text-base text-black dark:text-white mb-2">
                    Full-Stack & OOP Architecture
                  </h4>
                  <p className="text-xs text-zinc-800 dark:text-zinc-400 leading-relaxed">
                    Building role-based C# console applications and responsive React interfaces with clean, modular component logic.
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>

            <Reveal delay={250}>
              <SpotlightCard darkMode={darkMode} className="h-full shadow-sm">
                <div className="h-full p-6 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-300">
                      DEV ENVIRONMENT
                    </span>
                    <Monitor className="w-4 h-4 text-black dark:text-zinc-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-base text-black dark:text-white mb-2">
                    Visual Studio, Vite & Git
                  </h4>
                  <p className="text-xs text-zinc-800 dark:text-zinc-400 leading-relaxed">
                    Daily workflow powered by Visual Studio for .NET C#, VS Code with React & Tailwind CSS, and GitHub version control.
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>

            <Reveal delay={350}>
              <SpotlightCard darkMode={darkMode} className="h-full shadow-sm">
                <div className="h-full p-6 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-300">
                      MINDSET & STRATEGY
                    </span>
                    <Layers className="w-4 h-4 text-black dark:text-zinc-400 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h4 className="font-bold text-base text-black dark:text-white mb-2">
                    Iterative Problem Solving
                  </h4>
                  <p className="text-xs text-zinc-800 dark:text-zinc-400 leading-relaxed">
                    Applying analytical ratio optimization—from competitive TCG deck-building to clean software algorithms and UI polish.
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </section>

        <div className="py-8 overflow-hidden bg-zinc-200/50 dark:bg-zinc-900/40 border-y border-zinc-300/70 dark:border-zinc-800/60 my-8">
          <div className="whitespace-nowrap flex animate-marquee space-x-8 text-2xl sm:text-4xl font-extrabold tracking-tight text-black/20 dark:text-white/15 select-none transition-colors">
            {Array(6).fill(0).map((_, i) => (
              <span key={i} className="inline-flex items-center space-x-6">
                <span>Charles Jaycee</span>
                <span>•</span>
                <span>BSIT Student</span>
                <span>•</span>
                <span>Adamson University</span>
                <span>•</span>
              </span>
            ))}
          </div>
        </div>

        <section id="educational" className="max-w-5xl mx-auto px-6 py-16">
          <SectionHeading subtitle="CAREER & ACADEMIC PATH" title="Academic & Tech Experience" />

          <div className="relative border-l-2 border-zinc-300 dark:border-zinc-800 ml-4 md:ml-32 space-y-12 transition-colors">
            {experiences.map((exp, index) => (
              <Reveal key={index} delay={index * 150}>
                <div className="relative pl-8 md:pl-10 group">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-white group-hover:scale-125 transition-all" />
                  <div className="md:absolute md:-left-36 md:top-1.5 text-xs font-bold text-black dark:text-zinc-400 uppercase tracking-wider mb-2 md:mb-0 transition-colors">
                    {exp.year}
                  </div>
                  <SpotlightCard darkMode={darkMode} className="shadow-sm">
                    <div className="p-6 sm:p-8">
                      <h3 className="text-xl font-bold text-black dark:text-white transition-colors">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-bold tracking-wider text-zinc-700 dark:text-zinc-400 uppercase block mt-1 mb-4 transition-colors">
                        {exp.company}
                      </span>
                      <p className="text-sm text-zinc-900 dark:text-zinc-300 leading-relaxed mb-6 transition-colors">
                        {exp.desc}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
                        {exp.tech.map((t, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-black dark:text-zinc-200 border border-zinc-300/70 dark:border-zinc-700/50 transition-colors"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <AnimatedDivider />

        <section id="skills" className="max-w-5xl mx-auto px-6 py-16">
          <SectionHeading subtitle="SKILLS & TOOLS (HOVER OR TAP FOR DETAILS)" title="My Tech Stack" />

          <div className="space-y-12">
            <div>
              <Reveal>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-black dark:text-white transition-colors">
                    Front-End & Web Development
                  </h3>
                  <p className="text-xs text-zinc-800 dark:text-zinc-400 mt-0.5">
                    Core technologies I use to build modern, responsive, and component-based user interfaces.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {frontendSkills.map((item, idx) => {
                  const isSelected = activeSkill === item.name;
                  return (
                    <Reveal key={idx} delay={idx * 75}>
                      <SpotlightCard
                        darkMode={darkMode}
                        onClick={() => setActiveSkill(isSelected ? null : item.name)}
                        className="shadow-sm cursor-pointer"
                      >
                        <div className="p-5 flex flex-col justify-between group">
                          <div className="flex items-center space-x-3.5">
                            <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white group-hover:scale-110 transition-all shrink-0">
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-black dark:text-zinc-100">
                                  {item.name}
                                </span>
                                <span className="text-xs font-bold text-black dark:text-zinc-300">
                                  {item.level}%
                                </span>
                              </div>
                              {/* Animated Proficiency Bar */}
                              <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-2">
                                <div
                                  className="h-full bg-black dark:bg-white rounded-full transition-all duration-700 ease-out"
                                  style={{ width: `${item.level}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Tooltip / Usage Note revealed on hover or tap */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isSelected
                                ? 'max-h-20 opacity-100 mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800'
                                : 'max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-3 group-hover:pt-2.5 group-hover:border-t group-hover:border-zinc-200 dark:group-hover:border-zinc-800'
                            }`}
                          >
                            <p className="text-[11px] text-zinc-800 dark:text-zinc-400 leading-relaxed">
                              {item.note}
                            </p>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            <div>
              <Reveal>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-black dark:text-white transition-colors">
                    Software Engineering & Programming
                  </h3>
                  <p className="text-xs text-zinc-800 dark:text-zinc-400 mt-0.5">
                    Programming languages, data structures, and foundational computer science principles.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {softwareSkills.map((item, idx) => {
                  const isSelected = activeSkill === item.name;
                  return (
                    <Reveal key={idx} delay={idx * 75}>
                      <SpotlightCard
                        darkMode={darkMode}
                        onClick={() => setActiveSkill(isSelected ? null : item.name)}
                        className="shadow-sm cursor-pointer"
                      >
                        <div className="p-5 flex flex-col justify-between group">
                          <div className="flex items-center space-x-3.5">
                            <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white group-hover:scale-110 transition-all shrink-0">
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-black dark:text-zinc-100">
                                  {item.name}
                                </span>
                                <span className="text-xs font-bold text-black dark:text-zinc-300">
                                  {item.level}%
                                </span>
                              </div>
                              {/* Animated Proficiency Bar */}
                              <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-2">
                                <div
                                  className="h-full bg-black dark:bg-white rounded-full transition-all duration-700 ease-out"
                                  style={{ width: `${item.level}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Tooltip / Usage Note revealed on hover or tap */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isSelected
                                ? 'max-h-20 opacity-100 mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800'
                                : 'max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-3 group-hover:pt-2.5 group-hover:border-t group-hover:border-zinc-200 dark:group-hover:border-zinc-800'
                            }`}
                          >
                            <p className="text-[11px] text-zinc-800 dark:text-zinc-400 leading-relaxed">
                              {item.note}
                            </p>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <AnimatedDivider />

        <section id="projects" className="max-w-5xl mx-auto px-6 py-16">
          <SectionHeading subtitle="PORTFOLIO" title="Selected Works" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj, index) => (
              <Reveal key={proj.id} delay={index * 150}>
                <SpotlightCard darkMode={darkMode} className="h-full shadow-sm hover:shadow-lg">
                  <div className="h-full overflow-hidden rounded-[23px] flex flex-col">
                    <div className={`h-48 bg-gradient-to-br ${proj.imageBg} p-5 flex flex-col justify-between text-white relative group overflow-hidden`}>
                      <div className="flex items-center justify-between z-10">
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                          PROJECT
                        </span>
                        <Code className="w-4 h-4 opacity-70" />
                      </div>

                      <pre className="font-mono text-[11px] opacity-85 z-10 leading-relaxed overflow-hidden">
                        {proj.previewCode}
                      </pre>

                      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none" />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-black dark:text-white transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-sm text-zinc-900 dark:text-zinc-300 line-clamp-3 leading-relaxed transition-colors">
                          {proj.shortDesc}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="w-full py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-zinc-100 dark:hover:bg-zinc-800 text-black dark:text-white font-semibold text-xs tracking-wider uppercase transition-all text-center cursor-pointer"
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="text-center mt-12">
              <a
                href="https://github.com/CharlesJaycee"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-zinc-400 dark:border-zinc-700 hover:border-black dark:hover:border-white bg-white/70 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-black dark:text-zinc-200 font-semibold text-xs tracking-wider uppercase transition-all gap-2"
              >
                VIEW MORE PROJECTS ON GITHUB <ExternalLink className="w-3.5 h-3.5 text-black dark:text-white" />
              </a>
            </div>
          </Reveal>
        </section>

        <AnimatedDivider />

        <section id="contacts" className="max-w-3xl mx-auto px-6 py-16">
          <SectionHeading subtitle="GET IN TOUCH" title="Contact Me" />

          <Reveal delay={150}>
            <SpotlightCard darkMode={darkMode} className="shadow-sm">
              <div className="p-6 sm:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h3 className="font-bold text-lg text-black dark:text-white transition-colors">
                    Send an Email directly.
                  </h3>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-black dark:text-zinc-200 hover:opacity-80 transition cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-black dark:text-white">
                      Message Sent!
                    </h4>
                    <p className="text-sm text-zinc-800 dark:text-zinc-400">
                      Thank you for reaching out to Charles Jaycee. Your message has been delivered and will be replied to shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    {formStatus === 'error' && (
                      <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Failed to send message. Please try again or email charlesjayceegrico@gmail.com directly.</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs uppercase font-bold text-black dark:text-zinc-300 mb-2 transition-colors">
                        NAME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-black dark:text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-black dark:focus:border-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-black dark:text-zinc-300 mb-2 transition-colors">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-black dark:text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-black dark:focus:border-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-black dark:text-zinc-300 mb-2 transition-colors">
                        MESSAGE
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Your message here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-black dark:text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-black dark:focus:border-white transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full py-4 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {formStatus === 'sending' ? 'SENDING MESSAGE...' : 'SEND MESSAGE'}
                    </button>
                  </form>
                )}
              </div>
            </SpotlightCard>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-zinc-300/80 dark:border-zinc-800/80 py-8 text-center text-xs text-zinc-800 dark:text-zinc-400 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">© {new Date().getFullYear()} Charles Jaycee L. Grico. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => scrollToSection('home')} className="font-semibold hover:underline transition-colors cursor-pointer">Back to top ↑</button>
          </div>
        </div>
      </footer>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-700 dark:text-zinc-400">
                PROJECT PREVIEW
              </span>
              <h3 className="text-2xl font-extrabold text-black dark:text-white">
                {selectedProject.title}
              </h3>
            </div>

            <div className={`p-4 rounded-2xl bg-gradient-to-br ${selectedProject.imageBg} text-white font-mono text-xs shadow-inner`}>
              <pre className="whitespace-pre-wrap">{selectedProject.previewCode}</pre>
            </div>

            <p className="text-sm text-zinc-900 dark:text-zinc-300 leading-relaxed">
              {selectedProject.fullDesc}
            </p>

            <div>
              <span className="text-xs font-bold text-black dark:text-zinc-300 uppercase tracking-wider block mb-2">
                TECHNOLOGIES USED
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-black dark:text-zinc-200 border border-zinc-300/60 dark:border-zinc-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider uppercase transition cursor-pointer"
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
        className={`fixed bottom-6 left-6 z-40 p-3 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-300 dark:border-zinc-800 shadow-xl text-black dark:text-white hover:scale-110 transition-all duration-300 cursor-pointer ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Smart Jay Assistant with Guided Tour Mode (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center space-x-2.5 px-4 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition duration-300 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs font-bold text-black dark:text-white pr-1 transition-colors">
              Jay Assistant
            </span>
          </button>
        )}

        {chatOpen && (
          <div className="w-[340px] sm:w-[380px] h-[510px] bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black dark:text-white leading-tight">
                    Jay Assistant
                  </h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-700 dark:text-zinc-400 font-medium">
                      {isTouring ? 'Guided Tour Active' : 'Smart Mode'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  stopGuidedTour();
                  setChatOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer"
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
                        ? 'bg-black text-white dark:bg-white dark:text-black rounded-br-xs font-medium shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-200 rounded-bl-xs border border-zinc-200 dark:border-zinc-700/60'
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
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-[11px] font-bold text-black dark:text-white hover:opacity-85 transition cursor-pointer"
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
                  <span className="text-[9px] text-zinc-600 dark:text-zinc-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-1 px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 w-16">
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200" />
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Guided Tour + Quick Chips Bar */}
            <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-950/30 border-t border-zinc-200 dark:border-zinc-800 flex items-center space-x-2 overflow-x-auto">
              {isTouring ? (
                <button
                  onClick={stopGuidedTour}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold whitespace-nowrap transition cursor-pointer"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Stop tour</span>
                </button>
              ) : (
                <button
                  onClick={startGuidedTour}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold whitespace-nowrap transition cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Give me a quick tour</span>
                </button>
              )}

              {[
                'who are you',
                'skills',
                'projects',
                'contact'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => processAssistantQuery(chip)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-[10px] font-semibold text-black dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 whitespace-nowrap transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black disabled:opacity-40 hover:opacity-90 transition cursor-pointer"
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