import GradientButton from "../components/GradientButton";
import ReadingIll from "../assets/reading.svg";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#0f172a]">
      
      {/* Ambient glowing gradient */}
      <div className="absolute inset-0 bg-gradient-to-br 
          from-transparent 
          via-[#0b4150]/40 
          to-[#00eaff]/20 
          blur-[200px] opacity-40 -z-10">
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-20">

        {/* LEFT SECTION — Text */}
        <div className="space-y-6 animate-fade-up">

          <h1 className="text-5xl md:text-6xl font-extrabold
                         bg-gradient-to-br from-accent-teal via-accent-cyan to-accent-cyan-bright
                         bg-clip-text text-transparent drop-shadow-glow-strong">
            Detect AI-Generated Books
          </h1>

          <p className="text-text-muted max-w-xl leading-relaxed text-lg">
            BookGuard AI analyzes authorship authenticity, plagiarism, writing quality,
            and factual reliability — helping readers and publishers trust what they read.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <a href="/upload">
              <GradientButton text="Get Started" />
            </a>

            <a
              href="/how"
              className="text-text-muted hover:text-accent-cyan transition text-lg"
            >
              How it works →
            </a>
          </div>

          {/* Feature Chips */}
          <div className="flex gap-3 flex-wrap pt-6">
            <span className="px-4 py-2 bg-[#112334] border border-[#1e3a4d] rounded-full text-text-muted text-sm">
              AI Detection
            </span>
            <span className="px-4 py-2 bg-[#112334] border border-[#1e3a4d] rounded-full text-text-muted text-sm">
              Plagiarism Scan
            </span>
            <span className="px-4 py-2 bg-[#112334] border border-[#1e3a4d] rounded-full text-text-muted text-sm">
              Quality Metrics
            </span>
          </div>
        </div>

        {/* RIGHT SECTION — Illustration */}
        <div className="flex items-center justify-center animate-fade-up">
          <img
            src={ReadingIll}
            alt="Person reading illustration"
            className="w-full max-w-md drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
